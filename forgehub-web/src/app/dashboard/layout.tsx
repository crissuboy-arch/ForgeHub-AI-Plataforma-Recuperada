// src/app/dashboard/layout.tsx
import React from 'react';
import { MainLayout } from '../../components/templates/MainLayout';

export default function DashboardAppLayout({ children }: { children: React.ReactNode }) {
  return <MainLayout>{children}</MainLayout>;
}
