import { prisma } from "@/src/lib/prisma";
import Link from "next/link";

export default async function CmsLayout({ children }: React.PropsWithChildren) {

  const pages = await prisma.page.findMany();

  return (
    <div className="w-full h-full flex">
      <div className="bg-zinc-700 h-full w-1/12 flex flex-col items-center">
        {pages.map((page) => {
          return <Link href={`/cms/${page.slug}`} className="cursor-pointer w-full p-2 border-b text-white font-semibold" key={page.id}> {page.title} </Link>
        })}
      </div>
      <div className="w-full h-full">
        {children}
      </div>
    </div>
  );
}
