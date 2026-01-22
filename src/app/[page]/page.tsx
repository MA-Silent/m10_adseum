'use server'
import { CmsComponent } from "@/src/components/componentType";
import { getPage } from "@/src/lib/pages";

export default async function Page({ params }: { params: Promise<{ page: string }> }) {
	const page = await getPage((await params).page)
	if(page == null) return <div className="flex justify-center items-center h-full">404 Page not Found!</div>

	let components = null;

	try{
		components = await Promise.all(page.components?.map(async (comp)=>(await import(`@/src/components/${comp.importPath}`) ).default as CmsComponent ));
	} catch {
		return <div className="flex justify-center items-center h-full">404 Page not Found!</div>
	}

	return (
		<main className="flex flex-col">
			{components.map(async (Component, index)=>{
        return <Component onCMS={false} id={`${page.slug}:${page.components[index].id}`} style={{order: page.components[index].order}} key={index}><></></Component>
			}) }
		</main>
	)
}
