'use client';
// src/components/templates/MainLayout.tsx
import React, { useState } from 'react';
import { DashboardLayout } from '../organisms/DashboardLayout';
import { CommandPaletteProvider } from '../organisms/CommandPalette';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../../hooks/useAuth';

/**
 * Layout de todas as páginas autenticadas.
 * Provê Auth (Supabase), React Query, Command Palette (⌘K) e o DashboardLayout.
 */
export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <CommandPaletteProvider>
          <DashboardLayout>{children}</DashboardLayout>
        </CommandPaletteProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
};
