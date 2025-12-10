"use server"

import fs from "fs";
import path from "path";
import { prisma } from "./prisma";
import { revalidatePath } from "next/cache";
import { isLoggedin } from "./auth";

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

export async function addComponentToPage(componentFile: string, slug: string){
  if (!await isLoggedin()) return;

  const comp = await prisma.component.create({
    data: {
      importPath: componentFile,
      nameComponent: componentFile
    }
  })

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
