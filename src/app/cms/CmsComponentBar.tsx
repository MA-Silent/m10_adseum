"use server"
import { ArrowDown, ArrowUp, Minus } from "lucide-react"
import { prisma } from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";
import { isLoggedin } from "@/src/lib/auth";
import { revalidateTag } from "next/cache";

export type Comp = {
    id: number;
    importPath: string;
    nameComponent: string;
}

async function removeComponent(comp: Comp, pageID: number){
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

async function moveComponent(comp: Comp, amount: number){
  "use server"
  if(await isLoggedin()){
    await prisma.component.update({
      where: {
        id: comp.id,
      },
      data: {
        order: {
          increment: amount,
        }
      }
    })
    revalidatePath('/cms');
  }
}

export default async function CmsRemoveButton({ component, pageID }: {component : Comp, pageID: number}){

  return(
    <div className="absolute top-0 right-0 z-40">
      <button onClick={removeComponent.bind(undefined, component, pageID)} className="size-6 bg-red-500/40 text-white"><Minus className="size-6" /></button>
      <button onClick={moveComponent.bind(undefined, component, -1)} className="size-6 bg-sky-500/40 text-white mx-1"><ArrowUp /></button>
      <button onClick={moveComponent.bind(undefined, component, 1)} className="size-6 bg-sky-500/40 text-white"><ArrowDown /></button>
    </div>
  )
}
