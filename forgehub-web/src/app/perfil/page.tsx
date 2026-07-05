'use client';
// src/app/perfil/page.tsx — Perfil do usuário (item 10): dados + assinatura + atividade.
import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '../../components/molecules/PageHeader';
import { Badge } from '../../components/atoms/Badge';
import { Icon } from '../../components/atoms/Icon';
import { Typography } from '../../components/atoms/Typography';
import { Skeleton } from '../../components/atoms/Skeleton';
import { AssetCard } from '../../components/molecules/AssetCard';
import { getSettings, getProfileStats, listRecents } from '../../data/userData';
import { useLanguage } from '../../lib/i18n/LanguageProvider';
import { useTranslatedSummaries } from '../../hooks/useTranslatedSummaries';

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5">
      <span className="text-sm text-muted">{label}</span>
      <span className="text-right text-sm font-medium text-content">{value}</span>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: string; label: string; value: number }) {
  return (
    <div className="lift card-premium ring-hairline rounded-container p-5 text-center">
      <Icon name={icon} size={20} className="mx-auto mb-2 text-primary-hover" />
      <div className="text-2xl font-bold text-content">{value}</div>
      <div className="text-xs text-muted">{label}</div>
    </div>
  );
}

const langLabelKey = (l?: string) => (l?.startsWith('es') ? 'settings.langES' : l?.startsWith('en') ? 'settings.langEN' : 'settings.langPT');

export default function PerfilPage() {
  const { t, lang } = useLanguage();
  const settings = useQuery({ queryKey: ['profile-settings'], queryFn: getSettings });
  const stats = useQuery({ queryKey: ['profile-stats'], queryFn: getProfileStats });
  const recents = useQuery({ queryKey: ['profile-recents'], queryFn: () => listRecents(6) });
  const recentsTr = useTranslatedSummaries(recents.data);

  const s = settings.data;
  const st = stats.data;
  const loading = settings.isLoading || stats.isLoading;
  const fmtDate = (iso?: string | null) => (iso ? new Date(iso).toLocaleDateString(lang) : '—');
  const initial = (s?.fullName || st?.email || 'U').charAt(0).toUpperCase();

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <PageHeader
        title={t('profile.title')}
        subtitle={t('profile.subtitle')}
        action={
          <Link href="/settings" className="inline-flex h-10 items-center gap-2 rounded-interactive border border-border px-4 text-sm font-semibold text-content transition-colors hover:bg-surface">
            <Icon name="settings" size={15} /> {t('profile.edit')}
          </Link>
        }
      />

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-28 w-full rounded-container" />
          <Skeleton className="h-64 w-full rounded-container" />
        </div>
      ) : (
        <>
          {/* Cabeçalho do perfil */}
          <div className="card-premium ring-hairline mb-6 flex flex-wrap items-center gap-4 rounded-container p-6">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-glow text-2xl font-bold text-white">
              {s?.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={s.avatarUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                initial
              )}
            </span>
            <div className="min-w-0 flex-1">
              <Typography variant="h4" className="truncate">{s?.fullName || st?.email || '—'}</Typography>
              <Typography variant="small" className="truncate">{st?.email}</Typography>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge tone={s?.role === 'admin' ? 'primary' : 'default'}>
                {t(s?.role === 'admin' ? 'role.admin' : 'role.student')}
              </Badge>
              <Badge tone="default"><Icon name="star" size={12} /> {(s?.plan ?? 'starter').toUpperCase()}</Badge>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <Stat icon="remix" label={t('profile.remixed')} value={st?.remixed ?? 0} />
            <Stat icon="favorite" label={t('profile.favorites')} value={st?.favorites ?? 0} />
            <Stat icon="recent" label={t('profile.history')} value={recents.data?.length ?? 0} />
          </div>

          {/* Dados da conta */}
          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-container border border-border bg-card p-6 ring-hairline">
              <Typography variant="h5" className="mb-2">{t('profile.title')}</Typography>
              <div className="divide-y divide-border">
                <Row label={t('profile.name')} value={s?.fullName || '—'} />
                <Row label={t('profile.email')} value={st?.email || '—'} />
                <Row label={t('profile.language')} value={t(langLabelKey(s?.language))} />
                <Row label={t('profile.country')} value={s?.country || '—'} />
                <Row label={t('profile.memberSince')} value={fmtDate(st?.memberSince)} />
              </div>
            </section>
            <section className="rounded-container border border-border bg-card p-6 ring-hairline">
              <Typography variant="h5" className="mb-2">{t('profile.subscription')}</Typography>
              <div className="divide-y divide-border">
                <Row label={t('profile.plan')} value={<Badge tone="primary">{(s?.plan ?? 'starter').toUpperCase()}</Badge>} />
                <Row label={t('profile.subscription')} value={<span className="text-success">{t('profile.active')}</span>} />
                <Row label={t('profile.expiration')} value={t('profile.none')} />
              </div>
            </section>
          </div>

          {/* Histórico */}
          <section className="mt-6">
            <Typography variant="h5" className="mb-4">{t('profile.history')}</Typography>
            {recentsTr.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {recentsTr.map((a) => <AssetCard key={a.id} asset={a} />)}
              </div>
            ) : (
              <Typography variant="small">{t('profile.noHistory')}</Typography>
            )}
          </section>
        </>
      )}
    </div>
  );
}
