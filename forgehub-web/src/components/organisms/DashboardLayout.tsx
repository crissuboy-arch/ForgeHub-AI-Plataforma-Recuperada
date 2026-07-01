// src/components/organisms/DashboardLayout.tsx
import React from 'react';
import { Topbar } from './Topbar';
import { Sidebar } from './Sidebar';
import classNames from 'classnames';

/**
 * Layout used for the main authenticated sections of the app.
 * It composes the Topbar at the top, a vertical Sidebar on the left,
 * and renders `children` as the page content.
 *
 * The layout is responsive: on screens smaller than `md` the sidebar is hidden
 * and can be toggled later (future work). For Sprint 1 we keep it simple.
 */
export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className={classNames('flex flex-col h-screen')}> 
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar className="hidden md:block" />
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};
