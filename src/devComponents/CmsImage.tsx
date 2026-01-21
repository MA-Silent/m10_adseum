import NextImage from "next/image";
import { Button } from "@/components/ui/button";
import { prisma } from "../lib/prisma";
import { getImage, getImages } from "../lib/images";
import { Plus } from "lucide-react";
import PopupButton from "../app/cms/cmsComponents/PopupButton";
import Image from "next/image";
import z from "zod";
import { revalidateTag } from "next/cache";
import { revalidatePath } from "next/cache";

const CmsImage = async ({ componentID, height, width, onCMS }: {componentID: number, height: number, width: number, onCMS: boolean }) => {
  const imageData = await getImage(componentID);
  const allImages = await getImages();

  return imageData.src !== null && imageData.name !== null ? (
    <NextImage className={`w-lg`} loading="lazy" height={height} width={width} src={imageData.src} alt={imageData.name} />
  ) : (
    <div className="flex flex-col items-center">Image not found!
        {onCMS ? <PopupButton callBack={async (_, rawFormData) => {
          'use server'

          const imageSchema = z.object({
              selectedImage: z.string()
          });
          const { success, data } = imageSchema.safeParse(Object.fromEntries(rawFormData));

          if (success) {
            await prisma.component.update({
              where: { id: componentID },
              data: {
                imageSrc: data.selectedImage
              }
            });
            revalidateTag('getImages', 'max');
            revalidateTag(`getImage:${componentID}`, 'max')
            revalidatePath('/');

            return { success: true };
          }

          return { success: false };
        }} toastData={ {title: "An error occured", description: "An error occured while trying to save the image"} } icon={<div className="flex bg-sky-500 size-12 rounded justify-center items-center"> <Plus className="stroke-white size-8" /> </div>}>
          <div className="fixed size-fit top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-foreground">
            <div className="border p-5 h-fit w-[50vw] rounded-2xl bg-accent border-accent-foreground">

              <div className="grid grid-cols-3 gap-4">
                {allImages.map((image, index) =>
                  <label className="relative m-auto cursor-pointer" key={index}>
                    <input type="radio" name="selectedImage" value={ image.src } className="peer sr-only" />
                    <Image className="peer-checked:border-2 peer-checked:border-sky-500 rounded" width={300} height={300} src={image.src} alt={`Not found: ${image.src}`} />
                  </label>
                )}
              </div>

              <div className="flex w-full justify-end">
                <Button className="right-0" type="submit" variant="default">Submit</Button>
              </div>
            </div>
          </div>
        </PopupButton> : null}
    </div>
  )
}

export default CmsImage;
