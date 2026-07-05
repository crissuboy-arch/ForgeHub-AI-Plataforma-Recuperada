'use client';
// src/components/organisms/AdminGate.tsx
// Portão de permissão: só administradores acessam o Asset Studio / área admin.
// Alunos veem uma mensagem de acesso restrito (item 5 do aditivo).
import React from 'react';
import Link from 'next/link';
import { useRole } from '../../hooks/useRole';
import { useLanguage } from '../../lib/i18n/LanguageProvider';
import { Icon } from '../atoms/Icon';
import { Typography } from '../atoms/Typography';
import { Spinner } from '../atoms/Spinner';

export const AdminGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin, loading } = useRole();
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 text-center">
        <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-border bg-card text-muted">
          <Icon name="settings" size={28} />
        </span>
        <Typography variant="h3" className="mb-2">
          {t('gate.title')}
        </Typography>
        <Typography variant="p" className="mb-6 text-muted">
          {t('gate.desc')}
        </Typography>
        <Link
          href="/assets"
          className="rounded-interactive bg-brand-glow px-5 py-2.5 text-sm font-semibold text-white transition-shadow hover:shadow-[var(--shadow-glow-blue)]"
        >
          {t('gate.back')}
        </Link>
      </div>
    );
  }

  return <>{children}</>;
};
