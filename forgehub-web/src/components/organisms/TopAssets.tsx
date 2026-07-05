'use client';
// src/components/organisms/TopAssets.tsx — Top 5 assets com métrica selecionável (dados reais).
import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Typography } from '../atoms/Typography';
import { Skeleton } from '../atoms/Skeleton';
import { CategoryBadge } from '../atoms/CategoryBadge';
import { healthColor } from '../molecules/AssetCard';
import { getTopAssets, type TopMetric } from '../../data/dashboard';
import { useLanguage } from '../../lib/i18n/LanguageProvider';

const METRICS: { key: TopMetric; labelKey: string }[] = [
  { key: 'views', labelKey: 'stat.views' },
  { key: 'downloads', labelKey: 'stat.downloads' },
  { key: 'remixes', labelKey: 'stat.remixes' },
  { key: 'health', labelKey: 'top.health' },
];

export const TopAssets: React.FC = () => {
  const { t } = useLanguage();
  const [metric, setMetric] = useState<TopMetric>('views');
  const { data, isLoading } = useQuery({ queryKey: ['top-assets'], queryFn: getTopAssets });

  const top = (data ?? [])
    .slice()
    .sort((a, b) => (metric === 'health' ? b.health - a.health : (b[metric] as number) - (a[metric] as number)))
    .slice(0, 5);

  const val = (a: (typeof top)[number]) =>
    metric === 'health' ? `${a.health}%` : (a[metric] as number).toLocaleString('pt-BR');

  return (
    <div className="card-premium ring-hairline rounded-container p-5">
      <div className="mb-4 flex items-center justify-between">
        <Typography variant="h5">{t('top.title')}</Typography>
        <div className="flex gap-1 rounded-interactive border border-border bg-surface/60 p-0.5">
          {METRICS.map((m) => (
            <button
              key={m.key}
              onClick={() => setMetric(m.key)}
              className={`rounded-md px-2 py-1 text-[11px] font-medium transition-colors ${metric === m.key ? 'bg-primary/20 text-primary-hover' : 'text-muted hover:text-content'}`}
            >
              {t(m.labelKey)}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
      ) : (
        <ul className="space-y-1">
          {top.map((a, i) => (
            <li key={a.slug}>
              <Link href={`/assets/${a.slug}`} className="lift flex items-center gap-3 rounded-interactive px-2 py-2 transition-colors hover:bg-surface-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/15 font-display text-xs font-bold text-primary-hover">{i + 1}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-content">{a.name}</span>
                  <CategoryBadge category={a.category} />
                </span>
                <span className={`shrink-0 font-display text-sm font-bold ${metric === 'health' ? healthColor(a.health) : 'text-content'}`}>{val(a)}</span>
              </Link>
            </li>
          ))}
          {top.length === 0 && <li className="py-6 text-center text-sm text-muted">{t('top.empty')}</li>}
        </ul>
      )}
    </div>
  );
};
