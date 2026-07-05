'use client';
// src/app/not-found.tsx — página 404 personalizada (item 4).
import Link from 'next/link';
import { Typography } from '../components/atoms/Typography';
import { Icon } from '../components/atoms/Icon';
import { useLanguage } from '../lib/i18n/LanguageProvider';

export default function NotFound() {
  const { t } = useLanguage();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-6 text-center">
      <span className="text-brand-glow text-7xl font-bold tracking-tight">404</span>
      <Typography variant="h3" className="mt-4">{t('nf.title')}</Typography>
      <Typography variant="p" className="mt-2 max-w-md">{t('nf.desc')}</Typography>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="inline-flex h-11 items-center gap-2 rounded-interactive border border-border px-5 text-sm font-semibold text-content transition-colors hover:bg-surface"
        >
          <Icon name="back" size={16} /> {t('nf.back')}
        </button>
        <Link href="/assets" className="inline-flex h-11 items-center gap-2 rounded-interactive border border-border px-5 text-sm font-semibold text-content transition-colors hover:bg-surface">
          <Icon name="asset" size={16} /> {t('nf.library')}
        </Link>
        <Link href="/dashboard" className="inline-flex h-11 items-center gap-2 rounded-interactive bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover">
          <Icon name="home" size={16} /> {t('nf.dashboard')}
        </Link>
      </div>
    </div>
  );
}
