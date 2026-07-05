'use client';
// src/components/organisms/Sidebar.tsx
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavItem } from '../molecules/NavItem';
import { Icon } from '../atoms/Icon';
import { Typography } from '../atoms/Typography';
import { useLanguage } from '../../lib/i18n/LanguageProvider';
import { useRole } from '../../hooks/useRole';
import classNames from 'classnames';

/**
 * Barra lateral de navegação (Design System Bible 4.3).
 * Largura 260px, workspace switcher no topo, menu hierárquico e perfil no rodapé.
 * Itens fora do escopo da Sprint 1.5 aparecem como "em breve".
 */
export const Sidebar: React.FC<{ className?: string }> = ({ className }) => {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { isAdmin } = useRole();

  const items = [
    { href: '/dashboard', label: t('nav.dashboard'), iconName: 'home' },
    { href: '/assets', label: t('nav.assets'), iconName: 'asset' },
    // Área administrativa: exclusiva de administradores (itens 5/16 do aditivo)
    ...(isAdmin
      ? [
          { href: '/admin', label: t('nav.adminDash'), iconName: 'chart' },
          { href: '/admin/assets', label: t('nav.studio'), iconName: 'command' },
        ]
      : []),
    { href: '/collections', label: t('nav.collections'), iconName: 'collection', soon: true },
    { href: '/favorites', label: t('nav.favorites'), iconName: 'favorite', soon: true },
    { href: '/recent', label: t('nav.recent'), iconName: 'recent', soon: true },
    { href: '/planos', label: t('nav.plans'), iconName: 'star' },
    { href: '/settings', label: t('nav.settings'), iconName: 'settings' },
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
            {t('sidebar.workspace')}
          </Typography>
          <Typography variant="caption" className="truncate">
            {t('sidebar.plan')}
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
            soonLabel={t('nav.soon')}
            active={pathname === item.href || pathname?.startsWith(item.href + '/')}
          />
        ))}
      </nav>

      {/* Perfil no rodapé */}
      <div className="border-t border-border p-3">
        <Link href="/perfil" className="flex items-center gap-3 rounded-container px-2 py-2 transition-colors hover:bg-surface-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-card text-muted">
            <Icon name="user" size={18} />
          </span>
          <span className="flex-1 overflow-hidden">
            <Typography variant="h6" className="truncate">
              {t('sidebar.you')}
            </Typography>
            <Typography variant="caption" className="truncate">
              {t('topbar.profile')}
            </Typography>
          </span>
        </Link>
      </div>
    </aside>
  );
};
