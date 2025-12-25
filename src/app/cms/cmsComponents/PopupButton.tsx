'use client'
import { useActionState, useState } from "react"

type userModal = React.PropsWithChildren & {
  icon: React.ReactNode
  callBack?: (_: void | undefined, formData: FormData )=>Promise<void>
}

export default function PopupButton({children, icon, callBack}: userModal) {
  const [open, setOpen] = useState(false);
  const [__, formAction, _] = useActionState(callBack? callBack : ()=>{}, undefined);

  return (
    <>
      <button className="size-fit" onClick={()=>setOpen((prev)=>!prev)}>{icon}</button>
      {open && <div onClick={()=>setOpen(false)} className="fixed top-0 left-0 bottom-0 right-0 bg-background/60" />}
      {open && <form action={formAction} onSubmit={() => { setOpen(false) } }>{children}</form>}
    </>
  )
}
