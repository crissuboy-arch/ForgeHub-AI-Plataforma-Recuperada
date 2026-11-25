'use client';
// src/app/oferta/page.tsx — Página OFICIAL de vendas da ForgeHub AI (pública).
import React from 'react';
import Link from 'next/link';
import { trackMeta, CHECKOUT_PRODUCT, checkoutValue } from '../../lib/analytics/meta-pixel';
import { usePricing } from '../../lib/pricing/PricingProvider';
import { formatPrice, BLACK_FRIDAY_END_MS } from '../../config/pricing';
import { Logo, LogoSymbol } from '../../components/atoms/Logo';
import { Badge } from '../../components/atoms/Badge';
import { Icon } from '../../components/atoms/Icon';
import { Typography } from '../../components/atoms/Typography';
import { LanguageSwitcher } from '../../components/atoms/LanguageSwitcher';
import { CheckoutCta } from '../../components/atoms/CheckoutCta';
import { useLanguage } from '../../lib/i18n/LanguageProvider';
import dynamic from 'next/dynamic';
import { LimelightNav, type NavItem } from '../../components/ui/limelight-nav';
import type { ShowcaseSlide } from '../../components/ui/platform-showcase';
import type { PlatformTypeCard } from '../../components/ui/platform-types-showcase';
import type { MetricCard } from '../../components/ui/metrics-columns';
import { DeadlineCountdown } from '../../components/ui/launch-countdown';
import { InViewMount } from '../../components/ui/in-view-mount';
import { Home, Package, Workflow, Tag, HelpCircle, Boxes, ShieldCheck, Check, Smartphone, Bot, LayoutTemplate, BookOpen, CalendarDays, Library, Lock, Mail } from 'lucide-react';
import { LIBRARY, CONTACT_EMAIL } from '../../config/offer';

// Componentes pesados (embla / recharts / framer-motion) fora do bundle inicial:
// carregam sob demanda, só no cliente, quando o bloco entra na viewport.
const PlatformShowcase = dynamic(() => import('../../components/ui/platform-showcase').then((m) => m.PlatformShowcase), {
  ssr: false,
});
const PlatformTypesShowcase = dynamic(() => import('../../components/ui/platform-types-showcase').then((m) => m.PlatformTypesShowcase), {
  ssr: false,
});

// helpers de parsing (listas vindas do dicionário)
const pipe = (s: string) => s.split('|').filter(Boolean);
const pairs = (s: string) => pipe(s).map((p) => { const [a, b] = p.split('::'); return { a, b: b ?? '' }; });

// CTA de checkout compartilhado (mesmo componente da landing).
const Cta: React.FC<{ t: (k: string) => string; className?: string; label?: string }> = ({ t, className = '', label }) => (
  <CheckoutCta label={label ?? t('offer.ctaMain')} className={className} />
);

