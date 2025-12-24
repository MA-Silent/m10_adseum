import { prisma } from "./prisma"
import { unstable_cache } from "next/cache"
import fs from "fs";
import path from "path";
import { LocaleFile } from "./serverFunctions";
import { getLocale } from "next-intl/server";

type ComponentPage = ({ components: { importPath: string; nameComponent: string; order: number; id: number; }[]; } & { id: number; slug: string; title: string; }) | null
type Page = { id: number; title: string; slug: string; }

export const getPage = (page_slug: string): Promise<ComponentPage> => unstable_cache(
  async () => {
    return await prisma.page.findFirst({
      where: {
        slug: page_slug
      },
      include: {
        components: true
      }
    })
  },
  ['page', page_slug],
  {
  tags: [`page:${page_slug}`]
  }
)()

export const getPages = (): Promise<Page[]> => unstable_cache(
  async () => {
    return await prisma.page.findMany()
  },
  ['pages'],
  {
    tags: ['pages']
  }
)()

export const getDynamicText = (textKey: string): Promise<string> => unstable_cache(
  async () => {
    'use server'
    const localeFile: LocaleFile = JSON.parse( fs.readFileSync(path.resolve(process.cwd(), `locales/${await getLocale().then((e)=>e.trim().toLowerCase())}.json`), {encoding: 'utf-8'}) )
    const result = localeFile.components[textKey].content || "No Text"

    return result
  },
  ['DynamicText', textKey],
  {
    tags: [`DynamicText:${textKey}`]
  }
)()
