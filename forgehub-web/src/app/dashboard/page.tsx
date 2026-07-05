'use client';
// src/app/dashboard/page.tsx — Dashboard Premium (Sprint 5.5)
import dynamic from 'next/dynamic';
import { useQuery } from '@tanstack/react-query';
import { AssetGrid } from '../../components/organisms/AssetGrid';
import { AssetCard } from '../../components/molecules/AssetCard';
import { StatCard } from '../../components/molecules/StatCard';
import { TopAssets } from '../../components/organisms/TopAssets';
import { ActivityTimeline } from '../../components/organisms/ActivityTimeline';
import { Typography } from '../../components/atoms/Typography';
import { Icon } from '../../components/atoms/Icon';
import { Skeleton } from '../../components/atoms/Skeleton';
import { listRecents, getSettings } from '../../data/userData';
import { getDashboardStats } from '../../data/assets';
import { getActivitySeries } from '../../data/dashboard';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../lib/i18n/LanguageProvider';

// Recharts sob demanda (mantém o bundle inicial leve)
const ActivityChart = dynamic(() => import('../../components/organisms/ActivityChart'), {
  ssr: false,
  loading: () => <Skeleton className="h-60 w-full rounded-interactive" />,
});

export default function DashboardPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const recents = useQuery({ queryKey: ['recents'], queryFn: () => listRecents(4) });
  const stats = useQuery({ queryKey: ['dashboard-stats'], queryFn: getDashboardStats });
  const settings = useQuery({ queryKey: ['settings'], queryFn: getSettings });
  const series = useQuery({ queryKey: ['activity-series'], queryFn: () => getActivitySeries(30) });

  const firstName = settings.data?.fullName?.trim().split(' ')[0] || user?.email?.split('@')[0] || '';
  const workspace = settings.data?.workspace?.trim() || 'Meu Workspace';
  const s = stats.data;

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* HERO */}
      <div className="bg-banner-glow relative mb-8 overflow-hidden rounded-container p-8 shadow-[0_28px_70px_-24px_rgba(124,92,252,0.65)] sm:p-10">
        <span className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-cyan/30 blur-3xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur">
              <Icon name="stack" size={13} /> {workspace}
            </span>
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              {firstName ? `Bem-vindo(a), ${firstName} 👋` : 'Bem-vindo(a) 👋'}
            </h1>
            <p className="mt-2 text-white/85">{t('dashboard.subtitle')}</p>
          </div>
          <button className="inline-flex h-11 items-center gap-2 rounded-interactive bg-white px-5 text-sm font-semibold text-[#0B1E3C] shadow-lg transition-transform hover:-translate-y-0.5">
            <Icon name="sparkles" size={16} /> Começar Auto Setup
          </button>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total de Assets" value={s?.totalAssets ?? 0} iconName="stack" delta="ativos" deltaTone="primary" />
        <StatCard label="Visualizações" value={s?.views ?? 0} iconName="eye" delta="+18.6%" />
        <StatCard label="Downloads" value={s?.downloads ?? 0} iconName="download" delta="+21.4%" />
        <StatCard label="Remixes" value={s?.remixes ?? 0} iconName="remix" delta="+12.3%" />
      </div>

      {/* CHART + TOP ASSETS */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="card-premium ring-hairline rounded-container p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <Typography variant="h5">Atividade dos últimos 30 dias</Typography>
            <div className="flex items-center gap-3 text-xs text-muted">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary" /> Aberturas</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-cyan" /> Atualizações</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-gold" /> Criações</span>
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
            {recents.data!.map((a) => <AssetCard key={a.id} asset={a} />)}
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
    </div>
  );
}
