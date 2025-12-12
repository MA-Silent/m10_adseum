"use server"
import { Minus } from "lucide-react"
import { prisma } from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";
import { isLoggedin } from "@/src/lib/auth";
import { revalidateTag } from "next/cache";

type Comp = {
    id: number;
    importPath: string;
    nameComponent: string;
}

async function onClick(comp: Comp, pageID: number){
  "use server"
  if (await isLoggedin()) {
    const page = await prisma.page.findUnique({ where: { id: pageID }, include: { components: true } });

    if (!page) {
      return;
    }


    if(page.components.some((component) => component.id === comp.id)){
      await prisma.component.delete({
        where: {
          pages: {
            some: {
              id: pageID
            }
          },
          id: comp.id,
        }
      });
    }
    revalidateTag(`page${page.slug}`, 'max')
  }
  revalidatePath('/cms');
}

export default async function CmsRemoveButton({ component, pageID }: {component : Comp, pageID: number}){

  return(
    <button onClick={onClick.bind(undefined, component, pageID)} className="absolute top-0 right-0 size-6 bg-red-500/40 text-white z-40"><Minus className="size-6" /></button>
  )
}
