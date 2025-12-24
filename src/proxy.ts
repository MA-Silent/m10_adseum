import { NextRequest, NextResponse } from "next/server";
import { isLoggedin } from "./lib/auth";
import jwt from "jsonwebtoken";
import { prisma } from "./lib/prisma";
import * as bcrypt from "bcrypt"

type DecodedRefeshToken = {
  sessionToken: string,
  sessionID: number,
  iat: number,
  exp: number
}

let test: any = ""

export async function proxy(req: NextRequest) {
  const response = NextResponse.next();
  if(!(await isLoggedin())){
    const cooky = response.cookies;

    const refreshCookie = req.cookies.get("refreshToken");
    if (!refreshCookie) return;

    try {
      const refreshToken = jwt.verify(refreshCookie.value, process.env.JWT_SECRET!) as DecodedRefeshToken;
      const session = await prisma.session.findUnique({
        where:{
          id: refreshToken.sessionID
        }
      })

      if (!session) return;

      if(!await bcrypt.compare(refreshToken.sessionToken, session.token)){
        return;
      }

      const authToken = jwt.sign({ userId: session.userId }, process.env.JWT_SECRET!, { expiresIn: "15min" });
      cooky.set("authToken",authToken,{
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
      })
    }
    catch (e){
      console.log(e);
    }
  }
  return response;
}

export const config = {
  matcher: [
    // Exclude API routes, static files, image optimizations, and .png files
    '/((?!api|_next/static|_next/image|.*\\.png$).*)',
  ],
}
