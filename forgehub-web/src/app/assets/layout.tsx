// src/app/assets/layout.tsx
import React from 'react';
import { MainLayout } from '../../components/templates/MainLayout';

export default function AssetsAppLayout({ children }: { children: React.ReactNode }) {
  return <MainLayout>{children}</MainLayout>;
}
