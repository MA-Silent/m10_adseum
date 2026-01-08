"use client"

import { Loader, PlusIcon } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { useActionState, useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export type ActionReturn = string | undefined;

type AddPageFormProps = {
  action: (_: ActionReturn, formData: FormData) => Promise<ActionReturn>;
}

function formatSlug(name: string){
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-zA-Z- ]/gi, '')
    .replace(/\s+/gi, '-')
    .replace(/-+/g, '-')
}

export { formatSlug };

export default function AddPageButton({ action }: AddPageFormProps) {
  const [name, setName] = useState("New Page");
  const [error, formAction, isPending] = useActionState(action, undefined);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(()=>{
    if(!isPending && !error){
      setOpen(false);
    }
  }, [isPending, error])

  return (
    <>
      <Dialog open={open}>
        <div>
          <DialogTrigger asChild>
            <Button variant="default" className="bg-sky-400 size-8" onClick={()=>setOpen(true)}><PlusIcon /></Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-106.25">

            <form action={formAction}>
              <DialogHeader>
                <DialogTitle>Add Page</DialogTitle>
                <DialogDescription>
                  Create a new page here. <br />Press save when you&apos;re done!
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="name-1">Name</Label>
                  <Input id="name-1" name="name" value={name} onChange={(e)=>setName(e.currentTarget.value)} />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="slug-1">Slug</Label>
                  <Input id="slug-1" name="slug" readOnly value={formatSlug(name)} />
                </div>
                {error && <div className="text-red-500">
                  error: {error}
                </div>}
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isPending}>{isPending ? <Loader /> : "Create"}</Button>
              </DialogFooter>
            </form>

          </DialogContent>
        </div>
      </Dialog>
    </>
  )
}
