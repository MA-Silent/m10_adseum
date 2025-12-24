import { prisma } from "./prisma"
import { unstable_cache } from "next/cache"
import fs from "fs";
import path from "path";
import { LocaleFile } from "./serverFunctions";
import { getLocale } from "next-intl/server";
import { getMiddlewareRouteMatcher } from "next/dist/shared/lib/router/utils/middleware-route-matcher";

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
    const locale = (await getLocale()).trim().toLowerCase();
    const result = await prisma.localeText.findUnique({ where: { key: textKey } }) || {contentEN: "No Text Found", contentNL: "No Text Found"}

    return locale == 'nl' ? result.contentNL : result.contentEN
  },
  ['DynamicText', textKey],
  {
    tags: [`DynamicText:${textKey}`]
  }
)()
