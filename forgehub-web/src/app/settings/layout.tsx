// src/app/settings/layout.tsx
import React from 'react';
import { MainLayout } from '../../components/templates/MainLayout';

export default function SettingsAppLayout({ children }: { children: React.ReactNode }) {
  return <MainLayout>{children}</MainLayout>;
}
