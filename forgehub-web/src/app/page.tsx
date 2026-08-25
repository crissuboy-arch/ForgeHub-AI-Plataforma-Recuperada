'use client';
// src/app/page.tsx — Landing Page premium da ForgeHub AI.
// Dark premium (ink/royal/gold), glassmorphism, motion suave, trilíngue.
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion } from 'motion/react';
import { Check, X, Zap, ShoppingBag, CreditCard, BookOpen, Palette, ImageIcon, Video, Layers, Sparkles, BrainCircuit, FileText, Calculator, RefreshCw, ShieldCheck, Smartphone, Bot, LayoutTemplate, CalendarDays, Library } from 'lucide-react';
import { Logo } from '../components/atoms/Logo';
import { LanguageSwitcher } from '../components/atoms/LanguageSwitcher';
import { useLanguage } from '../lib/i18n/LanguageProvider';
import { Reveal, Counter } from '../components/landing/primitives';
import { HeroShowcase } from '../components/landing/HeroShowcase';
import { LiveLibrary, type LibItem } from '../components/landing/LiveLibrary';
import { CheckoutCta } from '../components/atoms/CheckoutCta';
import { InViewMount } from '../components/ui/in-view-mount';
import { AnnouncementBar } from '../components/ui/announcement-bar';
import type { PlatformTypeCard } from '../components/ui/platform-types-showcase';
import type { ImageItem } from '../components/ui/phone-mockups-1-utils/phone-carousel';

// Componentes pesados (embla) fora do bundle inicial: carregam sob demanda, só no cliente.
const PlatformTypesShowcase = dynamic(() => import('../components/ui/platform-types-showcase').then((m) => m.PlatformTypesShowcase), {
  ssr: false,
});
const PhoneMockupBasic = dynamic(() => import('../components/ui/phone-mockups-1'), { ssr: false });

// ---- helpers de parsing (listas do dicionário) ----
const pipe = (s: string) => s.split('|').map((x) => x.trim()).filter(Boolean);
const pairs = (s: string) => pipe(s).map((p) => { const [a, b] = p.split('::'); return { a: a?.trim() ?? '', b: b?.trim() ?? '' }; });

// ---- CTA dourado (checkout externo → fallback /signup) ----
const goldBtn =
  'group relative inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-b from-goldp to-[#b9922f] px-8 py-4 text-base font-extrabold tracking-wide text-ink shadow-[0_12px_40px_-8px_rgba(217,180,74,0.6)] transition-transform hover:-translate-y-0.5';

// CTA dourado da landing = CheckoutCta compartilhado + estilo goldBtn.
const Cta = ({ label, className = '' }: { label: string; className?: string }) => (
  <CheckoutCta label={label} className={`${goldBtn} ${className}`} />
);

// ---- ícones dos entregáveis (na ordem da lista lp.insideList) ----
const INSIDE_ICONS = [Zap, ShoppingBag, CreditCard, BookOpen, Palette, ImageIcon, Video, Layers, Sparkles, BrainCircuit, FileText, Calculator, RefreshCw];

const STATUS: Record<string, { key: string; color: string }> = {
  producao: { key: 'lp.status.producao', color: '#22c55e' },
  proximo: { key: 'lp.status.proximo', color: '#f59e0b' },
  atualizado: { key: 'lp.status.atualizado', color: '#246bff' },
  novo: { key: 'lp.status.novo', color: '#d9b44a' },
};

const sectionTitle = 'font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl';
const kicker = 'mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white/60';

