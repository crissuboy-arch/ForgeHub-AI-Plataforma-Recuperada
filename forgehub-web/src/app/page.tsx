'use client';
import Link from 'next/link';
import { Typography } from '../components/atoms/Typography';
import { Badge } from '../components/atoms/Badge';
import { Icon } from '../components/atoms/Icon';
import { Logo, LogoSymbol } from '../components/atoms/Logo';
import { useLanguage } from '../lib/i18n/LanguageProvider';

const FEATURES = [
  { icon: 'sparkles', t: 'home.f1t', d: 'home.f1d' },
  { icon: 'stack', t: 'home.f2t', d: 'home.f2d' },
  { icon: 'bolt', t: 'home.f3t', d: 'home.f3d' },
  { icon: 'command', t: 'home.f4t', d: 'home.f4d' },
];

export default function Home() {
  const { t } = useLanguage();
  return (
    <div className="relative flex min-h-screen flex-col bg-deep">
      {/* Nav */}
      <header className="sticky top-0 z-20 border-b border-border/60">
        <div className="glass mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Logo />
          <nav className="flex items-center gap-2">
            <Link href="/login" className="rounded-interactive px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-content">{t('auth.login')}</Link>
            <Link href="/signup" className="bg-brand-glow inline-flex h-10 items-center rounded-interactive px-5 text-sm font-semibold text-white transition-shadow hover:shadow-[var(--shadow-glow-blue)]">{t('home.startFree')}</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col items-center px-6 pt-24 text-center">
        <Badge tone="primary" className="mb-6">
          <Icon name="sparkles" size={14} /> {t('home.badge')}
        </Badge>
        <h1 className="max-w-3xl font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-content sm:text-6xl">
          {t('home.heroTitle1')}{' '}
          <span className="text-brand-glow">{t('home.heroTitleHl')}</span>
        </h1>
        <Typography variant="p" className="mt-6 max-w-2xl text-lg">
          {t('home.heroSub')}
        </Typography>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link href="/signup" className="bg-brand-glow inline-flex h-12 items-center justify-center rounded-interactive px-7 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow-blue)]">
            {t('home.startNow')}
          </Link>
          <Link href="/dashboard" className="inline-flex h-12 items-center justify-center gap-2 rounded-interactive border border-white/15 px-7 text-sm font-semibold text-content transition-colors hover:border-primary/50 hover:bg-surface-2">
            {t('home.seeDemo')} <Icon name="chevron" size={16} />
          </Link>
        </div>
        <p className="mt-5 text-xs text-dim">{t('home.noCard')}</p>

        {/* Preview */}
        <div className="relative mt-20 w-full max-w-5xl">
          <div className="absolute inset-0 -z-0 mx-auto h-40 w-3/4 bg-brand-glow opacity-30 blur-3xl" />
          <div className="card-premium relative rounded-container p-2 shadow-modal">
            <div className="flex h-72 items-center justify-center rounded-[12px] border border-border bg-surface sm:h-[26rem]">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-container" style={{ boxShadow: 'var(--shadow-glow-blue)' }}>
                  <LogoSymbol size={64} />
                </div>
                <Typography variant="small">{t('home.previewLabel')}</Typography>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features */}
      <section className="mx-auto w-full max-w-6xl px-6 py-24">
        <div className="mb-14 text-center">
          <Typography variant="h2" className="mb-3">{t('home.featuresTitle')}</Typography>
          <Typography variant="p" className="mx-auto max-w-xl">{t('home.featuresSub')}</Typography>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.t} className="card-premium lift glow-blue-hover ring-hairline rounded-container p-6 hover:border-primary/40">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-interactive bg-primary/15 text-primary-hover">
                <Icon name={f.icon} size={22} />
              </div>
              <Typography variant="h5" className="mb-2">{t(f.t)}</Typography>
              <Typography variant="small">{t(f.d)}</Typography>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-5xl px-6 pb-24">
        <div className="bg-banner-glow relative overflow-hidden rounded-container p-10 text-center shadow-[0_28px_70px_-24px_rgba(124,92,252,0.6)] sm:p-16">
          <span className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan/30 blur-3xl" />
          <Typography variant="h2" className="relative mb-3 text-white">{t('home.ctaTitle')}</Typography>
          <p className="relative mx-auto mb-8 max-w-xl text-lg text-white/85">{t('home.ctaSub')}</p>
          <Link href="/signup" className="relative inline-flex h-12 items-center justify-center rounded-interactive bg-white px-8 text-sm font-semibold text-[#0B1E3C] transition-transform hover:-translate-y-0.5">
            {t('home.ctaBtn')}
          </Link>
        </div>
      </section>

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
