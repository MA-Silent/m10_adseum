'use client'
import { useState } from "react"

type userModal = React.PropsWithChildren & {
  icon: React.ReactNode
}

export default function PopupButton({children, icon}: userModal) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="size-fit" onClick={()=>setOpen((prev)=>!prev)}>{icon}</button>
      {open && <div onClick={()=>setOpen(false)} className="fixed top-0 left-0 bottom-0 right-0 bg-background/60" />}
      {open && <form onSubmit={(e) => { e.preventDefault(); setOpen(false) } }>{children}</form>}
    </>
  )
}
