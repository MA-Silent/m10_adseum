import CmsAddButton from "../CmsAddButton";
import { prisma } from "@/src/lib/prisma";

export default async function CmsPage({ params }: { params: Promise<{ page: string }> }) {
  const slug = (await params).page;
  const page = await prisma.page.findFirst({ where: { slug: slug }, include:{components:true} });

  if(page == null) return <div>Page not Found!</div>

  const components = page.components;

  return (
    <div className="h-full w-full p-6 pb-0">
      <div className="h-full w-full relative p-2 pt-0 shadow-2xl shadow-black">
        {components?.map(async (comp, index)=>{
            const Component = (await import(`@/src/components/${comp.importPath}`)).default;
            return <Component key={index}/>
          })}
        <CmsAddButton pageSlug={slug} />
      </div>
    </div>
  );
}
