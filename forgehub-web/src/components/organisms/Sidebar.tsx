'use client';
// src/components/organisms/Sidebar.tsx
import React from 'react';
import { usePathname } from 'next/navigation';
import { NavItem } from '../molecules/NavItem';
import { Icon } from '../atoms/Icon';
import { Typography } from '../atoms/Typography';
import classNames from 'classnames';

/**
 * Barra lateral de navegação (Design System Bible 4.3).
 * Largura 260px, workspace switcher no topo, menu hierárquico e perfil no rodapé.
 * Itens fora do escopo da Sprint 1.5 aparecem como "em breve".
 */
export const Sidebar: React.FC<{ className?: string }> = ({ className }) => {
  const pathname = usePathname();

  const items = [
    { href: '/dashboard', label: 'Dashboard', iconName: 'home' },
    { href: '/assets', label: 'Assets', iconName: 'asset' },
    { href: '/admin/assets', label: 'Asset Studio', iconName: 'command' },
    { href: '/collections', label: 'Coleções', iconName: 'collection', soon: true },
    { href: '/favorites', label: 'Favoritos', iconName: 'favorite', soon: true },
    { href: '/recent', label: 'Recentes', iconName: 'recent', soon: true },
    { href: '/settings', label: 'Configurações', iconName: 'settings' },
  ];

  return (
    <aside
      className={classNames(
        'flex w-[260px] shrink-0 flex-col border-r border-border bg-surface',
        className,
      )}
    >
      {/* Workspace switcher (visual) */}
      <button
        type="button"
        className="m-3 flex items-center gap-3 rounded-container border border-border bg-card px-3 py-2.5 text-left transition-colors hover:border-primary/50"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-interactive bg-brand-glow text-sm font-bold text-white">
          FH
        </span>
        <span className="flex-1 overflow-hidden">
          <Typography variant="h6" className="truncate">
            Meu Workspace
          </Typography>
          <Typography variant="caption" className="truncate">
            Plano Pro
          </Typography>
        </span>
        <Icon name="chevron-updown" size={16} className="text-muted" />
      </button>

      {/* Navegação */}
      <nav className="flex flex-1 flex-col gap-1 px-3 py-2">
        {items.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            iconName={item.iconName}
            label={item.label}
            soon={item.soon}
            active={pathname === item.href || pathname?.startsWith(item.href + '/')}
          />
        ))}
      </nav>

      {/* Perfil no rodapé */}
      <div className="border-t border-border p-3">
        <div className="flex items-center gap-3 rounded-container px-2 py-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-card text-muted">
            <Icon name="user" size={18} />
          </span>
          <span className="flex-1 overflow-hidden">
            <Typography variant="h6" className="truncate">
              Você
            </Typography>
            <Typography variant="caption" className="truncate">
              Ver perfil
            </Typography>
          </span>
        </div>
      </div>
    </aside>
  );
};
