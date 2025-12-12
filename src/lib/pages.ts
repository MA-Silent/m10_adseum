import { prisma } from "./prisma"
import { unstable_cache } from "next/cache"

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
