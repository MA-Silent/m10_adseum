import { NextRequest, NextResponse } from "next/server";
import { isLoggedin } from "./lib/auth";
import jwt from "jsonwebtoken";
import { prisma } from "./lib/prisma";

type DecodedRefeshToken = {
  userId: string,
  iat: number,
  exp: number
}

export async function proxy(req: NextRequest) {
  const response = NextResponse.next();
  if(!(await isLoggedin())){
    const cooky = response.cookies;

    const refreshToken = req.cookies.get("refreshToken");
    if (!refreshToken) return;

    try {
      const refeshToken = jwt.verify(refreshToken.value, process.env.JWT_SECRET!) as DecodedRefeshToken;
      const user = await prisma.user.findUnique({
        where:{
          id: refeshToken.userId
        }
      })

      if (!user) return;

      const authToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: "15min" });
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
