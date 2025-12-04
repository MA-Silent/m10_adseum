import { getTranslations } from "next-intl/server";
import { prisma } from "../lib/prisma";
import Link from "next/link";

export default async function Header() {
  const t = await getTranslations('Header');
  const pages = await prisma.page.findMany();

  return(
    <>
      <header className="w-full text-secondary">
        <div className="bg-black/60 w-full p-4 justify-between flex">
          <h1>{t('title')}</h1>
          <nav className="flex gap-5">
            {pages.map((page)=>{
              return <Link href={`/${page.slug}`} key={page.id}>{page.title}</Link>
            })}
          </nav>
        </div>
      </header>
    </>
  )
}
