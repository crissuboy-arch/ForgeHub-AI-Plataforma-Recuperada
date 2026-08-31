// src/app/robots.ts — gerado como /robots.txt pelo Next.
import type { MetadataRoute } from 'next';

const SITE_URL = 'https://www.devforgehub.online';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Áreas privadas / de aplicação — sem valor de indexação.
        disallow: ['/dashboard', '/admin', '/settings', '/perfil', '/api/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
