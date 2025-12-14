"use server"

import fs from "fs";
import path from "path";
import { prisma } from "./prisma";
import { revalidatePath } from "next/cache";
import { isLoggedin } from "./auth";

type MoveAction = {
  type: "move"
  component: Comp,
  amount: number
}

type RemoveAction = {
  type: "remove",
  component: Comp
}

export type Comp = {
    id: number;
    importPath: string;
    nameComponent: string;
}

export type CmsAction = MoveAction | RemoveAction;


export async function getAvailableComponents(): Promise<string[]> {
  const fsRead = fs.readdirSync(path.join(process.cwd(), "src/components"));

  const result: string[] = [];

  fsRead.map((item)=>{
    if (item.endsWith('.tsx')) {
      result.push(item.replace(/\.tsx/, ""));
    }
  })

  return result;
}

export async function addComponentToPage(componentFile: string, slug: string, order?: number) {
  if (!await isLoggedin()) return;

  let comp;

  if(order){
    comp = await prisma.component.create({
      data: {
        importPath: componentFile,
        nameComponent: componentFile,
        order: order
      }
    })
  }
  else {
    comp = await prisma.component.create({
      data: {
        importPath: componentFile,
        nameComponent: componentFile
      }
    })
  }

  await prisma.page.update({
    where: { slug: slug },
    data: {
      components: {
        connect: { id: comp.id },
      },
    },
  });

  revalidatePath('/cms');
}

export async function executeActions(actions: CmsAction[]): Promise<boolean>{
  if (!await isLoggedin()) return false;

  try {
    actions.forEach(async (action) => {
      if (action.type == "move") {
        await prisma.component.update({
          where: {
            id: action.component.id
          },
          data: {
            order: {
              increment: action.amount
            }
          }
        })
      }
      if (action.type == "remove") {
        await prisma.component.delete({
          where: {
            id: action.component.id
          }
        })
      }
    });
    revalidatePath('/cms');
    return true;
  } catch {
    revalidatePath('/cms');
    return false;
  }
}
