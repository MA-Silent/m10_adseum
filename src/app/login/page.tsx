import { redirect } from "next/navigation";
import {default as LoginForm, type ActionReturn} from "./LoginForm"
import { z } from "zod";
import { createSession } from "@/src/lib/auth";
import { cookies } from "next/headers";

const loginSchema = z.object({
  email: z.email().toLowerCase(),
  password: z.string()
})

const formAction = async (_: ActionReturn, formData: FormData): Promise<ActionReturn> => {
  "use server"

  const { data, success, error } = loginSchema.safeParse(Object.fromEntries(formData));

  if(success){
    const [authToken, refreshToken, error] = await createSession(data.email, data.password)

    if(error){
      throw new Error(error);
    }

    const cooky = await cookies();

    cooky.set("authToken", authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })

    cooky.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    })

    redirect('/cms/')
  }

  return error.issues.map(issue => issue.message).join(", ");
}

export default function LoginPage(){
  return(
    <>
      <section className="size-full flex items-center justify-center">
        <LoginForm action={formAction}/>
      </section>
    </>
  )
}
