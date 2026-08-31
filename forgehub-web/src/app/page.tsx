// src/app/page.tsx — Server component da home (SEO + JSON-LD).
// O corpo visual (client) vive em ./HomeClient — design/copy/layout intactos.
import type { Metadata } from 'next';
import { HomeClient } from './HomeClient';
import { translate } from '../lib/i18n/dictionary';

const SITE_URL = 'https://www.devforgehub.online';

const TITLE = 'ForgeHub AI — Pare de criar produtos digitais do zero';
// Meta description ~155 caracteres (exibição no Google sem truncar).
const DESCRIPTION =
  'A maior biblioteca da ForgeHub AI com kits de negócios digitais remixáveis: apps, páginas de venda, ebooks, criativos, templates e agentes de IA prontos para vender.';
// Descrição longa (JSON-LD / contexto para IA) — mais detalhada, sem keyword stuffing.
const DESCRIPTION_LONG =
  'ForgeHub AI é uma plataforma e biblioteca de kits de negócios digitais remixáveis: aplicativos, páginas de venda, checkout, ebooks, criativos, vídeos, templates e agentes de IA — prontos para personalizar com a sua marca e vender como seus. Novos kits todos os meses.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: '/' },
  keywords: [
    'ForgeHub AI',
    'plataforma de inteligência artificial',
    'produtos digitais',
    'ferramentas de IA',
    'biblioteca de produtos digitais',
    'aplicativos de IA',
    'templates',
    'agentes de IA',
    'ferramentas para criadores',
    'ferramentas para empreendedores digitais',
    'kits remixáveis',
    'infoprodutos',
  ],
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'ForgeHub AI',
    locale: 'pt_BR',
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
};

// FAQ real da página (dicionário pt-BR) → FAQPage JSON-LD (sem inventar nada).
function faqEntities() {
  return translate('pt-BR', 'lp.faq')
    .split('|')
    .map((pair) => {
      const [q, a] = pair.split('::');
      return { q: q?.trim(), a: a?.trim() };
    })
    .filter((x) => x.q && x.a)
    .map((x) => ({
      '@type': 'Question',
      name: x.q,
      acceptedAnswer: { '@type': 'Answer', text: x.a },
    }));
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'ForgeHub AI',
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
      description:
        'Plataforma e biblioteca de kits de negócios digitais remixáveis com aplicativos, páginas de venda, ebooks, criativos, templates e agentes de IA.',
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'ForgeHub AI',
      inLanguage: 'pt-BR',
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
    {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/#webpage`,
      url: `${SITE_URL}/`,
      name: TITLE,
      description: DESCRIPTION_LONG,
      isPartOf: { '@id': `${SITE_URL}/#website` },
      inLanguage: 'pt-BR',
      about: { '@id': `${SITE_URL}/#software` },
    },
    {
      '@type': 'SoftwareApplication',
      '@id': `${SITE_URL}/#software`,
      name: 'ForgeHub AI',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      url: SITE_URL,
      inLanguage: 'pt-BR',
      publisher: { '@id': `${SITE_URL}/#organization` },
      description: DESCRIPTION_LONG,
      offers: {
        '@type': 'Offer',
        price: '47.90',
        priceCurrency: 'BRL',
        url: `${SITE_URL}/oferta`,
        availability: 'https://schema.org/InStock',
      },
    },
    {
      '@type': 'FAQPage',
      '@id': `${SITE_URL}/#faq`,
      mainEntity: faqEntities(),
    },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient />
    </>
  );
}
