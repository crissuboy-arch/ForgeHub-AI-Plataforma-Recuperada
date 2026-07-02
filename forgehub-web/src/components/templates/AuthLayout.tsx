'use client';
// src/components/templates/AuthLayout.tsx
import React, { useState } from 'react';
import { AuthProvider } from '../../hooks/useAuth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * Layout das páginas de autenticação (login / signup).
 * Provê Auth (Supabase) e React Query.
 */
export const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </AuthProvider>
  );
};
