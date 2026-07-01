// src/components/templates/MainLayout.tsx
import React from 'react';
import { DashboardLayout } from '../../organisms/DashboardLayout';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../../hooks/useAuth';

/**
 * Layout for all authenticated pages.
 * Provides Supabase Auth context, React Query client, and wraps content with
 * DashboardLayout (topbar + sidebar).
 */
export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = new QueryClient();
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <DashboardLayout>{children}</DashboardLayout>
      </QueryClientProvider>
    </AuthProvider>
  );
};
