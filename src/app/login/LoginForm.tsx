"use client"

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldError
} from "@/components/ui/field"

import { Input } from "@/components/ui/input"
import { useActionState } from "react"

export type ActionReturn = string | undefined
type LoginFormProps = {
  action: (_: ActionReturn, formData: FormData) => Promise<ActionReturn>;
}

export default function LoginForm({ action }: LoginFormProps){
  const [state, formAction, isPending] = useActionState(action, undefined);
  return (
    <>
      <form className="max-w-sm w-full" action={formAction} >
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input id="email" type="email" name="email" placeholder="example@example.com" />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input id="password" type="password" name="password" placeholder="••••••••" />
            </Field>
            <Field>
              <FieldError>{state}</FieldError>
              <Button>Submit</Button>
            </Field>
          </FieldGroup>
        </FieldSet>
      </form>
    </>
  )
}
