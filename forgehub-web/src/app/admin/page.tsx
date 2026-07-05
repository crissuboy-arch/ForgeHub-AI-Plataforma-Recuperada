'use client';
// src/app/admin/page.tsx — Painel Administrativo (item 16). Gated pelo AdminGate (admin/layout).
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '../../components/molecules/PageHeader';
import { Icon } from '../../components/atoms/Icon';
import { Skeleton } from '../../components/atoms/Skeleton';
import { Typography } from '../../components/atoms/Typography';
import { getAdminMetrics } from '../../data/adminMetrics';
import { useLanguage } from '../../lib/i18n/LanguageProvider';

function Metric({ icon, label, value }: { icon: string; label: string; value: React.ReactNode }) {
  return (
    <div className="lift card-premium ring-hairline rounded-container p-5">
      <Icon name={icon} size={18} className="mb-2 text-primary-hover" />
      <div className="text-2xl font-bold text-content">{value}</div>
      <div className="text-xs text-muted">{label}</div>
    </div>
  );
}

function Distribution({ title, data }: { title: string; data: { key: string; value: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <section className="rounded-container border border-border bg-card p-6 ring-hairline">
      <Typography variant="h5" className="mb-4">{title}</Typography>
      {data.length === 0 ? (
        <Typography variant="small">—</Typography>
      ) : (
        <div className="space-y-3">
          {data.map((d) => (
            <div key={d.key} className="flex items-center gap-3">
              <span className="w-28 shrink-0 truncate text-sm text-content" title={d.key}>{d.key}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-border">
                <div className="h-full rounded-full bg-brand-glow" style={{ width: `${(d.value / max) * 100}%` }} />
              </div>
              <span className="w-8 shrink-0 text-right text-sm font-semibold text-muted">{d.value}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default function AdminDashboardPage() {
  const { t } = useLanguage();
  const { data, isLoading, isError } = useQuery({ queryKey: ['admin-metrics'], queryFn: getAdminMetrics });
  const n = (v: number) => v.toLocaleString('pt-BR');

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <PageHeader title={t('admin.title')} subtitle={t('admin.subtitle')} />

      {isLoading && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-container" />)}
        </div>
      )}
      {isError && <Typography variant="small" className="text-danger">{t('admin.loadError')}</Typography>}

      {data && (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            <Metric icon="asset" label={t('admin.kits')} value={n(data.kits)} />
            <Metric icon="download" label={t('admin.downloads')} value={n(data.downloads)} />
            <Metric icon="favorite" label={t('admin.favorites')} value={n(data.favorites)} />
            <Metric icon="remix" label={t('admin.remixes')} value={n(data.remixes)} />
            <Metric icon="user" label={t('admin.users')} value={n(data.users)} />
            <Metric icon="money" label={t('admin.revenue')} value={`R$ ${n(data.revenuePotential)}`} />
            <Metric icon="globe" label={t('admin.countries')} value={n(data.countries)} />
            <Metric icon="stack" label={t('admin.niches')} value={n(data.niches)} />
            <Metric icon="language" label={t('admin.languages')} value={n(data.languages)} />
            <Metric icon="chart" label={t('admin.conversion')} value={`${data.conversion}%`} />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Distribution title={t('admin.byNiche')} data={data.byNiche} />
            <Distribution title={t('admin.byLanguage')} data={data.byLanguage} />
          </div>
        </>
      )}
    </div>
  );
}
