import { CmsComponent } from "@/src/components/componentType";
import { getPage } from "@/src/lib/pages";

export default async function Page({ params }: { params: Promise<{ page: string }> }) {
  const page = await getPage(`${(await params).page}`)
  if(page == null) return <div className="flex justify-center items-center h-full">404 Page not Found!</div>

  return (
    <div className="flex flex-col">
      {page.components?.map(async (comp, index)=>{
        const Component = (await import(`@/src/components/${comp.importPath}`)).default as CmsComponent;
        return <Component style={{order: comp.order}} key={index}><div className="hidden"></div></Component>
      })}
    </div>
  );
}
