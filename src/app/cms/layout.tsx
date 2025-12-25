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
                    <Link href={`/cms/${page.slug}`} className="cursor-pointer w-full text-foreground/80 hover:text-foreground font-normal text-lg" > {page.title} </Link>
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
        {children}
      </div>
    </div>
  );
}
