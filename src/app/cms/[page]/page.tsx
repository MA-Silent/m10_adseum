import { prisma } from "@/src/lib/prisma";
import { getAvailableComponents, addComponentToPage } from "@/src/lib/serverFunctions";
import CmsAddButton from "../CmsAddButton";
import { CmsComponent } from "@/src/components/componentType";
import CmsRemoveButton from "../CmsRemoveButton";
import { revalidatePath } from "next/cache";
import { revalidateTag } from "next/cache";

export default async function CmsPage({ params }: { params: Promise<{ page: string }> }) {
  const slug = (await params).page;
  const page = await prisma.page.findFirst({ where: { slug: slug }, include:{components:true} });

  if(page == null) return <div>Page not Found!</div>

  const components = page.components;
  const availableComponents = await getAvailableComponents();

  return (
    <div className="h-full w-full p-6 pb-0">
      <div className="h-full w-full relative pt-0 shadow-[0_0_1rem_1rem_#00000044] rounded">
        {components?.map(async (comp, index)=>{
          const Component = (await import(`@/src/components/${comp.importPath}`)).default as CmsComponent;
          return <Component style={{order: comp.order}} key={index}><CmsRemoveButton component={comp} pageID={page.id} /></Component>
        })}

        <CmsAddButton>
          <ul className="fixed right-0 top-0 p-4 flex flex-col gap-2 max-w-36 bg-yellow-500 z-100">
            {availableComponents.map((component, index) => (
              <li className="block" key={index}>
                <button className="p-1 bg-red-500 cursor-pointer w-full text-left" onClick={async () => {
                  "use server";
                  await addComponentToPage(component, slug);
                  revalidateTag(`page:${page.slug}`, 'max')
                }}>{component}</button>
              </li>
            ))}
          </ul>
        </CmsAddButton>
      </div>
    </div>
  );
}
