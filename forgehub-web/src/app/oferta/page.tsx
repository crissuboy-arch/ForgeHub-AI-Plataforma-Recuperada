'use client';
// src/app/oferta/page.tsx — Página OFICIAL de vendas da ForgeHub AI (pública).
import React from 'react';
import Link from 'next/link';
import { Logo, LogoSymbol } from '../../components/atoms/Logo';
import { Badge } from '../../components/atoms/Badge';
import { Icon } from '../../components/atoms/Icon';
import { Typography } from '../../components/atoms/Typography';
import { LanguageSwitcher } from '../../components/atoms/LanguageSwitcher';
import { useLanguage } from '../../lib/i18n/LanguageProvider';
import { LimelightNav, type NavItem } from '../../components/ui/limelight-nav';
import { PlatformShowcase, type ShowcaseSlide } from '../../components/ui/platform-showcase';
import { MetricsColumn, type MetricCard } from '../../components/ui/metrics-columns';
import { ActivityChart } from '../../components/ui/activity-chart';
import { Home, Package, Workflow, Tag, HelpCircle, Download, Repeat, Eye, TrendingUp, Boxes } from 'lucide-react';

const CHECKOUT = process.env.NEXT_PUBLIC_FORGEHUB_CHECKOUT_URL || '';

// helpers de parsing (listas vindas do dicionário)
const pipe = (s: string) => s.split('|').filter(Boolean);
const pairs = (s: string) => pipe(s).map((p) => { const [a, b] = p.split('::'); return { a, b: b ?? '' }; });

// CTA: usa o checkout externo se configurado, senão cai para o cadastro.
const Cta: React.FC<{ t: (k: string) => string; className?: string; label?: string }> = ({ t, className, label }) =>
  CHECKOUT ? (
    <a href={CHECKOUT} target="_blank" rel="noopener noreferrer" className={className}>{label ?? t('offer.ctaMain')}</a>
  ) : (
    <Link href="/signup" className={className}>{label ?? t('offer.ctaMain')}</Link>
  );

