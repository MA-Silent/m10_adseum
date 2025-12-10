import { getTranslations } from "next-intl/server";
import { prisma } from "../lib/prisma";
import Link from "next/link";
import { CmsComponent } from "./componentType";

const Header: CmsComponent = async function ({ children }) {
  const t = await getTranslations('Header');
   const pages = await prisma.page.findMany();

   return(
     <>
       <header className="relative w-full text-secondary">
         <div className="bg-sidebar-accent text-sidebar-accent-foreground w-full p-4 justify-between flex">
           <h1>{t('title')}</h1>
           <nav className="flex gap-5">
             {pages.map((page)=>{
               return <Link href={`/${page.slug}`} key={page.id}>{page.title}</Link>
             })}
           </nav>
         </div>
         {children}
       </header>
     </>
   )
}

export default Header;
