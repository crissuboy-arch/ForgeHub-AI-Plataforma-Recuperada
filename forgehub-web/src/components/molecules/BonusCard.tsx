'use client';
// src/components/molecules/BonusCard.tsx — intro dos bônus + abre a Biblioteca de Bônus (modal).
import React, { useEffect, useState } from 'react';
import { Icon } from '../atoms/Icon';
import { Typography } from '../atoms/Typography';
import { useLanguage } from '../../lib/i18n/LanguageProvider';
import { BonusLibrary } from '../organisms/BonusLibrary';

export const BonusCard: React.FC<{ className?: string }> = ({ className }) => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const items = t('bonus.items').split('|');

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <div className={`card-premium ring-hairline relative overflow-hidden rounded-container p-6 ${className ?? ''}`}>
        <span className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gold/20 blur-3xl" />
        <div className="relative">
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-interactive bg-gold-glow text-deep">
              <Icon name="star" size={18} />
            </span>
            <h3 className="font-display text-lg font-bold text-content">{t('bonus.title')}</h3>
          </div>
          <p className="mb-4 max-w-2xl text-sm text-muted">{t('bonus.desc')}</p>
          <div className="mb-5 flex flex-wrap gap-1.5">
            {items.map((it) => (
              <span key={it} className="inline-flex items-center gap-1 rounded-full border border-border bg-surface/60 px-2.5 py-1 text-[11px] font-medium text-content">
                <Icon name="check" size={11} className="text-gold" /> {it}
              </span>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="bg-gold-glow inline-flex h-11 items-center justify-center gap-2 rounded-interactive px-6 text-sm font-bold text-deep shadow-[var(--shadow-glow-gold)] transition-transform hover:-translate-y-0.5"
          >
            <Icon name="stack" size={16} /> {t('bonus.open')}
          </button>
        </div>
      </div>

      {/* Modal: Biblioteca de Bônus */}
      {open && (
        <div className="fixed inset-0 z-[110] flex items-start justify-center overflow-y-auto p-4 sm:p-8" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-canvas/75 backdrop-blur-sm" onClick={() => setOpen(false)} aria-hidden="true" />
          <div className="glass animate-in relative z-10 w-full max-w-6xl rounded-container p-6 shadow-modal">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <Typography variant="h4">{t('bonus.libraryTitle')}</Typography>
                <Typography variant="small" className="mt-0.5 block">{t('bonus.librarySubtitle')}</Typography>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t('common.clear')}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-interactive border border-border text-muted transition-colors hover:bg-surface-2 hover:text-content"
              >
                <Icon name="x" size={18} />
              </button>
            </div>
            <BonusLibrary />
          </div>
        </div>
      )}
    </>
  );
};
