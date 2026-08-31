'use client';
// src/components/organisms/WelcomeStart.tsx — "Comece por aqui": vídeo oficial de
// demonstração com capa premium da ForgeHub (nada de iframe/thumbnail cru do
// YouTube antes do play) e card do Assistente Inteligente ForgeHub + suporte.
// Integra-se ao Dashboard sem alterar nenhuma funcionalidade existente.
import React from 'react';
import { Icon } from '../atoms/Icon';
import { Typography } from '../atoms/Typography';
import { LogoSymbol } from '../atoms/Logo';
import { LiteYouTube } from '../ui/lite-youtube';
import { useLanguage } from '../../lib/i18n/LanguageProvider';

// Vídeo oficial de demonstração — https://youtu.be/WZ4UO3_oNoo
const DEMO_VIDEO_ID = 'WZ4UO3_oNoo';

// Assistente Inteligente ForgeHub — GPT personalizado oficial (abre em nova aba).
const ASSISTANT_URL = 'https://chatgpt.com/g/g-697b42b917f081919ca62be54c59e0a2-especialista-oficial-da-forgehub-ai';

// Capa premium exibida antes do play — identidade ForgeHub (navy/preto),
// composição com um print real do Dashboard, overlay/gradiente, logo, título,
// subtítulo, botão de play grande e centralizado. Totalmente responsiva.
const VideoCover: React.FC<{ title: string; subtitle: string; hint: string }> = ({ title, subtitle, hint }) => (
  <>
    {/* Composição de fundo: captura real da plataforma (crisp, object-cover) */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src="/images/showcase/studio.webp"
      alt=""
      aria-hidden="true"
      loading="lazy"
      className="absolute inset-0 h-full w-full scale-[1.03] object-cover object-top"
    />
    {/* Overlay escuro + gradiente da marca para leitura */}
    <span className="absolute inset-0 bg-gradient-to-b from-ink/75 via-canvas/85 to-ink/95" />
    <span className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(7,11,20,0.6)_100%)]" />
    {/* Glows ambientes da identidade */}
    <span className="pointer-events-none absolute -left-16 -top-20 h-56 w-56 rounded-full bg-primary/25 blur-3xl" />
    <span className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-cyan/15 blur-3xl" />

    {/* Conteúdo da capa */}
    <span className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
      <span className="mb-3 flex items-center gap-2 sm:mb-4">
        <LogoSymbol size={26} />
        <span className="font-display text-sm font-extrabold leading-none tracking-tight sm:text-base">
          <span className="text-content">Forge</span>
          <span className="text-primary">Hub</span>
          <span className="ml-0.5 align-top text-[9px] text-gold sm:text-[10px]">AI</span>
        </span>
      </span>

      <span className="font-display text-xl font-extrabold leading-tight tracking-tight text-white sm:text-2xl lg:text-3xl">
        {title}
      </span>
      <span className="mt-1.5 text-xs text-white/70 sm:text-sm lg:text-base">{subtitle}</span>

      <span className="mt-5 flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/10 shadow-[0_8px_32px_-4px_rgba(0,0,0,0.5)] backdrop-blur transition-all duration-300 group-hover:scale-110 group-hover:border-primary/60 group-hover:bg-white/15 group-hover:shadow-[0_0_40px_rgba(20,114,255,0.55)] sm:mt-6 sm:h-16 sm:w-16 lg:h-20 lg:w-20">
        <svg viewBox="0 0 24 24" className="h-6 w-6 translate-x-[2px] fill-white sm:h-7 sm:w-7 lg:h-8 lg:w-8">
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>

      <span className="mt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55 sm:mt-4 sm:text-xs">
        {hint}
      </span>
    </span>
  </>
);

export const WelcomeStart: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="mb-8" aria-labelledby="welcome-start-title">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-interactive bg-primary/12 text-primary-hover">
          <Icon name="rocket" size={18} />
        </span>
        <div>
          <Typography variant="h4" id="welcome-start-title">{t('welcome.title')}</Typography>
          <Typography variant="small" className="mt-0.5 block max-w-2xl">{t('welcome.subtitle')}</Typography>
        </div>
      </div>

      {/* Vídeo oficial de demonstração — 16:9, capa premium, sem autoplay na carga */}
      <div className="card-premium ring-hairline overflow-hidden rounded-container p-2 sm:p-3">
        <div className="relative aspect-video w-full overflow-hidden rounded-interactive bg-deep">
          <LiteYouTube
            videoId={DEMO_VIDEO_ID}
            title={t('welcome.videoTitle')}
            cover={<VideoCover title={t('welcome.coverTitle')} subtitle={t('welcome.coverSubtitle')} hint={t('welcome.coverHint')} />}
          />
        </div>
      </div>

      {/* Assistente Inteligente ForgeHub (card premium) + suporte */}
      <div className="card-premium ring-hairline relative mt-4 overflow-hidden rounded-container p-6">
        <span className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gold/20 blur-3xl" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 flex items-center gap-2">
              <span className="bg-gold-glow flex h-9 w-9 items-center justify-center rounded-interactive text-deep">
                <Icon name="sparkles" size={18} />
              </span>
              <h3 className="font-display text-lg font-bold text-content">{t('welcome.assistantTitle')}</h3>
            </div>
            <p className="mb-4 text-sm text-muted">{t('welcome.assistantDesc')}</p>

            <div className="rounded-interactive border border-border bg-surface/60 p-3.5">
              <p className="text-sm font-semibold text-content">{t('welcome.supportTitle')}</p>
              <p className="mt-1 text-sm text-muted">{t('welcome.supportDesc')}</p>
            </div>
          </div>

          <a
            href={ASSISTANT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gold-glow inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-interactive px-6 text-sm font-bold text-deep shadow-[var(--shadow-glow-gold)] transition-transform hover:-translate-y-0.5"
          >
            <Icon name="sparkles" size={16} /> {t('welcome.assistantCta')}
            <Icon name="external" size={14} />
          </a>
        </div>
      </div>
    </section>
  );
};
