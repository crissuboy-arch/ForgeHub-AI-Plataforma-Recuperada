'use client';
// src/app/dashboard/page.tsx — Dashboard Premium (Sprint 5.5)
import dynamic from 'next/dynamic';
import { useQuery } from '@tanstack/react-query';
import { AssetGrid } from '../../components/organisms/AssetGrid';
import { AssetCard } from '../../components/molecules/AssetCard';
import { StatCard } from '../../components/molecules/StatCard';
import { TopAssets } from '../../components/organisms/TopAssets';
import { ActivityTimeline } from '../../components/organisms/ActivityTimeline';
import { HeroBannerCarousel } from '../../components/organisms/HeroBannerCarousel';
import { ComingSoonCarousel } from '../../components/organisms/ComingSoonCarousel';
import { BonusCard } from '../../components/molecules/BonusCard';
import { Typography } from '../../components/atoms/Typography';
import { Icon } from '../../components/atoms/Icon';
import { Skeleton } from '../../components/atoms/Skeleton';
import { listRecents } from '../../data/userData';
import { getDashboardStats } from '../../data/assets';
import { getActivitySeries } from '../../data/dashboard';
import { useLanguage } from '../../lib/i18n/LanguageProvider';
import { useTranslatedSummaries } from '../../hooks/useTranslatedSummaries';

// Recharts sob demanda (mantém o bundle inicial leve)
const ActivityChart = dynamic(() => import('../../components/organisms/ActivityChart'), {
  ssr: false,
  loading: () => <Skeleton className="h-60 w-full rounded-interactive" />,
});

export default function DashboardPage() {
  const { t } = useLanguage();
  const recents = useQuery({ queryKey: ['recents'], queryFn: () => listRecents(4) });
  const stats = useQuery({ queryKey: ['dashboard-stats'], queryFn: getDashboardStats });
  const series = useQuery({ queryKey: ['activity-series'], queryFn: () => getActivitySeries(30) });
  const recentsTr = useTranslatedSummaries(recents.data);
  const s = stats.data;

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* HERO BANNER premium orientado a dados (config/niches.ts) */}
      <HeroBannerCarousel />

      {/* EM BREVE — vitrine de próximos nichos/recursos */}
      <ComingSoonCarousel />

      {/* INDICADORES RÁPIDOS */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {[
          { icon: 'stack', label: t('dash.available'), value: s?.totalAssets ?? 0 },
          { icon: 'download', label: t('stat.downloads'), value: s?.downloads ?? 0 },
          { icon: 'remix', label: t('stat.remixes'), value: s?.remixes ?? 0 },
          { icon: 'favorite', label: t('stat.favorites'), value: s?.favorites ?? 0 },
          { icon: 'sparkles', label: t('dash.updates'), value: s?.updates ?? 0 },
          { icon: 'recent', label: t('dash.lastAccess'), value: recents.data?.length ?? 0 },
        ].map((it) => (
          <div key={it.label} className="ring-hairline flex items-center gap-2.5 rounded-container border border-border bg-card px-3 py-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-interactive bg-primary/12 text-primary-hover"><Icon name={it.icon} size={15} /></span>
            <span className="min-w-0">
              <span className="block text-lg font-bold leading-none text-content">{it.value.toLocaleString('pt-BR')}</span>
              <span className="block truncate text-[11px] text-muted">{it.label}</span>
            </span>
          </div>
        ))}
      </div>

      {/* STAT CARDS */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label={t('admin.kits')} value={s?.totalAssets ?? 0} iconName="stack" delta={t('dash.activeTag')} deltaTone="primary" />
        <StatCard label={t('stat.views')} value={s?.views ?? 0} iconName="eye" delta="+18.6%" />
        <StatCard label={t('stat.downloads')} value={s?.downloads ?? 0} iconName="download" delta="+21.4%" />
        <StatCard label={t('stat.remixes')} value={s?.remixes ?? 0} iconName="remix" delta="+12.3%" />
      </div>

      {/* CHART + TOP ASSETS */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="card-premium ring-hairline rounded-container p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <Typography variant="h5">{t('dash.activity30')}</Typography>
            <div className="flex items-center gap-3 text-xs text-muted">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary" /> {t('stat.opens')}</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-cyan" /> {t('dash.updates')}</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-gold" /> {t('dash.creations')}</span>
            </div>
          </div>
          <ActivityChart data={series.data ?? []} />
        </div>
        <div className="lg:col-span-1">
          <TopAssets />
        </div>
      </div>

      {/* Recentes */}
      {(recents.data?.length ?? 0) > 0 && (
        <section className="mb-8">
          <div className="mb-4 flex items-center gap-2">
            <Icon name="recent" size={18} className="text-muted" />
            <Typography variant="h4">{t('dashboard.recent')}</Typography>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recentsTr.map((a) => <AssetCard key={a.id} asset={a} />)}
          </div>
        </section>
      )}

      {/* SEUS ASSETS + TIMELINE */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <Typography variant="h4">{t('dashboard.yourAssets')}</Typography>
          </div>
          <AssetGrid />
        </div>
        <div className="lg:col-span-1">
          <ActivityTimeline />
        </div>
      </div>

      {/* BÔNUS — biblioteca externa de Skills & Packs (SKU) */}
      <div className="mt-8">
        <BonusCard />
      </div>
    </div>
  );
}
