import "dotenv/config";
import { MetadataRoute } from "next";
import { getPages } from "../lib/pages";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const BASE_URL = process.env.BASE_URL?.replaceAll(/\/$/g, '')|| '';
  const pages = await getPages();

  const pagesSitemap: MetadataRoute.Sitemap = pages.map((page) => {
    return {url: `${BASE_URL}/${page.slug}`, lastModified: page.last_updated, priority: 1, changeFrequency: 'monthly'};
  })

  return [
    ...pagesSitemap,
  ]
}
