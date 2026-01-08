import { ScrollArea } from "@/components/ui/scroll-area";
import { isLoggedin } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import AddPageButton from "./cmsComponents/AddPageButton";
import type { ActionReturn } from "./cmsComponents/AddPageButton";
import z from "zod";
import { revalidatePath } from "next/cache";
import { revalidateTag } from "next/cache";
import { Prisma } from "@/src/generated/client";
import { cmsNav } from "./cmsRoutes";
import PopupButton from "./cmsComponents/PopupButton";
import { Wrench } from "lucide-react";
import { Field, FieldLabel, FieldGroup, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toaster } from "sonner"
import { updateTag } from "next/cache";

const pageSchema = z.object({
  slug: z.string(),
  name: z.string()
})

const addPage = async (_: ActionReturn, formData: FormData): Promise<ActionReturn> => {
  "use server"
  const { data, success, error } = pageSchema.safeParse(Object.fromEntries(formData));

  if(success){
    const slug = data.slug
      .toLowerCase()
      .trim()
      .replace(/[^a-zA-Z- ]/gi, '')
      .replace(/\s+/gi, '-')
      .replace(/-+/g, '-')

    const name = data.name;
    try {
      await prisma.page.create({
        data: {
          title: name,
          slug: slug
        }
      });
    }catch (e){
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
        return "Page already exists!"
      }
    }

    revalidateTag(`page:${slug}`, 'max')
    revalidateTag('pages', 'max');
    revalidatePath('/cms');
  }else{
    await new Promise(resolve => setTimeout(resolve, 600))
  }

  return error?.issues.map((issue) => issue.message).join(', ');
}

export default async function CmsLayout({ children }: React.PropsWithChildren) {
  if (!(await isLoggedin())) {
    redirect("/login");
  }

  const pages = await prisma.page.findMany();

  return (
    <div className="w-full min-h-full h-auto flex">
      <div className="bg-sidebar-accent min-h-full h-auto w-96 flex flex-col items-center">
        <div className="w-full h-16 flex">
          <div className="size-full items-center justify-center flex">Logo</div>
        </div>

        <ScrollArea className="max-h-96 w-full border rounded border-foreground/20">
          <div className="p-4">
            <h2 className="flex justify-between mb-3 leading-none font-semibold text-2xl">
              Pages
              <AddPageButton action={addPage} />
            </h2>
            <div className="inline-flex flex-col gap-1">
              {pages.map((page, index) => {
                return (
                  <React.Fragment key={page.id}>
                    <div className="flex flex-row gap-1">
                      <Link href={`/cms/${page.slug}`} className="cursor-pointer w-full text-foreground/80 hover:text-foreground font-normal text-lg" > {page.title} </Link>
                      <PopupButton icon={<Wrench />} toastData={{title: 'An error ooccurred', description: 'There was an error while trying to update the page'}} callBack={async (_, rawFormData) => {
                        'use server'
                        const formSchema = z.object({
                          title: z.string(),
                          shown: z.string().default('off')
                        })
                        const { success, data } = formSchema.safeParse( Object.fromEntries(rawFormData) );

                        if (success) {
                          await prisma.page.update({
                            where: { slug: page.slug },
                            data: { shown: data.shown == 'on' ? true : false, title: data.title }
                          });

                          console.log(`${JSON.stringify(data)}`)

                          updateTag('pages');
                        }

                        return { success: success }
                      }} >
                        <div className="fixed size-fit top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-foreground">
                          <div className="border p-6 h-fit w-96 rounded-2xl bg-background">

                            <FieldSet className="pt-6">
                              <FieldGroup>
                                <Field>
                                  <FieldLabel htmlFor="title">Title</FieldLabel>
                                  <Input id="title" type="text" name="title" defaultValue={page.title} />
                                </Field>

                                <div className="flex flex-row ">
                                  <Input className="size-4" id="shown" type="checkbox" name="shown" defaultChecked={page.shown} />
                                  <FieldLabel className="px-2" htmlFor="shown">Public</FieldLabel>
                                </div>

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
                    {index !== pages.length - 1 && <div className="w-full h-px bg-current/20"/>}
                  </React.Fragment>
                )
              })}
            </div>
          </div>
        </ScrollArea>

        <div className="flex flex-col w-full h-auto gap-2 p-4">
          {cmsNav.map((item, index)=>{
            return (
              <Link className="text-foreground/80 hover:text-foreground font-semibold text-xl size-fit" href={item.href} key={index}>{item.label}</Link>
            )
          })}
        </div>

      </div>
      <div className="w-full min-h-full h-auto">
        <Toaster theme="dark" />
        {children}
      </div>
    </div>
  );
}
