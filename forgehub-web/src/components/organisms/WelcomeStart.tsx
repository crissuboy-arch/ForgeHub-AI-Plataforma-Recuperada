'use client';
// src/components/organisms/WelcomeStart.tsx — "Comece por aqui": vídeo oficial de
// demonstração, credenciais de acesso à plataforma e card do Assistente
// Inteligente ForgeHub + orientação de suporte. Integra-se ao Dashboard sem
// alterar nenhuma funcionalidade existente.
import React, { useState } from 'react';
import { Icon } from '../atoms/Icon';
import { Typography } from '../atoms/Typography';
import { LiteYouTube } from '../ui/lite-youtube';
import { useLanguage } from '../../lib/i18n/LanguageProvider';
import { useToast } from './Toast';

// Vídeo oficial de demonstração — https://youtu.be/WZ4UO3_oNoo
const DEMO_VIDEO_ID = 'WZ4UO3_oNoo';

// Assistente Inteligente ForgeHub — GPT personalizado oficial (abre em nova aba).
const ASSISTANT_URL = 'https://chatgpt.com/g/g-697b42b917f081919ca62be54c59e0a2-especialista-oficial-da-forgehub-ai';

// Credenciais de acesso à plataforma (compartilhadas com o utilizador).
const ACCESS_EMAIL = 'cris.suboy@gmail.com';
const ACCESS_PASSWORD = '123456';

const CredentialRow: React.FC<{ label: string; value: string; onCopy: () => void; copyLabel: string }> = ({ label, value, onCopy, copyLabel }) => (
  <div className="flex items-center justify-between gap-3 rounded-interactive border border-border bg-surface/60 px-3.5 py-2.5">
    <span className="min-w-0">
      <span className="block text-[11px] font-medium uppercase tracking-wide text-muted">{label}</span>
      <span className="block truncate font-mono text-sm text-content">{value}</span>
    </span>
    <button
      type="button"
      onClick={onCopy}
      aria-label={copyLabel}
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-interactive border border-border text-muted transition-colors hover:bg-surface-2 hover:text-content"
    >
      <Icon name="clipboard" size={15} />
    </button>
  </div>
);

export const WelcomeStart: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [revealed, setRevealed] = useState(false);

  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast(t('welcome.copied'), 'success');
    } catch {
      toast(value, 'info');
    }
  };

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

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Acesso à plataforma */}
        <div className="card-premium ring-hairline rounded-container p-6">
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-interactive bg-primary/12 text-primary-hover">
              <Icon name="lock" size={17} />
            </span>
            <h3 className="font-display text-lg font-bold text-content">{t('welcome.accessTitle')}</h3>
          </div>
          <p className="mb-4 text-sm text-muted">{t('welcome.accessDesc')}</p>
          <div className="space-y-2.5">
            <CredentialRow label={t('auth.email')} value={ACCESS_EMAIL} onCopy={() => copy(ACCESS_EMAIL)} copyLabel={t('welcome.copy')} />
            <div className="flex items-center justify-between gap-3 rounded-interactive border border-border bg-surface/60 px-3.5 py-2.5">
              <span className="min-w-0">
                <span className="block text-[11px] font-medium uppercase tracking-wide text-muted">{t('auth.password')}</span>
                <span className="block truncate font-mono text-sm text-content">{revealed ? ACCESS_PASSWORD : '••••••'}</span>
              </span>
              <span className="flex shrink-0 items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setRevealed((v) => !v)}
                  aria-label={revealed ? t('welcome.hide') : t('welcome.show')}
                  className="flex h-8 w-8 items-center justify-center rounded-interactive border border-border text-muted transition-colors hover:bg-surface-2 hover:text-content"
                >
                  <Icon name={revealed ? 'eye-off' : 'eye'} size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => copy(ACCESS_PASSWORD)}
                  aria-label={t('welcome.copy')}
                  className="flex h-8 w-8 items-center justify-center rounded-interactive border border-border text-muted transition-colors hover:bg-surface-2 hover:text-content"
                >
                  <Icon name="clipboard" size={15} />
                </button>
              </span>
            </div>
          </div>
        </div>

        {/* Assistente Inteligente ForgeHub (card premium) */}
        <div className="card-premium ring-hairline relative overflow-hidden rounded-container p-6">
          <span className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gold/20 blur-3xl" />
          <div className="relative flex h-full flex-col">
            <div className="mb-3 flex items-center gap-2">
              <span className="bg-gold-glow flex h-9 w-9 items-center justify-center rounded-interactive text-deep">
                <Icon name="sparkles" size={18} />
              </span>
              <h3 className="font-display text-lg font-bold text-content">{t('welcome.assistantTitle')}</h3>
            </div>
            <p className="mb-4 text-sm text-muted">{t('welcome.assistantDesc')}</p>

            <div className="mb-4 rounded-interactive border border-border bg-surface/60 p-3.5">
              <p className="text-sm font-semibold text-content">{t('welcome.supportTitle')}</p>
              <p className="mt-1 text-sm text-muted">{t('welcome.supportDesc')}</p>
            </div>

            <a
              href={ASSISTANT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gold-glow mt-auto inline-flex h-11 items-center justify-center gap-2 rounded-interactive px-6 text-sm font-bold text-deep shadow-[var(--shadow-glow-gold)] transition-transform hover:-translate-y-0.5"
            >
              <Icon name="sparkles" size={16} /> {t('welcome.assistantCta')}
              <Icon name="external" size={14} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
