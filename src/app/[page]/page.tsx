import { CmsComponent } from "@/src/components/componentType";
import { prisma } from "@/src/lib/prisma";

export default async function Page({ params }: { params: Promise<{ page: string }> }) {
  const page = await prisma.page.findFirst({
    where: {slug: (await params).page},
    include: {components: true},
  });

  if(page == null) return <div className="flex justify-center items-center h-full">404 Page not Found!</div>

  return (
    <div>
      {page.components?.map(async (comp, index)=>{
        const Component = (await import(`@/src/components/${comp.importPath}`)).default as CmsComponent;
        return <Component style={{order: comp.order}} key={index}><div className="hidden"></div></Component>
      })}
    </div>
  );
}
