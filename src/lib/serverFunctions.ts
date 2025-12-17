"use server"

import fs from "fs";
import path from "path";
import { prisma } from "./prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { isLoggedin } from "./auth";

type MoveAction = {
  type: "move"
  componentID: number,
  amount: number
}

type RemoveAction = {
  type: "remove",
  componentID: number
}

type InsertTextAction = {
  type: "InsertText"
  key: string
  componentID: number
  contentEN: string
}

export type Comp = {
  id: number;
  importPath: string;
  nameComponent: string;
}

export type Page = {
   id: number;
   slug: string;
   title: string;
}

type LocaleFile = {
  components: Record<string, {content:string}>
}

export type CmsAction = MoveAction | RemoveAction | InsertTextAction;

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

export async function executeActions(actions: CmsAction[], pageSlug: string): Promise<boolean>{
  if (!await isLoggedin()) return false;

  try {
    let last: CmsAction | undefined;
    let moveAmount = 0;

    for(const action of actions){
      if (last?.componentID == action.componentID){
        if (action.type == 'move'){
          moveAmount += action.amount;
        }
      } else {
        if(last?.componentID && moveAmount !== 0){
          await prisma.component.update({
            where: {
              id: last.componentID,
            },
            data:{
              order: {
                increment: moveAmount
              }
            }
          })
        }
        moveAmount = action.type === 'move' ? action.amount : 0;
      }

      if(action.type === 'remove'){
        await prisma.component.delete({
          where: { id: action.componentID }
        })
      }

      if(action.type == 'InsertText'){
        const resolvedPath = path.resolve(process.cwd(), "locales/en.json");

        const LocaleFile: LocaleFile = JSON.parse(fs.readFileSync(resolvedPath, {encoding: 'utf-8'}));

        const key = action.key

        LocaleFile.components[key] ??= {content: ""}

        LocaleFile.components[key].content = action.contentEN;

        fs.writeFileSync(resolvedPath, JSON.stringify(LocaleFile))
      }

      last = action;
    }

    if(last?.componentID && moveAmount !== 0){
      await prisma.component.update({
        where: { id: last.componentID },
        data: {
          order: {
            increment: moveAmount,
          }
        }
      })
    }

    revalidateTag(`page:${pageSlug}`, 'max')
    revalidatePath('/cms');
    return true;

  } catch {
    revalidatePath('/cms');
    return false;
  }
}
