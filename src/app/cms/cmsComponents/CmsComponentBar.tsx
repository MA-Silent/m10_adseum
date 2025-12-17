"use client"
import { ArrowDown, ArrowUp, Minus } from "lucide-react"
import { type Comp } from "@/src/lib/serverFunctions";
import { useCms } from "./CmsContext";


export default function CmsComponentBar({ component }: {component : Comp}){
  const { addAction } = useCms();

  return(
    <div className="absolute top-0 right-0 z-40">
      <button onClick={() => addAction({ type: "remove", componentID: component.id })} className="size-6 bg-red-500/40 text-white"><Minus className="size-6" /></button>
      <button onClick={() => addAction({ type: "move", componentID: component.id, amount: -2 })} className="size-6 bg-sky-500/40 text-white mx-1"><ArrowUp /></button>
      <button onClick={() => addAction({ type: "move", componentID: component.id, amount: 2 })} className="size-6 bg-sky-500/40 text-white"><ArrowDown /></button>
    </div>
  )
}
