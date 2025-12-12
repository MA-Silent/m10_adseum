import { ScrollArea } from "@/components/ui/scroll-area";
import { isLoggedin } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

export default async function CmsLayout({ children }: React.PropsWithChildren) {
  if (!(await isLoggedin())) {
    redirect("/login");
  }

  const pages = await prisma.page.findMany();

  return (
    <div className="w-full h-full flex">
      <div className="bg-sidebar-accent h-full w-96 flex flex-col items-center">
        <div className="w-full h-16 flex">
          <div className="size-full items-center justify-center flex">Logo</div>
        </div>

        <ScrollArea className="max-h-96 w-full border rounded border-foreground/20">
          <div className="p-4">
            <h2 className="mb-3 leading-none font-semibold text-2xl">Pages</h2>
            <div className="inline-flex flex-col gap-1">
              {pages.map((page, index) => {
                return (
                  <React.Fragment key={page.id}>
                    <Link href={`/cms/${page.slug}`} className="cursor-pointer w-full text-foreground/80 hover:text-white  font-normal text-lg" > {page.title} </Link>
                    {index !== pages.length - 1 && <div className="w-full h-px bg-current/20"/>}
                  </React.Fragment>
                )
              })}
            </div>
          </div>
        </ScrollArea>

      </div>
      <div className="w-full h-full">
        {children}
      </div>
    </div>
  );
}
