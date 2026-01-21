import { Button } from "@/components/ui/button"
import { prisma } from "@/src/lib/prisma";
import { revalidateTag } from "next/cache"
import { redirect } from "next/navigation";

export default async function ImageManagementPage() {
  return (
    <Button onClick={async () => {
      'use server'

      revalidateTag('getImages', 'max');

      const components = await prisma.component.findMany({ where: { imageSrc: { not: null } } });

      components.map((comp) => {
        revalidateTag(`getImage:${comp.id}`, 'max');
      })

      redirect('/cms/');
    }}>Update image cache</Button>
  )
}
