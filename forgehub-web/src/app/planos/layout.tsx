// src/app/planos/layout.tsx
import React from 'react';
import type { Metadata } from 'next';
import { MainLayout } from '../../components/templates/MainLayout';

export const metadata: Metadata = { title: 'Planos' };

export default function PlanosLayout({ children }: { children: React.ReactNode }) {
  return <MainLayout>{children}</MainLayout>;
}
