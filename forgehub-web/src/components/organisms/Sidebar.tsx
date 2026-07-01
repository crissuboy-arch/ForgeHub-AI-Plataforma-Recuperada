// src/components/organisms/Sidebar.tsx
import React from 'react';
import { NavItem } from '../../molecules/NavItem';
import classNames from 'classnames';

/**
 * Vertical navigation sidebar used in the main dashboard.
 * It lists primary sections of the platform. For Sprint 1 we keep the list
 * static; future work will make it dynamic based on user permissions.
 */
export const Sidebar: React.FC = () => {
  const items = [
    { href: '/dashboard', label: 'Dashboard', iconName: 'home' },
    { href: '/assets', label: 'Assets', iconName: 'asset' },
    { href: '/collections', label: 'Collections', iconName: 'collection' },
    { href: '/favorites', label: 'Favorites', iconName: 'favorite' },
    { href: '/recent', label: 'Recent', iconName: 'recent' },
    { href: '/settings', label: 'Settings', iconName: 'x' }, // placeholder icon
  ];

  return (
    <aside
      className={classNames(
        'w-64 min-h-screen bg-gray-50 border-r border-gray-200',
        'flex flex-col p-4 space-y-2',
      )}
    >
      {items.map((item) => (
        <NavItem
          key={item.href}
          href={item.href}
          iconName={item.iconName}
          label={item.label}
        />
      ))}
    </aside>
  );
};
