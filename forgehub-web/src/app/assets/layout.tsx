// src/app/assets/layout.tsx
import React from 'react';
import type { Metadata } from 'next';
import { MainLayout } from '../../components/templates/MainLayout';

export const metadata: Metadata = { title: 'Biblioteca' };

export default function AssetsAppLayout({ children }: { children: React.ReactNode }) {
  return <MainLayout>{children}</MainLayout>;
}
