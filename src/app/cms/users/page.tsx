import { prisma } from "@/src/lib/prisma"
import { Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import PopupButton from "../cmsComponents/PopupButton";
import * as React from "react"
import { revalidatePath } from "next/cache";

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

    await prisma.user.delete({
      where: { id: user.id }
    })
    revalidatePath('/cms/users')
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

                            <div className="text-lg font-semibold">Are you sure?</div>

                            <div className="text-muted-foreground text-base font-normal">you are deleting the user: &quot;{user.name}&quot;</div>

                            <div className="w-full flex justify-end">
                              <div className="flex gap-4">
                                <Button variant="outline">No</Button>
                                <Button variant="default" onClick={deleteUser.bind(undefined, user)}>Yes</Button>
                              </div>
                            </div>

                          </div>
                        </div>
                      </PopupButton>

                      <PopupButton icon={<Edit className="hover:cursor-pointer" />}>
                        <div className="fixed size-fit top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-foreground">

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
    </div>
  )
}
