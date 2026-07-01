// src/components/templates/AuthLayout.tsx
import React from 'react';
import { AuthProvider } from '../../hooks/useAuth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * Layout for authentication pages (login / signup).
 * It sets up Supabase Auth context and React Query client.
 */
export const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = new QueryClient();
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </AuthProvider>
  );
};
