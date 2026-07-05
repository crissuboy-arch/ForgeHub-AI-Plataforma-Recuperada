'use client';
// src/components/molecules/ThemeSwitcher.tsx — seletor Escuro / Claro / Sistema.
import React from 'react';
import { Icon } from '../atoms/Icon';
import { useTheme, type ThemeMode } from '../../lib/theme/ThemeProvider';
import { useLanguage } from '../../lib/i18n/LanguageProvider';
import { useToast } from '../organisms/Toast';

const OPTIONS: { mode: ThemeMode; icon: string; key: string }[] = [
  { mode: 'dark', icon: 'moon', key: 'theme.dark' },
  { mode: 'light', icon: 'sun', key: 'theme.light' },
  { mode: 'system', icon: 'system', key: 'theme.system' },
];

export const ThemeSwitcher: React.FC<{ compact?: boolean; className?: string }> = ({ compact, className }) => {
  const { mode, setMode } = useTheme();
  const { t } = useLanguage();
  const { toast } = useToast();

  const pick = (m: ThemeMode) => {
    if (m === mode) return;
    setMode(m);
    toast(t('toast.themeChanged'), 'success');
  };

  return (
    <div className={`inline-flex items-center gap-1 rounded-interactive border border-border bg-surface/60 p-0.5 ${className ?? ''}`}>
      {OPTIONS.map((o) => {
        const active = mode === o.mode;
        return (
          <button
            key={o.mode}
            type="button"
            onClick={() => pick(o.mode)}
            aria-pressed={active}
            title={t(o.key)}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors ${active ? 'bg-primary/20 text-primary-hover' : 'text-muted hover:text-content'}`}
          >
            <Icon name={o.icon} size={15} />
            {!compact && <span>{t(o.key)}</span>}
          </button>
        );
      })}
    </div>
  );
};