export default function OfferPage() {
  const { t, lang } = useLanguage();
  const pricing = usePricing();

  // Meta Pixel — /oferta é a página oficial de oferta: visualizá-la é o evento
  // padrão `ViewContent` (interesse no produto). Uma vez por montagem da página.
  React.useEffect(() => {
    trackMeta('ViewContent', {
      content_ids: [CHECKOUT_PRODUCT.id],
      content_name: CHECKOUT_PRODUCT.name,
      content_type: 'product',
      value: checkoutValue(),
      currency: CHECKOUT_PRODUCT.currency,
    });
  }, []);

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
    { src: '/images/showcase-vitrine/nutricao.webp', caption: t('showcase.nutricao') },
    { src: '/images/showcase-vitrine/infantil.webp', caption: t('showcase.infantil') },
    { src: '/images/showcase-vitrine/saude.webp', caption: t('showcase.saude') },
    { src: '/images/showcase-vitrine/analytics.webp', caption: t('showcase.analytics') },
    { src: '/images/showcase-vitrine/kits.webp', caption: t('showcase.kitsLibrary') },
    { src: '/images/showcase-vitrine/comingsoon.webp', caption: t('showcase.comingSoon') },
    { src: '/images/showcase-vitrine/gastronomia.webp', caption: t('showcase.gastronomia') },
    { src: '/images/showcase-vitrine/relacionamentos.webp', caption: t('showcase.relacionamentos') },
  ];

  // Tipos de recursos que existem na plataforma (screenshots reais de kits).
  const platformTypeCards: PlatformTypeCard[] = [
    {
      id: 'apps',
      label: t('platformType.apps'),
      icon: Smartphone,
      images: [
        { src: '/images/platform-types/app-nutricao.webp', alt: t('platformType.apps') },
        { src: '/images/platform-types/app-beleza.webp', alt: t('platformType.apps') },
        { src: '/images/platform-types/app-devocional.webp', alt: t('platformType.apps') },
      ],
    },
    {
      id: 'ai-agents',
      label: t('platformType.aiAgents'),
      icon: Bot,
      images: [
        { src: '/images/platform-types/ia-skill-library.webp', alt: t('platformType.aiAgents') },
        { src: '/images/platform-types/ia-relacionamentos-chat.webp', alt: t('platformType.aiAgents') },
        { src: '/images/platform-types/ia-meta-ads.webp', alt: t('platformType.aiAgents') },
      ],
    },
    {
      id: 'sales-pages',
      label: t('platformType.salesPages'),
      icon: LayoutTemplate,
      images: [
        { src: '/images/platform-types/venda-crescendo-jesus.webp', alt: t('platformType.salesPages') },
        { src: '/images/platform-types/venda-alimentacao.webp', alt: t('platformType.salesPages') },
        { src: '/images/platform-types/venda-controlar.webp', alt: t('platformType.salesPages') },
      ],
    },
    {
      id: 'ebooks',
      label: t('platformType.ebooks'),
      icon: BookOpen,
      images: [
        { src: '/images/platform-types/ebook-365-manhas.webp', alt: t('platformType.ebooks') },
      ],
    },
    {
      id: 'planners',
      label: t('platformType.planners'),
      icon: CalendarDays,
      images: [{ src: '/images/platform-types/planner-calendario.webp', alt: t('platformType.planners') }],
    },
    {
      id: 'library',
      label: t('platformType.library'),
      icon: Library,
      images: [{ src: '/images/platform-types/biblioteca-crescendo-jesus.webp', alt: t('platformType.library') }],
    },
  ];

  // Só fatos verificáveis anunciados na /oferta: 7 kits / 7 nichos.
  // Sem a divisão «6 kits + 2 apps» e sem contadores de downloads/visualizações sem fonte.
  const facts: MetricCard[] = [
    { icon: Boxes, value: String(LIBRARY.total), label: t('metric.kits') },
    { icon: Library, value: String(LIBRARY.total), label: t('metric.niches') },
    { icon: ShieldCheck, value: '7', label: t('metric.guaranteeDays') },
    { icon: Check, value: '1x', label: t('metric.oneTime') },
  ];

  // O que a pessoa recebe logo após o pagamento (só o que o produto entrega de verdade).
  const afterPay = pipe(t('price.afterPay'));

  return (
    <div className="relative flex min-h-screen flex-col bg-deep">
      {/* Faixa fixa Semana Black — bem visível no topo (só durante a promo) */}
      {pricing.promo && (
        <div className="bg-black px-4 py-2.5 text-center text-[13px] font-bold tracking-wide text-[#f5c542] sm:text-sm">
          🖤 {t('promo.announce')}
        </div>
      )}
      {/* Nav (LimelightNav) */}
      <header className="sticky top-0 z-20 border-b border-border/60">
        <div className="glass mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 py-3">
          <Logo />
          {/* wrapper controla o display (o root da nav tem inline-flex fixo,
              que venceria um `hidden` aplicado direto na nav) */}
          <div className="hidden md:block">
            <LimelightNav items={navItems} />
          </div>
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
            <Link href="#precos" className="inline-flex h-13 items-center justify-center gap-2 rounded-interactive border border-white/15 px-8 py-3.5 text-base font-semibold text-content transition-colors hover:border-primary/50 hover:bg-surface-2">
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
          <InViewMount className="min-h-[300px] sm:min-h-[460px] lg:min-h-[500px]">
            <PlatformShowcase slides={slides} />
          </InViewMount>
        </section>

        {/* 2c. A plataforma hoje — só números verificáveis (sem gráfico simulado) */}
        <section id="prova" className="py-20">
          <div className="mb-12 text-center">
            <h2 className={sectionTitle}>{t('offer.realTitle')}</h2>
            <Typography variant="p" className="mx-auto mt-4 max-w-2xl text-lg">{t('offer.realSub')}</Typography>
          </div>
          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {facts.map(({ icon: FactIcon, value, label }) => (
              <div key={label} className="card-premium ring-hairline rounded-container p-5 text-left">
                <FactIcon className="mb-3 h-5 w-5 text-gold" />
                <p className="font-display text-3xl font-extrabold text-content">{value}</p>
                <p className="mt-1 text-sm text-muted">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 2d. Conheça tudo que existe na plataforma (tipos de recursos) */}
        <section className="py-16">
          <div className="mb-10 text-center">
            <Badge tone="gold" className="mb-4"><Icon name="sparkles" size={14} /> {t('offer.platformTypesKicker')}</Badge>
            <h2 className={sectionTitle}>{t('offer.platformTypesTitle')}</h2>
            <Typography variant="p" className="mx-auto mt-4 max-w-2xl text-lg">{t('offer.platformTypesSub')}</Typography>
          </div>
          <InViewMount className="min-h-[420px] sm:min-h-[480px] lg:min-h-[520px]">
            <PlatformTypesShowcase cards={platformTypeCards} />
          </InViewMount>
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

        {/* 8. Preço único de lançamento (pagamento único — sem tiers/assinatura no MVP) */}
        <section id="precos" className="py-16">
          <div className="mx-auto max-w-xl">
            <div className="card-premium ring-hairline relative overflow-hidden rounded-container p-7 text-center shadow-modal sm:p-10">
              <span className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold-glow opacity-20 blur-3xl" />

              <div className="relative">
                <Badge tone="gold" className="mb-6"><Icon name="sparkles" size={14} /> {pricing.promo ? t('promo.badge') : t('price.badge')}</Badge>

                {/* O que você recebe logo após o pagamento */}
                <div className="mb-7 rounded-container border border-border bg-deep/40 p-5 text-left">
                  <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-muted">{t('price.afterPayTitle')}</p>
                  <ul className="space-y-2">
                    {afterPay.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-content">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> {item}
                      </li>
                    ))}
                  </ul>
                  {pricing.promo && (
                    <p className="mt-4 border-t border-border pt-3 text-center text-sm font-semibold text-content">
                      {t('price.normalLabel')} {formatPrice(pricing.regular, lang)} · {t('promo.shortLabel')} <span className="text-gold-light">{formatPrice(pricing.current, lang)}</span> · {t('price.oneTimeShort')}
                    </p>
                  )}
                </div>

                {/* Preço */}
                {pricing.promo && (
                  <p className="text-sm text-muted">{t('price.oldLabel')} <span className="text-base font-semibold text-muted line-through">{formatPrice(pricing.regular, lang)}</span></p>
                )}
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-gold">{t('price.nowLabel')}</p>
                <p className="font-display text-5xl font-extrabold tracking-tight text-content sm:text-6xl">{formatPrice(pricing.current, lang)}</p>
                <p className="mx-auto mt-3 max-w-sm text-sm text-muted">{t('price.oneTime')}</p>
                <p className="mx-auto mt-1 max-w-sm text-sm text-content">{t('price.perItem').replace('{n}', String(LIBRARY.total)).replace('{v}', formatPrice(Math.round((pricing.current / LIBRARY.total) * 100) / 100, lang))}</p>
                {pricing.promo && (
                  <p className="mx-auto mt-2 max-w-sm text-sm font-semibold text-gold">{t('promo.revert')}</p>
                )}

                {/* Contador — só o prazo REAL da Semana Black (30/11 23:59 BRT); fora da promo não há contador */}
                {pricing.promo && (
                  <div className="mt-7">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">{t('promo.endsIn')}</p>
                    <DeadlineCountdown
                      deadline={BLACK_FRIDAY_END_MS}
                      labels={{ days: t('countdown.days'), hours: t('countdown.hours'), minutes: t('countdown.minutes'), seconds: t('countdown.seconds') }}
                    />
                  </div>
                )}

                {/* CTA dourado */}
                <Cta
                  t={t}
                  className="bg-gold-glow mt-8 inline-flex h-13 w-full items-center justify-center rounded-interactive px-8 py-3.5 text-base font-extrabold tracking-wide text-deep shadow-[var(--shadow-glow-gold)] transition-transform hover:-translate-y-0.5"
                  label={t('price.cta')}
                />

                {/* Checkout seguro: Pix ou cartão (Cakto) */}
                <p className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-content">
                  <Lock className="h-4 w-4 text-success" /> {t('price.secure')}
                </p>
                <p className="mt-1 text-xs text-dim">{t('price.fee')}</p>

                {/* Garantia de 7 dias — caixa junto ao preço */}
                <div className="mt-6 flex items-start gap-3 rounded-container border border-success/40 bg-success/10 p-4 text-left">
                  <ShieldCheck className="mt-0.5 h-7 w-7 shrink-0 text-success" />
                  <div>
                    <p className="text-sm font-bold text-content">{t('price.guaranteeBoxTitle')}</p>
                    <p className="mt-1 text-sm text-muted">{t('price.guaranteeBoxDesc')}</p>
                  </div>
                </div>

                {CONTACT_EMAIL && (
                  <p className="mt-4 flex items-center justify-center gap-2 text-sm text-muted">
                    <Mail className="h-4 w-4" /> {t('price.contact')} <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-content underline">{CONTACT_EMAIL}</a>
                  </p>
                )}

                <p className="mx-auto mt-6 max-w-md text-xs leading-relaxed text-dim">{pricing.promo ? t('promo.footnote') : t('price.footnote')}</p>
              </div>
            </div>
          </div>
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
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <Logo />
          <Typography variant="caption">{t('home.footer')}</Typography>
          {CONTACT_EMAIL && (
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-xs text-muted underline">{CONTACT_EMAIL}</a>
          )}
        </div>
      </footer>
    </div>
  );
}
