import type { MetadataRoute } from 'next'
import { projects } from '@/data/site'

const SITE = 'https://khushirathore.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    ...projects.map(p => ({
      url: `${SITE}/work/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]
}
