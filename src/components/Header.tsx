import { getTranslations } from "next-intl/server";
import { prisma } from "../lib/prisma";
import Link from "next/link";

export default async function Header() {
  const t = await getTranslations('Header');
  const pages = await prisma.page.findMany();

  return(
    <>
      <div className="absolute top-0 right-2 left-2 text-secondary">
        <div className="bg-black/60 w-full p-4 justify-between flex rounded">
          <div>{t('title')}</div>
          <div className="flex gap-5">
            {pages.map((page)=>{
              return <Link href={`/${page.slug}`} key={page.id}>{page.title}</Link>
            })}
          </div>
        </div>
      </div>
      <div className="w-full h-16"></div>
    </>
  )
}
