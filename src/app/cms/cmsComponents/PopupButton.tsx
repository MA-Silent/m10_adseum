'use client'
import { useActionState, useEffect, useState } from "react"
import { toast } from "sonner"

type userModal = React.PropsWithChildren & {
  icon: React.ReactNode
  callBack?: (_: { success: boolean } | undefined, formData: FormData) => Promise<{ success: boolean }>
  toastData?: { title: string, description: string}
}

export default function PopupButton({children, icon, callBack, toastData}: userModal) {
  const [open, setOpen] = useState(false);
  const [state, formAction, _] = useActionState(callBack ? callBack : ()=>undefined, undefined);

  useEffect(()=>{
    if (state?.success == true) { setOpen(false) }
    if (state?.success === false && toastData) {
      toast(toastData.title, { description: toastData.description });
    }
  }, [state, toastData])

  return (
    <>
      <button className="size-fit" onClick={()=>setOpen((prev)=>!prev)}>{icon}</button>
      {open && <div onClick={()=>setOpen(false)} className="fixed top-0 left-0 bottom-0 right-0 bg-background/60" />}
      {open && <form action={formAction}> {children} </form>}
    </>
  )
}
