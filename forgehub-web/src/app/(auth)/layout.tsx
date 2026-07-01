// src/app/(auth)/layout.tsx
import React from 'react';
import { AuthLayout } from '../../components/templates/AuthLayout';

export default function AuthAppLayout({ children }: { children: React.ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>;
}
