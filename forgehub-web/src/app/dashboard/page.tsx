'use client';
// src/app/dashboard/page.tsx — Dashboard Premium (Sprint 5.5)
import { useEffect, useMemo, useState } from 'react';
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
import { useTranslatedSummaries } from '../../hooks/useTranslatedSummaries';

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
  const recentsTr = useTranslatedSummaries(recents.data);

  const firstName = settings.data?.fullName?.trim().split(' ')[0] || user?.email?.split('@')[0] || '';
  const workspace = settings.data?.workspace?.trim() || t('sidebar.workspace');
  const s = stats.data;

  // Hero slider (item 7): boas-vindas + nichos em loop, fade a cada 5s.
  const slides = useMemo(() => {
    const niches = t('dash.slides').split('|');
    return [
      { title: firstName ? `${t('dash.welcome')}, ${firstName} 👋` : `${t('dash.welcome')} 👋`, sub: t('dashboard.subtitle') },
      ...niches.map((nName) => ({ title: nName, sub: t('dash.slideSub') })),
    ];
  }, [t, firstName]);
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setSlide((v) => (v + 1) % slides.length), 5000);
    return () => window.clearInterval(id);
  }, [slides.length]);

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
            {/* Slider de boas-vindas + nichos (item 7) */}
            <div className="relative h-[92px] sm:h-[104px]">
              {slides.map((sl, i) => (
                <div
                  key={i}
                  className={`absolute inset-0 transition-opacity duration-700 ${i === slide ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
                  aria-hidden={i !== slide}
                >
                  <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">{sl.title}</h1>
                  <p className="mt-2 text-white/85">{sl.sub}</p>
                </div>
              ))}
            </div>
            {/* Indicadores do slider */}
            <div className="mt-3 flex gap-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSlide(i)}
                  aria-label={`Slide ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${i === slide ? 'w-5 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'}`}
                />
              ))}
            </div>
          </div>
          <button className="inline-flex h-11 items-center gap-2 rounded-interactive bg-white px-5 text-sm font-semibold text-[#0B1E3C] shadow-lg transition-transform hover:-translate-y-0.5">
            <Icon name="sparkles" size={16} /> {t('dash.autoSetup')}
          </button>
        </div>
      </div>

      {/* INDICADORES RÁPIDOS (item 7) */}
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
    </div>
  );
}
