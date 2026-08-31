// src/app/manifest.ts — gerado como /manifest.webmanifest pelo Next.
import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ForgeHub AI',
    short_name: 'ForgeHub AI',
    description:
      'A maior biblioteca de kits de negócios digitais remixáveis: aplicativos, páginas de venda, ebooks, criativos, templates e agentes de IA prontos para personalizar e vender.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0b1e3c',
    theme_color: '#070b14',
    lang: 'pt-BR',
    icons: [
      { src: '/logo-symbol.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/app-icon.png', sizes: '1024x1024', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
