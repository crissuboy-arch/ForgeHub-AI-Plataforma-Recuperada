// src/app/planos/layout.tsx
import React from 'react';
import { MainLayout } from '../../components/templates/MainLayout';

export default function PlanosLayout({ children }: { children: React.ReactNode }) {
  return <MainLayout>{children}</MainLayout>;
}
