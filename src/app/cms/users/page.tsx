import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input";
import { prisma } from "@/src/lib/prisma"
import { Edit, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import PopupButton from "../cmsComponents/PopupButton";
import * as React from "react"
import { revalidatePath } from "next/cache";
import { isLoggedin } from "@/src/lib/auth";
import z from "zod";
import * as bcrypt from "bcrypt"
import { Prisma } from "@/src/generated/client";

type User = {
  id: string;
  password: string;
  email: string;
  name: string;
}

export default async function userManagementPage() {
  const users = await prisma.user.findMany();

  async function deleteUser(user: User) {
    'use server'
    if (!(await isLoggedin())) return;

    await prisma.session.deleteMany({
      where: {
        userId: user.id
    } })

    await prisma.user.delete({
      where: { id: user.id }
    })

    revalidatePath('/cms/users')
  }

  async function editUser(user: User, newPassword: string, newEmail: string): Promise<boolean> {
    'use server'
    if (!(await isLoggedin())) return false;
    let result: boolean = false;

    try {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          email: newEmail,
          password: await bcrypt.hash(newPassword, 10)
        }
      })
      result = true;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        result = false;
      }
    }
    revalidatePath('/cms/users');
    return result;
  }

  async function addUser(email: string, password: string): Promise<boolean> {
    'use server'

    try {
      await prisma.user.create({
        data: {
          email: email,
          name: email,
          password: await bcrypt.hash(password, 10)
        }
      });
    } catch {
      return false
    }

    revalidatePath('/cms/users');

    return true;
  }

  return(
    <div>
      <table className="max-h-full overflow-auto">
        <thead>
          <tr className="bg-secondary">
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Identifier</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {users.map((user, index)=>{
            return (
              <React.Fragment key={index}>
                <tr className="gap-2 odd:bg-muted-foreground odd:text-background even:bg-accent border-ring">
                  <td className="border border-inherit px-4 py-2">{user.name}</td>
                  <td className="border border-inherit px-4 py-2">{user.email}</td>
                  <td className="border border-inherit px-4 py-2">{user.id}</td>
                  <td className="align-middle">
                    <div className="flex gap-1 px-1">

                      <PopupButton icon={<Trash className="stroke-destructive-foreground hover:cursor-pointer" />}>
                        <div className="fixed size-fit top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-foreground">
                          <div className="border p-6 h-fit w-96 rounded-2xl bg-background">

                            <h2 className=" font-semibold">Are you sure?</h2>

                            <p className="text-muted-foreground font-normal">you are deleting the user: &quot;{user.name}&quot;</p>

                            <div className="w-full flex justify-end pt-4">
                              <div className="flex gap-4">
                                <Button className="cursor-pointer" variant="outline">No</Button>
                                <Button className="cursor-pointer" variant="default" onClick={deleteUser.bind(undefined, user)}>Yes</Button>
                              </div>
                            </div>

                          </div>
                        </div>
                      </PopupButton>

                      <PopupButton callBack={async (_, rawFormData): Promise<{ success: boolean }> => {
                        'use server'
                        if (!(await isLoggedin())) return { success: false };

                        const editSchema = z.object({ email: z.email(), password: z.string() })
                        const { success, data} = editSchema.safeParse( Object.fromEntries(rawFormData.entries()) )
                        if (!success) return {success: false};

                        return { success: await editUser(user, data.password, data.email) };
                      }} toastData={{ title: 'An error occurred', description: 'An error occurred while trying to update a user' }}
                      icon={<Edit className="hover:cursor-pointer" />}>
                        <div className="fixed size-fit top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-foreground">
                          <div className="relative h-fit w-xl bg-background border rounded-2xl p-6">
                            <h1>Editing: &quot;{user.name}&quot;</h1>

                            <FieldSet className="pt-6">
                              <FieldGroup>
                                <Field>
                                  <FieldLabel htmlFor="email">Email</FieldLabel>
                                  <Input id="email" type="email" name="email" defaultValue={user.email} placeholder="example@example.com" />
                                </Field>
                                <Field>
                                  <FieldLabel htmlFor="password">Password</FieldLabel>
                                  <Input id="password" type="password" name="password" placeholder="••••••••" />
                                </Field>
                                <Field className="flex flex-row">
                                  <div className="flex gap-2 justify-end">
                                    <Button>Submit</Button>
                                  </div>
                                </Field>
                              </FieldGroup>
                            </FieldSet>

                          </div>
                        </div>
                      </PopupButton>
                    </div>
                  </td>
                </tr>
              </React.Fragment>
            )
          })}
        </tbody>
      </table>

      <PopupButton callBack={async (_, rawFormData): Promise<{ success: boolean }> => {
        'use server'
        if (!(await isLoggedin())) return { success: false };

        const editSchema = z.object({ email: z.email(), password: z.string() })
        const { success, data} = editSchema.safeParse( Object.fromEntries(rawFormData.entries()) )
        if (!success) return {success: false};

        return {
          success: await addUser(data.email, data.password)
        };
      }} toastData={{ title: 'An error occurred', description: 'An error occurred while trying to add a user' }}
      icon={<Plus className="hover:cursor-pointer" />}>
        <div className="fixed size-fit top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-foreground">
          <div className="relative h-fit w-xl bg-background border rounded-2xl p-6">
            <h1>Adding a user</h1>

            <FieldSet className="pt-6">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input id="email" type="email" name="email" defaultValue="example@example.com" placeholder="example@example.com" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input id="password" type="password" name="password" placeholder="••••••••" />
                </Field>
                <Field className="flex flex-row">
                  <div className="flex gap-2 justify-end">
                    <Button>Submit</Button>
                  </div>
                </Field>
              </FieldGroup>
            </FieldSet>

          </div>
        </div>
      </PopupButton>

    </div>
  )
}
