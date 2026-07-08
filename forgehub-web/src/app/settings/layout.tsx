// src/app/settings/layout.tsx
import React from 'react';
import type { Metadata } from 'next';
import { MainLayout } from '../../components/templates/MainLayout';
import { AuthGate } from '../../components/organisms/AuthGate';

export const metadata: Metadata = { title: 'Configurações' };

export default function SettingsAppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate>
      <MainLayout>{children}</MainLayout>
    </AuthGate>
  );
}
