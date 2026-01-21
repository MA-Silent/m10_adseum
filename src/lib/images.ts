import { unstable_cache } from "next/cache";
import { prisma } from "./prisma";
import type { ImageModel } from "../generated/models";

export type Image = {
  src: string| null,
  name: string | null
}

export const getImage = (componentID: number): Promise<Image> => unstable_cache(
  async () => {
    const componentData = await prisma.component.findUnique({
      where: { id: componentID },
    });

    const result: Image = { src: componentData?.imageSrc || null, name: componentData?.imageSrc || null };
    return result;
  },
  [`getImage:${componentID}`],
  {
    tags: [`getImage:${componentID}`]
  }
)()


export const getImages = (): Promise<ImageModel[]> => unstable_cache(
  async () => {
    return ( await prisma.image.findMany() );
  },
  [`getImages`],
  {
    tags: [`getImages`]
  }
)()