export default function Home() {
  const { t } = useLanguage();

  const stats = [
    { value: 6, suffix: '+', label: t('lp.stat.kits') },
    { value: 15, suffix: '+', label: t('lp.stat.niches') },
    { value: 1995, suffix: '+', label: t('lp.stat.downloads') },
    { value: 1, prefix: '+', label: t('lp.stat.newkit') },
  ];

  const libItems: LibItem[] = pairs(t('lp.libList')).map(({ a, b }) => {
    const s = STATUS[b] ?? STATUS.producao;
    return { name: a, status: t(s.key), color: s.color };
  });

  const inside = pairs(t('lp.insideList'));
  const niches = pipe(t('lp.nichesList'));
  const steps = pairs(t('lp.howSteps'));
  const valueRows = pairs(t('lp.valueList')).map(({ a, b }) => ({ label: a, price: Number(b) }));
  const valueTotal = valueRows.reduce((sum, r) => sum + (r.price || 0), 0);
  const faq = pairs(t('lp.faq'));
  const brl = (n: number) => `R$ ${n.toLocaleString('pt-BR')}`;

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
        { src: '/images/platform-types/venda-detox.webp', alt: t('platformType.salesPages') },
      ],
    },
    {
      id: 'ebooks',
      label: t('platformType.ebooks'),
      icon: BookOpen,
      images: [{ src: '/images/platform-types/ebook-365-manhas.webp', alt: t('platformType.ebooks') }],
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

  // Depoimentos reais de alunos (prints de conversa fornecidos pelo cliente).
  const testimonialImages: ImageItem[] = [
    { src: '/images/depoimentos/depoimento-priscila.webp', alt: 'Depoimento de Priscila' },
    { src: '/images/depoimentos/depoimento-raimuindo.webp', alt: 'Depoimento de Raimuindo' },
    { src: '/images/depoimentos/depoimento-ana.webp', alt: 'Depoimento de Ana' },
    { src: '/images/depoimentos/depoimento-maria.webp', alt: 'Depoimento de Maria' },
    { src: '/images/depoimentos/depoimento-pedro.webp', alt: 'Depoimento de Pedro' },
    { src: '/images/depoimentos/depoimento-benedita.webp', alt: 'Depoimento de Benedita' },
  ];

  const announcementItems = pipe(t('lp.announcementItems'));

  return (
    <div className="relative flex min-h-screen flex-col bg-ink text-white">
      {/* ============ Barra de avisos (marquee) — topo absoluto, acima do header ============ */}
      <AnnouncementBar items={announcementItems} />

      {/* Glows ambientes */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-royal/15 blur-[130px]" />
        <div className="absolute top-[40%] -right-40 h-[420px] w-[420px] rounded-full bg-goldp/10 blur-[120px]" />
      </div>

      {/* ============ Header ============ */}
      <header className="sticky top-0 z-30 border-b border-white/8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-6 py-3.5 backdrop-blur-xl">
          <Logo />
          <div className="flex items-center gap-2">
            <LanguageSwitcher className="hidden sm:flex" />
            <Link href="/login" className="hidden rounded-xl px-4 py-2 text-sm font-medium text-white/60 transition-colors hover:text-white sm:block">{t('lp.enter')}</Link>
            <Cta label={t('lp.ctaMain')} className="!px-5 !py-2.5 !text-sm" />
          </div>
        </div>
      </header>

      <main className="relative mx-auto w-full max-w-7xl flex-1 overflow-x-clip px-6">
        {/* ============ HERO ============ */}
        <section className="grid items-center gap-12 pt-16 pb-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pt-24">
          <div>
            <Reveal>
              <span className={kicker}><Sparkles className="h-3.5 w-3.5 text-goldp" /> {t('lp.badge')}</span>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="font-display text-5xl font-extrabold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
                {t('lp.h1a')}<br />
                <span className="bg-gradient-to-r from-goldp to-[#f0d98a] bg-clip-text text-transparent">{t('lp.h1b')}</span><br />
                {t('lp.h1c')}
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/65">{t('lp.sub1')}</p>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/65">{t('lp.sub1b')}</p>
              <p className="mt-4 max-w-xl text-lg text-white/80">
                <span className="font-semibold text-white">{t('lp.sub2')}</span>{' '}
                <span className="font-semibold text-goldp">{t('lp.sub3')}</span>
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <Cta label={t('lp.ctaMain')} className="w-full sm:w-auto" />
                <span className="flex items-center gap-2 text-sm text-white/50">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" /> {t('lp.guarantee')}
                </span>
              </div>
            </Reveal>
          </div>

          <div className="relative lg:pl-4">
            <HeroShowcase />
          </div>
        </section>

        {/* ============ VÍDEO DEMONSTRATIVO ============ */}
        <section className="py-20 text-center">
          <Reveal className="mx-auto max-w-2xl">
            <h2 className={sectionTitle}>
              {t('lp.videoTitleA')}<br />
              {t('lp.videoTitleB')}
            </h2>
            <p className="mt-4 text-lg text-white/55">{t('lp.videoSub')}</p>
          </Reveal>
          <Reveal delay={0.1} className="mx-auto mt-10 w-full max-w-4xl">
            <div className="group relative aspect-video w-full overflow-hidden rounded-3xl border border-royal/20 bg-black/40 shadow-[0_0_40px_-12px_rgba(36,107,255,0.3)]">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/15 bg-white/10 backdrop-blur transition-transform group-hover:scale-105">
                  <svg viewBox="0 0 24 24" className="h-6 w-6 translate-x-[2px] fill-white/90">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
                <span className="text-sm font-medium text-white/55">{t('lp.videoComingSoon')}</span>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ============ STATS ============ */}
        <section className="border-y border-white/8 py-14">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.08} className="text-center">
                <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} className="font-display text-5xl font-extrabold tracking-tight text-white sm:text-6xl" />
                <p className="mt-2 text-sm font-medium text-white/50">{s.label}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ============ COMO FUNCIONA (5 passos) ============ */}
        <section className="py-28">
          <Reveal className="mx-auto max-w-3xl text-center">
            <span className={kicker}>{t('lp.howKicker')}</span>
            <h2 className={sectionTitle}>{t('lp.howTitle')}</h2>
            <p className="mt-4 text-lg text-white/55">{t('lp.howSub')}</p>
          </Reveal>
          <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((s, i) => (
              <Reveal key={s.a} delay={i * 0.06}>
                <div className="h-full rounded-2xl border border-white/8 bg-white/[0.03] p-6">
                  <span className="font-display text-sm font-extrabold text-royal">{String(i + 1).padStart(2, '0')} —</span>
                  <h3 className="mt-2 font-display text-lg font-bold uppercase tracking-wide text-white">{s.a}</h3>
                  {s.b && <p className="mt-1.5 text-sm leading-relaxed text-white/55">{s.b}</p>}
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ============ DOR ============ */}
        <section className="py-28">
          <Reveal className="mx-auto max-w-3xl text-center">
            <h2 className={sectionTitle}>
              {t('lp.painTitleA')}<br />
              {t('lp.painTitleB')}
            </h2>
            <p className="mt-4 text-xl text-white/55">{t('lp.painSub')}</p>
          </Reveal>

          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-3xl border border-white/8 bg-white/[0.02] p-8">
                <p className="mb-6 text-sm font-bold uppercase tracking-wider text-white/40">{t('lp.oldWay')}</p>
                <ul className="space-y-3.5">
                  {pipe(t('lp.oldList')).map((item) => (
                    <li key={item} className="flex items-start gap-3 text-white/55">
                      <X className="mt-0.5 h-5 w-5 shrink-0 text-red-400/70" /> <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="relative h-full overflow-hidden rounded-3xl border border-royal/30 bg-gradient-to-b from-royal/[0.12] to-transparent p-8">
                <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-royal/20 blur-3xl" />
                <p className="mb-6 text-sm font-bold uppercase tracking-wider text-goldp">{t('lp.newWay')}</p>
                <ul className="space-y-3.5">
                  {pipe(t('lp.newList')).map((item) => (
                    <li key={item} className="flex items-start gap-3 font-medium text-white/90">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" /> <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ============ BIBLIOTECA VIVA ============ */}
        <section className="grid items-center gap-12 py-24 lg:grid-cols-2">
          <Reveal>
            <span className={kicker}><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> {t('lp.libKicker')}</span>
            <h2 className={sectionTitle}>{t('lp.libTitle')}</h2>
            <p className="mt-5 max-w-lg text-lg text-white/60">{t('lp.libSub')}</p>
            <div className="mt-8 flex items-center gap-6">
              <div><Counter value={6} suffix="+" className="font-display text-3xl font-extrabold text-white" /><p className="text-xs text-white/45">{t('lp.stat.kits')}</p></div>
              <div className="h-8 w-px bg-white/10" />
              <div><Counter value={15} suffix="+" className="font-display text-3xl font-extrabold text-white" /><p className="text-xs text-white/45">{t('lp.stat.niches')}</p></div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <LiveLibrary items={libItems} />
          </Reveal>
        </section>

        {/* ============ O QUE VEM DENTRO ============ */}
        <section className="py-28">
          <Reveal className="mx-auto max-w-3xl text-center">
            <span className={kicker}>{t('lp.insideKicker')}</span>
            <h2 className={sectionTitle}>
              {t('lp.insideTitleA')}<br />
              {t('lp.insideTitleB')}
            </h2>
            <p className="mt-4 text-lg text-white/55">{t('lp.insideSub')}</p>
          </Reveal>
          <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {inside.map((item, i) => {
              const Ico = INSIDE_ICONS[i] ?? Sparkles;
              return (
                <Reveal key={item.a} delay={(i % 3) * 0.06}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="group h-full rounded-2xl border border-white/8 bg-white/[0.03] p-6 backdrop-blur-md transition-colors hover:border-royal/40 hover:bg-white/[0.05]"
                  >
                    <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-royal/25 bg-royal/10 text-royal transition-all group-hover:shadow-[0_0_24px_rgba(36,107,255,0.45)]">
                      <Ico className="h-5 w-5" />
                    </span>
                    <h3 className="font-display text-lg font-bold text-white">{item.a}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/50">{item.b}</p>
                  </motion.div>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* ============ CONHEÇA TUDO QUE EXISTE NA PLATAFORMA ============ */}
        <section className="py-16">
          <Reveal className="mx-auto max-w-3xl text-center">
            <span className={kicker}>{t('offer.platformTypesKicker')}</span>
            <h2 className={sectionTitle}>{t('offer.platformTypesTitle')}</h2>
            <p className="mt-4 text-lg text-white/55">{t('offer.platformTypesSub')}</p>
          </Reveal>
          <InViewMount className="mt-14 min-h-[420px] sm:min-h-[480px] lg:min-h-[520px]">
            <PlatformTypesShowcase cards={platformTypeCards} />
          </InViewMount>
        </section>

        {/* ============ NICHOS ============ */}
        <section className="py-24">
          <Reveal className="mx-auto max-w-3xl text-center">
            <h2 className={sectionTitle}>{t('lp.nichesTitle')}</h2>
            <p className="mt-4 text-lg text-white/55">{t('lp.nichesSub')}</p>
          </Reveal>
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {niches.map((n, i) => (
              <Reveal key={n} delay={(i % 4) * 0.05}>
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="group relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03] p-6 text-center transition-colors hover:border-goldp/40"
                >
                  <div className="pointer-events-none absolute inset-0 -z-0 bg-gradient-to-b from-goldp/0 to-goldp/0 transition-all group-hover:from-goldp/[0.08]" />
                  <span className="relative font-display text-lg font-bold text-white/85 group-hover:text-white">{n}</span>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ============ DEPOIMENTOS (carrossel de celulares) ============ */}
        <section className="py-24">
          <Reveal className="mx-auto max-w-3xl text-center">
            <span className={kicker}>{t('lp.testimonialsKicker')}</span>
            <h2 className={sectionTitle}>{t('lp.testimonialsTitle')}</h2>
          </Reveal>
          <InViewMount className="mt-14 min-h-[440px] sm:min-h-[500px]">
            <PhoneMockupBasic images={testimonialImages} />
          </InViewMount>
        </section>

        {/* ============ VALOR PERCEBIDO ============ */}
        <section className="py-24">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className={sectionTitle}>{t('lp.valueTitle')}</h2>
            <p className="mt-4 text-lg text-white/55">{t('lp.valueSub')}</p>
          </Reveal>
          <Reveal delay={0.1} className="mx-auto mt-12 max-w-2xl">
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-md">
              <ul>
                {valueRows.map((r) => (
                  <li key={r.label} className="flex items-center justify-between gap-4 border-b border-white/6 px-6 py-4 last:border-0">
                    <span className="flex items-center gap-3 text-white/80">
                      <Check className="h-4 w-4 shrink-0 text-goldp" /> {r.label}
                    </span>
                    <span className="font-medium text-white/45">{brl(r.price)}</span>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between gap-4 bg-white/[0.04] px-6 py-5">
                <span className="font-display text-lg font-bold text-white">{t('lp.valueTotalLabel')}</span>
                <span className="font-display text-2xl font-extrabold text-white/40 line-through">{brl(valueTotal)}</span>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ============ OFERTA ============ */}
        <section id="oferta" className="py-24">
          <Reveal className="mx-auto max-w-2xl">
            <div className="relative overflow-hidden rounded-[32px] border border-goldp/25 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-8 text-center shadow-[0_40px_120px_-40px_rgba(217,180,74,0.35)] sm:p-12">
              <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-goldp/15 blur-3xl" />
              <div className="relative">
                <span className="inline-flex items-center gap-2 rounded-full border border-goldp/40 bg-goldp/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-goldp">
                  <Sparkles className="h-3.5 w-3.5" /> {t('lp.offerBadge')}
                </span>

                <div className="mt-8 flex items-end justify-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-white/40">{t('lp.offerOldLabel')}</p>
                    <p className="font-display text-2xl font-bold text-white/40 line-through">{brl(valueTotal)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-goldp">{t('lp.offerNowLabel')}</p>
                    <p className="font-display text-6xl font-extrabold tracking-tight text-white sm:text-7xl">{t('lp.offerNow')}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm font-medium text-white/60">{t('lp.offerOneTime')}</p>

                <Cta label={t('lp.offerCta')} className="mt-9 w-full" />

                <p className="mt-4 flex items-center justify-center gap-2 text-sm text-white/70">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" /> {t('lp.guarantee')}
                </p>

                <p className="mx-auto mt-6 max-w-md text-xs leading-relaxed text-white/40">{t('lp.offerText')}</p>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ============ FAQ ============ */}
        <section className="py-24">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className={sectionTitle}>{t('lp.faqTitle')}</h2>
          </Reveal>
          <div className="mx-auto mt-12 max-w-3xl space-y-3">
            {faq.map((f, i) => (
              <Reveal key={f.a} delay={i * 0.04}>
                <details className="group rounded-2xl border border-white/8 bg-white/[0.03] p-5 backdrop-blur-md transition-colors open:border-royal/30">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold text-white">
                    {f.a}
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/60 transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 leading-relaxed text-white/55">{f.b}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ============ CTA FINAL ============ */}
        <section className="pb-32 pt-10">
          <Reveal>
            <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-br from-royal/25 via-ink to-ink p-10 text-center sm:p-20">
              <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-royal/25 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-goldp/15 blur-3xl" />
              <div className="relative">
                <h2 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl">
                  {t('lp.finalTitle1')}<br />
                  <span className="bg-gradient-to-r from-goldp to-[#f0d98a] bg-clip-text text-transparent">{t('lp.finalTitle2')}</span>
                </h2>
                <p className="mx-auto mt-6 max-w-xl text-lg text-white/60">{t('lp.finalSub')}</p>
                <Cta label={t('lp.finalCta')} className="mt-10" />
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      {/* ============ Footer ============ */}
      <footer className="border-t border-white/8 px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <Logo />
          <p className="text-sm text-white/40">{t('home.footer')}</p>
        </div>
      </footer>
    </div>
  );
}
