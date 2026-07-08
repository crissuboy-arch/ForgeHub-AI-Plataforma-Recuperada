// src/app/oferta/layout.tsx — apenas define o título da página de vendas.
import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Oferta de Lançamento' };

export default function OfertaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
