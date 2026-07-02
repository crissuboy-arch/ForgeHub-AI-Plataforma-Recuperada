// src/components/organisms/DashboardLayout.tsx
import React from 'react';
import { Topbar } from './Topbar';
import { Sidebar } from './Sidebar';

/**
 * Layout das seções autenticadas: Topbar no topo, Sidebar à esquerda e
 * conteúdo rolável à direita. A sidebar fica oculta abaixo de `md`.
 */
export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen flex-col bg-canvas">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar className="hidden md:flex" />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};
