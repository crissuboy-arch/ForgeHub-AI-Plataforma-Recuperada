// src/app/(auth)/layout.tsx
import React from 'react';
import type { Metadata } from 'next';
import { AuthLayout } from '../../components/templates/AuthLayout';

export const metadata: Metadata = { title: 'Entrar' };

export default function AuthAppLayout({ children }: { children: React.ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>;
}
