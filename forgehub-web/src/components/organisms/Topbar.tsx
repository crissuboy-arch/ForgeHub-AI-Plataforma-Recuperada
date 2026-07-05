'use client';
// src/components/organisms/Topbar.tsx
import React from 'react';
import Link from 'next/link';
import { Icon } from '../atoms/Icon';
import { Logo } from '../atoms/Logo';
import { LanguageSwitcher } from '../atoms/LanguageSwitcher';
import { ThemeSwitcher } from '../molecules/ThemeSwitcher';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../lib/i18n/LanguageProvider';
import { useToast } from '../organisms/Toast';
import { useCommandPalette } from '../organisms/CommandPalette';

/**
 * Barra superior global (glass). Logo à esquerda, Command Palette (⌘K) ao centro,
 * notificações/config/perfil à direita.
 */
export const Topbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const { open } = useCommandPalette();
  const { t } = useLanguage();
  const { toast } = useToast();
  const onSignOut = async () => {
    await signOut();
    toast(t('toast.logoutDone'), 'success');
  };

  return (
    <header className="glass flex h-16 items-center justify-between gap-4 px-4">
      <div className="hidden sm:block">
        <Logo />
      </div>
      <Logo showWord={false} className="sm:hidden" />

      {/* Command Palette */}
      <button
        type="button"
        onClick={open}
        className="flex h-10 w-full max-w-md items-center gap-2 rounded-interactive border border-border bg-surface/60 px-3 text-sm text-muted transition-colors hover:border-primary/50"
      >
        <Icon name="search" size={16} />
        <span className="flex-1 text-left">{t('topbar.search')}</span>
        <kbd className="rounded-md border border-border bg-surface px-1.5 py-0.5 text-xs font-medium text-muted">Ctrl K</kbd>
      </button>

      <div className="flex items-center gap-1">
        <ThemeSwitcher compact className="mr-1 hidden md:inline-flex" />
        <LanguageSwitcher className="mr-1 hidden sm:flex" />
        <button className="flex h-9 w-9 items-center justify-center rounded-interactive text-muted transition-colors hover:bg-surface-2 hover:text-content" aria-label={t('topbar.notifications')}>
          <Icon name="recent" size={18} />
        </button>
        <Link href="/settings" className="flex h-9 w-9 items-center justify-center rounded-interactive text-muted transition-colors hover:bg-surface-2 hover:text-content" aria-label={t('topbar.settings')}>
          <Icon name="settings" size={18} />
        </Link>
        {user && (
          <button
            onClick={onSignOut}
            aria-label={t('topbar.logout')}
            title={`${user.email} — ${t('topbar.logout')}`}
            className="ml-1 flex items-center gap-2 rounded-interactive border border-border py-1 pl-1 pr-2 text-sm text-muted transition-colors hover:border-primary/50 hover:text-content"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-glow text-xs font-bold text-white">
              {user.email?.[0]?.toUpperCase() ?? 'U'}
            </span>
            <Icon name="logout" size={16} />
          </button>
        )}
      </div>
    </header>
  );
};
