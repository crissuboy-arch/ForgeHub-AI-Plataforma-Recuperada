'use client';
// src/components/organisms/WelcomeStart.tsx — "Comece por aqui": vídeo oficial de
// demonstração e card do Assistente Inteligente ForgeHub + orientação de suporte.
// Integra-se ao Dashboard sem alterar nenhuma funcionalidade existente.
import React from 'react';
import { Icon } from '../atoms/Icon';
import { Typography } from '../atoms/Typography';
import { LiteYouTube } from '../ui/lite-youtube';
import { useLanguage } from '../../lib/i18n/LanguageProvider';

// Vídeo oficial de demonstração — https://youtu.be/WZ4UO3_oNoo
const DEMO_VIDEO_ID = 'WZ4UO3_oNoo';

// Assistente Inteligente ForgeHub — GPT personalizado oficial (abre em nova aba).
const ASSISTANT_URL = 'https://chatgpt.com/g/g-697b42b917f081919ca62be54c59e0a2-especialista-oficial-da-forgehub-ai';

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

      {/* Vídeo oficial de demonstração — 16:9, sem autoplay, responsivo */}
      <div className="card-premium ring-hairline overflow-hidden rounded-container p-2 sm:p-3">
        <div className="relative aspect-video w-full overflow-hidden rounded-interactive bg-deep">
          <LiteYouTube videoId={DEMO_VIDEO_ID} title={t('welcome.videoTitle')} autoplay={false} />
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
