// src/app/sitemap.ts — gerado como /sitemap.xml pelo Next.
import type { MetadataRoute } from 'next';

const SITE_URL = 'https://www.devforgehub.online';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/oferta`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/planos`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
  ];
}
