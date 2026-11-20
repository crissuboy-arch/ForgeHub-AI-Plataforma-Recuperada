// src/app/oferta/layout.tsx — metadata + JSON-LD da página oficial de vendas.
import React from 'react';
import type { Metadata } from 'next';
import { getPricing, schemaPrice, BLACK_FRIDAY, type Pricing } from '../../config/pricing';
import { PricingProvider } from '../../lib/pricing/PricingProvider';

// ISR: regenera a cada 5 min para o preço da Semana Black entrar/sair sozinho.
export const revalidate = 300;

const SITE_URL = 'https://www.devforgehub.online';
const TITLE = 'ForgeHub AI — Oferta de Lançamento';
const DESCRIPTION =
  'Acesso à ForgeHub AI: biblioteca de kits de negócios digitais remixáveis (apps, páginas de venda, ebooks, criativos, templates e agentes de IA). Pagamento único no lançamento, garantia de 7 dias.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: '/oferta' },
  openGraph: {
    type: 'website',
    url: '/oferta',
    siteName: 'ForgeHub AI',
    locale: 'pt_BR',
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
};

// Montado a cada renderização (build/ISR) — não no carregamento do módulo —
// para o preço do Offer acompanhar a Semana Black.
function buildJsonLd(p: Pricing) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'ForgeHub AI', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Oferta de Lançamento', item: `${SITE_URL}/oferta` },
        ],
      },
      {
        '@type': 'SoftwareApplication',
        name: 'ForgeHub AI',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        url: SITE_URL,
        inLanguage: 'pt-BR',
        description: DESCRIPTION,
        offers: {
          '@type': 'Offer',
          price: schemaPrice(p.current),
          priceCurrency: 'BRL',
          ...(p.promo ? { priceValidUntil: BLACK_FRIDAY.endsAt.slice(0, 10) } : {}),
          url: `${SITE_URL}/oferta`,
          availability: 'https://schema.org/InStock',
          category: 'Pagamento único',
        },
      },
    ],
  };
}

export default function OfertaLayout({ children }: { children: React.ReactNode }) {
  const pricing = getPricing();
  const jsonLd = buildJsonLd(pricing);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PricingProvider promo={pricing.promo}>{children}</PricingProvider>
    </>
  );
}
