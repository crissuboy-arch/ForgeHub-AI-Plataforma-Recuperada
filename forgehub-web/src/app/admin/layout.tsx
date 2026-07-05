// src/app/admin/layout.tsx
import React from 'react';
import { MainLayout } from '../../components/templates/MainLayout';
import { AdminGate } from '../../components/organisms/AdminGate';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <MainLayout>
      <AdminGate>{children}</AdminGate>
    </MainLayout>
  );
}
