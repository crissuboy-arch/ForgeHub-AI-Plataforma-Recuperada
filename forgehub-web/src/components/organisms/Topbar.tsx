'use client';
// src/components/organisms/Topbar.tsx
import React from 'react';
import { Icon } from '../atoms/Icon';
import { Typography } from '../atoms/Typography';
import { useAuth } from '../../hooks/useAuth';
import { useCommandPalette } from '../organisms/CommandPalette';
import classNames from 'classnames';

/**
 * Barra superior global. Logo ForgeHub à esquerda, gatilho da Command Palette
 * (⌘K) ao centro/direita e menu do usuário à direita.
 */
export const Topbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const { open } = useCommandPalette();

  return (
    <header
      className={classNames(
        'flex h-16 items-center justify-between gap-4 border-b border-border bg-surface px-4',
      )}
    >
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-interactive bg-brand-glow text-sm font-bold text-white">
          F
        </span>
        <Typography variant="h5" className="hidden sm:block">
          ForgeHub AI
        </Typography>
      </div>

      {/* Gatilho da Command Palette */}
      <button
        type="button"
        onClick={open}
        className="flex h-10 w-full max-w-md items-center gap-2 rounded-interactive border border-border bg-card px-3 text-sm text-muted transition-colors hover:border-primary/50"
      >
        <Icon name="search" size={16} />
        <span className="flex-1 text-left">Buscar assets, ações…</span>
        <kbd className="rounded-md border border-border bg-surface px-1.5 py-0.5 text-xs font-medium text-muted">
          Ctrl K
        </kbd>
      </button>

      <div className="flex items-center gap-2">
        {user && (
          <button
            onClick={signOut}
            className="flex items-center gap-2 rounded-interactive px-2 py-1.5 text-sm text-muted transition-colors hover:bg-card hover:text-content"
          >
            <Icon name="user" size={18} />
            <span className="hidden max-w-[160px] truncate md:block">{user.email}</span>
            <Icon name="logout" size={18} />
          </button>
        )}
      </div>
    </header>
  );
};
