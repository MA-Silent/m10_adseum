import "server-only"

import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "./prisma";
import { cookies } from "next/headers";
import { Prisma } from "../generated/client";
import { randomUUID } from "crypto";

export async function isLoggedin(): Promise<boolean>{
  const clientCookies = cookies();
  const authToken = (await clientCookies).get("authToken");

  if (!authToken) return false;

  try{
    jwt.verify(authToken.value, process.env.JWT_SECRET!);
    return true
  }
  catch {
    return false;
  }
}

export async function registerUser(email: string, password: string, username: string){
  try{
    const user = await prisma.user.create({
      data: {
        email: email.trim().toLowerCase(),
        name: username.trim(),
        password: (await bcrypt.hash(password, await bcrypt.genSalt(10)))
      }
    });
  }
  catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return "User already exists!"
    }
  }

}

export async function createSession(email: string, password: string): Promise<string[]> {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    }
  });

  if (user == null || !(await bcrypt.compare(password, user.password))) {
    const array: string[] = [];

    array[2] = "Wrong username or password";

    return array
  }

  const uuid = randomUUID();

  const session = await prisma.session.upsert({
    where: {
      userId: user.id,
    },
    update: {
      token: await bcrypt.hash(uuid, 10)
    },
    create: {
      userId: user.id,
      token: await bcrypt.hash(uuid, 10)
    }
  })

  return [jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: "15min" }), jwt.sign({ sessionToken: uuid, sessionID: session.id }, process.env.JWT_SECRET!, {expiresIn: "7d"})]
}
