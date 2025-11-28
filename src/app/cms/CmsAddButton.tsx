"use client"

import { JSX, useState } from "react";
import { getAvailableComponents, addComponentToPage } from "@/src/lib/serverFunctions";

export default function CmsAddButton({ pageSlug }: {pageSlug : string}) {
  const [components, setComponents] = useState <JSX.Element[]>([])

  async function handleClick(){

    if(components[0] != undefined) {
      setComponents([]);
      return;
    }

    const availableComponents = await getAvailableComponents();

    const newComps: JSX.Element[] = [];

    availableComponents.map((component, index)=>{
      const a = (<button className="bg-blue-800 w-full border-b text-white hover:bg-white hover:text-black" onClick={()=>handleAdd(component)} key={index}>{component}</button>)

      newComps.push(a);
    })

    setComponents(() => [...newComps]);
  }

  async function handleAdd(component: string): Promise<undefined>{
    await addComponentToPage(component, pageSlug);
    location.reload();
    setComponents([]);
  }

  return (
    <>
      <div className="w-full justify-center flex">
        <button className="bg-zinc-600 text-white rounded px-2 w-1/4" onClick={handleClick}>+</button>
      </div>
      <div className="fixed top-0 right-0 bottom-0 w-1/12 overflow-auto">
        {components}
      </div>
    </>
  );
}
