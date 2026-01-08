import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const BASE_URL = process.env.BASE_URL?.replaceAll(/\/$/g, '') || '';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/cms/',
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