export default function OfferPage() {
  const { t } = useLanguage();

  const primaryBtn = 'bg-brand-glow inline-flex h-13 items-center justify-center gap-2 rounded-interactive px-8 py-3.5 text-base font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow-blue)]';
  const sectionTitle = 'font-display text-3xl font-extrabold tracking-tight text-content sm:text-4xl';

  // Scroll suave para as âncoras da página (usado pela LimelightNav).
  const scrollToId = (id: string) =>
    (id === 'home'
      ? window.scrollTo({ top: 0, behavior: 'smooth' })
      : document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }));

  const navItems: NavItem[] = [
    { id: 'home', icon: <Home />, label: t('nav.home'), onClick: () => scrollToId('home') },
    { id: 'kits', icon: <Package />, label: t('nav.kits'), onClick: () => scrollToId('kits') },
    { id: 'how', icon: <Workflow />, label: t('nav.how'), onClick: () => scrollToId('como-funciona') },
    { id: 'pricing', icon: <Tag />, label: t('nav.pricing'), onClick: () => scrollToId('precos') },
    { id: 'faq', icon: <HelpCircle />, label: t('nav.faq'), onClick: () => scrollToId('faq') },
  ];

  // Screenshots REAIS da plataforma (exportados do próprio app).
  const slides: ShowcaseSlide[] = [
    { src: '/images/showcase/dashboard.png', caption: t('showcase.dashboard') },
    { src: '/images/showcase/hero-banner.png', caption: t('showcase.heroBanner') },
    { src: '/images/showcase/kits.png', caption: t('showcase.kits') },
    { src: '/images/showcase/nichos.png', caption: t('showcase.nichos') },
    { src: '/images/showcase/studio.png', caption: t('showcase.studio') },
  ];

  // Números REAIS do dashboard (não são depoimentos fake).
  const metrics: MetricCard[] = [
    { icon: Download, value: '1.995', label: t('metric.downloads') },
    { icon: Repeat, value: '340', label: t('metric.remixes') },
    { icon: Eye, value: '8.600', label: t('metric.views') },
    { icon: TrendingUp, value: '+21,4%', label: t('metric.growth') },
    { icon: Boxes, value: '6', label: t('metric.kits') },
  ];
  const firstCol = metrics.slice(0, 3);
  const secondCol = metrics.slice(2);

  return (
    <div className="relative flex min-h-screen flex-col bg-deep">
      {/* Nav (LimelightNav) */}
      <header className="sticky top-0 z-20 border-b border-border/60">
        <div className="glass mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 py-3">
          <Logo />
          <LimelightNav items={navItems} className="hidden md:inline-flex" />
          <div className="flex items-center gap-2">
            <LanguageSwitcher className="hidden sm:flex" />
            <Link href="/login" className="hidden rounded-interactive px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-content sm:block">{t('offer.login')}</Link>
            <Cta t={t} className="bg-brand-glow inline-flex h-10 items-center rounded-interactive px-5 text-sm font-semibold text-white transition-shadow hover:shadow-[var(--shadow-glow-blue)]" label={t('offer.ctaMain')} />
          </div>
        </div>
      </header>

      <main className="relative mx-auto w-full max-w-6xl flex-1 px-6">
        {/* 1. Hero */}
        <section id="home" className="flex flex-col items-center pt-20 text-center">
          <Badge tone="primary" className="mb-6"><Icon name="sparkles" size={14} /> {t('offer.badge')}</Badge>
          <h1 className="max-w-4xl font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-content sm:text-6xl">
            {t('offer.headline')}
          </h1>
          <Typography variant="p" className="mt-6 max-w-2xl text-lg">{t('offer.sub')}</Typography>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Cta t={t} className={primaryBtn} />
            <Link href="/planos" className="inline-flex h-13 items-center justify-center gap-2 rounded-interactive border border-white/15 px-8 py-3.5 text-base font-semibold text-content transition-colors hover:border-primary/50 hover:bg-surface-2">
              {t('offer.secondary')} <Icon name="chevron" size={16} />
            </Link>
          </div>
          <p className="mt-5 text-xs text-dim">{t('offer.noCard')}</p>

          {/* Preview */}
          <div className="relative mt-16 w-full max-w-4xl">
            <div className="absolute inset-0 -z-0 mx-auto h-40 w-3/4 bg-brand-glow opacity-30 blur-3xl" />
            <div className="card-premium relative rounded-container p-2 shadow-modal">
              <div className="flex h-64 items-center justify-center rounded-[12px] border border-border bg-surface sm:h-80">
                <LogoSymbol size={72} />
              </div>
            </div>
          </div>
        </section>

        {/* 2. O que é (reframe) */}
        <section className="py-24 text-center">
          <h2 className={sectionTitle}>{t('offer.whatTitle')}</h2>
          <Typography variant="p" className="mx-auto mt-4 max-w-3xl text-lg">{t('offer.whatDesc')}</Typography>
        </section>

        {/* 2b. Carrossel da plataforma real */}
        <section id="kits" className="py-16">
          <div className="mb-10 text-center">
            <Badge tone="gold" className="mb-4"><Icon name="sparkles" size={14} /> {t('nav.kits')}</Badge>
            <h2 className={sectionTitle}>{t('offer.showcaseTitle')}</h2>
            <Typography variant="p" className="mx-auto mt-4 max-w-2xl text-lg">{t('offer.showcaseSub')}</Typography>
          </div>
          <PlatformShowcase slides={slides} />
        </section>

        {/* 2c. Números reais + gráfico (prova social por dados, não depoimento fake) */}
        <section id="prova" className="py-20">
          <div className="mb-12 text-center">
            <h2 className={sectionTitle}>{t('offer.realTitle')}</h2>
            <Typography variant="p" className="mx-auto mt-4 max-w-2xl text-lg">{t('offer.realSub')}</Typography>
          </div>
          <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
            <ActivityChart
              title={t('chart.title')}
              labels={{ aberturas: t('chart.opens'), atualizacoes: t('chart.updates'), criacoes: t('chart.creations') }}
            />
            <div className="flex max-h-[420px] justify-center gap-5 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_16%,black_84%,transparent)]">
              <MetricsColumn metrics={firstCol} duration={16} />
              <MetricsColumn metrics={secondCol} duration={22} className="hidden sm:block" />
            </div>
          </div>
        </section>

        {/* 3. Como funciona */}
        <section id="como-funciona" className="py-8">
          <h2 className={`${sectionTitle} mb-10 text-center`}>{t('offer.howTitle')}</h2>
          <div className="grid gap-5 sm:grid-cols-3">
            {pairs(t('offer.how')).map((s, i) => (
              <div key={s.a} className="card-premium ring-hairline rounded-container p-6">
                <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-interactive bg-primary/15 font-display font-bold text-primary-hover">{i + 1}</span>
                <Typography variant="h5" className="mb-1">{s.a}</Typography>
                <Typography variant="small">{s.b}</Typography>
              </div>
            ))}
          </div>
        </section>

        {/* 4. O que vem em cada kit */}
        <section className="py-24 text-center">
          <h2 className={`${sectionTitle} mb-3`}>{t('offer.kitTitle')}</h2>
          <div className="mx-auto mt-8 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3">
            {pipe(t('offer.kitItems')).map((it) => (
              <div key={it} className="flex items-center gap-2 rounded-container border border-border bg-card px-4 py-3 text-left text-sm font-medium text-content">
                <Icon name="check" size={15} className="shrink-0 text-success" /> {it}
              </div>
            ))}
          </div>
        </section>

        {/* 5. Exemplos de nichos */}
        <section className="py-8 text-center">
          <h2 className={`${sectionTitle} mb-6`}>{t('offer.nichesTitle')}</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {pipe(t('offer.niches')).map((n) => (
              <span key={n} className="rounded-full border border-border bg-surface/60 px-4 py-1.5 text-sm font-medium text-content">{n}</span>
            ))}
          </div>
        </section>

        {/* 6. Demonstração */}
        <section className="py-24">
          <div className="bg-banner-glow relative overflow-hidden rounded-container p-8 text-center shadow-modal sm:p-14">
            <span className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-cyan/30 blur-3xl" />
            <Typography variant="h2" className="relative text-white">{t('offer.demoTitle')}</Typography>
            <p className="relative mx-auto mt-3 max-w-2xl text-white/85">{t('offer.demoDesc')}</p>
            <Cta t={t} className="relative mt-8 inline-flex h-12 items-center justify-center rounded-interactive bg-white px-8 text-sm font-bold text-[#0B1E3C] transition-transform hover:-translate-y-0.5" />
          </div>
        </section>

        {/* 7. Bônus + 9. Garantia */}
        <section className="grid gap-6 py-8 lg:grid-cols-2">
          <div className="card-premium ring-hairline rounded-container p-8">
            <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-interactive bg-gold-glow text-deep"><Icon name="star" size={22} /></span>
            <Typography variant="h4" className="mb-2">{t('offer.bonusTitle')}</Typography>
            <Typography variant="p">{t('bonus.desc')}</Typography>
          </div>
          <div className="card-premium ring-hairline rounded-container p-8">
            <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-interactive bg-success/15 text-success"><Icon name="check" size={22} /></span>
            <Typography variant="h4" className="mb-2">{t('offer.guaranteeTitle')}</Typography>
            <Typography variant="p">{t('offer.guaranteeDesc')}</Typography>
          </div>
        </section>

        {/* 8. Planos */}
        <section id="precos" className="py-16 text-center">
          <h2 className={`${sectionTitle} mb-2`}>{t('offer.plansTitle')}</h2>
          <Typography variant="p" className="mx-auto mb-8 max-w-xl">{t('offer.plansDesc')}</Typography>
          <div className="mx-auto mb-8 flex max-w-2xl flex-wrap justify-center gap-3">
            {['Starter', 'Pro', 'Premium'].map((p) => (
              <span key={p} className="rounded-container border border-border bg-card px-6 py-3 font-display font-bold text-content">{p}</span>
            ))}
          </div>
          <Link href="/planos" className={primaryBtn}>{t('offer.secondary')}</Link>
        </section>

        {/* 10. FAQ */}
        <section id="faq" className="py-16">
          <h2 className={`${sectionTitle} mb-8 text-center`}>{t('offer.faqTitle')}</h2>
          <div className="mx-auto max-w-3xl space-y-3">
            {pairs(t('offer.faq')).map((f) => (
              <details key={f.a} className="group rounded-container border border-border bg-card p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold text-content">
                  {f.a} <Icon name="chevron" size={16} className="text-muted transition-transform group-open:rotate-90" />
                </summary>
                <p className="mt-3 text-sm text-muted">{f.b}</p>
              </details>
            ))}
          </div>
        </section>

        {/* 11. CTA final */}
        <section className="pb-24">
          <div className="bg-banner-glow relative overflow-hidden rounded-container p-10 text-center shadow-[0_28px_70px_-24px_rgba(20,114,255,0.6)] sm:p-16">
            <Typography variant="h2" className="relative mb-3 text-white">{t('offer.finalTitle')}</Typography>
            <p className="relative mx-auto mb-8 max-w-xl text-lg text-white/85">{t('offer.finalDesc')}</p>
            <Cta t={t} className="relative inline-flex h-13 items-center justify-center rounded-interactive bg-white px-9 py-3.5 text-base font-bold text-[#0B1E3C] transition-transform hover:-translate-y-0.5" />
            {!CHECKOUT && <p className="relative mt-4 text-xs text-white/60">{t('offer.checkoutNotice')}</p>}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <Logo />
          <Typography variant="caption">{t('home.footer')}</Typography>
        </div>
      </footer>
    </div>
  );
}
