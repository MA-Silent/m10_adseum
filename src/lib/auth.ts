import "server-only"

import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "./prisma";
import { cookies } from "next/headers";
import { Prisma } from "../generated/client";

export async function isLoggedin(): Promise<boolean>{
  const clientCookies = cookies();
  const authToken = (await clientCookies).get("authToken");

  if (!authToken) return false;

  try{
    jwt.verify(authToken.value, process.env.JWT_SECRET!);
    return true
  }
  catch (err) {
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

export async function createSession(email: string, password: string): Promise<string> {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    }
  });

  if (user == null || !(await bcrypt.compare(password, user.password))) {
    return "Incorrect email or password!";
  }

  return jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: "15min" })
}
