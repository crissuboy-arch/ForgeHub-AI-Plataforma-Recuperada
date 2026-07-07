'use client';
// src/components/molecules/BonusCard.tsx — bônus: acesso à biblioteca externa (SKU).
import React from 'react';
import { Icon } from '../atoms/Icon';
import { useLanguage } from '../../lib/i18n/LanguageProvider';
import { useSku } from '../../hooks/useSku';

export const BonusCard: React.FC<{ className?: string }> = ({ className }) => {
  const { t } = useLanguage();
  const { open } = useSku();
  const items = t('bonus.items').split('|');

  return (
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
          onClick={open}
          className="bg-gold-glow inline-flex h-11 items-center justify-center gap-2 rounded-interactive px-6 text-sm font-bold text-deep shadow-[var(--shadow-glow-gold)] transition-transform hover:-translate-y-0.5"
        >
          <Icon name="external" size={16} /> {t('bonus.open')}
        </button>
      </div>
    </div>
  );
};
