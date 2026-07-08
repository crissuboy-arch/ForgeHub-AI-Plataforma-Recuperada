'use client';
// src/app/planos/page.tsx — Planos da Biblioteca (Starter / Pro / Premium).
import Link from 'next/link';
import { Typography } from '../../components/atoms/Typography';
import { Icon } from '../../components/atoms/Icon';
import { Badge } from '../../components/atoms/Badge';
import { useLanguage } from '../../lib/i18n/LanguageProvider';

const PLANS = [
  { name: 'Starter', key: 'starter', highlight: false },
  { name: 'Pro', key: 'pro', highlight: true },
  { name: 'Premium', key: 'premium', highlight: false },
] as const;

export default function PlanosPage() {
  const { t } = useLanguage();
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-12 text-center">
        <Badge tone="primary" className="mb-4"><Icon name="sparkles" size={14} /> {t('planos.badge')}</Badge>
        <Typography variant="h1" className="mb-3">{t('planos.title')}</Typography>
        <Typography variant="p" className="mx-auto max-w-xl">
          {t('planos.subtitle')}
        </Typography>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {PLANS.map((p) => (
          <div
            key={p.name}
            className={`card-premium ring-hairline relative flex flex-col rounded-container p-7 ${p.highlight ? 'border-primary/60 shadow-[var(--shadow-glow-blue)]' : ''}`}
          >
            {p.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-glow px-3 py-1 text-xs font-semibold text-white">
                {t('planos.popular')}
              </span>
            )}
            <Typography variant="h4" className="mb-1">{p.name}</Typography>
            <Typography variant="small" className="mb-6">{t(`planos.${p.key}.tagline`)}</Typography>
            <ul className="mb-8 space-y-3">
              {t(`planos.${p.key}.features`).split('|').map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-content">
                  <Icon name="check" size={16} className="mt-0.5 shrink-0 text-success" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className={`mt-auto inline-flex h-12 items-center justify-center rounded-interactive text-sm font-semibold transition-all ${p.highlight ? 'bg-brand-glow text-white hover:shadow-[var(--shadow-glow-blue)]' : 'border border-white/15 text-content hover:border-primary/50 hover:bg-surface-2'}`}
            >
              {t('planos.ctaPrefix')} {p.name}
            </Link>
          </div>
        ))}
      </div>

      <p className="mt-10 text-center text-xs text-dim">{t('planos.footer')}</p>
    </div>
  );
}
