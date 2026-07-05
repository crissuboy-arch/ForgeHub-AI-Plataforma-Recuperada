// src/app/perfil/layout.tsx
import React from 'react';
import { MainLayout } from '../../components/templates/MainLayout';

export default function PerfilLayout({ children }: { children: React.ReactNode }) {
  return <MainLayout>{children}</MainLayout>;
}
