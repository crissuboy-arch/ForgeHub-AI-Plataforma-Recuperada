'use client';
// src/components/atoms/LanguageSwitcher.tsx — seletor global de idioma (PT/ES/EN).
import React from 'react';
import { useLanguage } from '../../lib/i18n/LanguageProvider';
import { LANGUAGES } from '../../lib/i18n/dictionary';

export const LanguageSwitcher: React.FC<{ className?: string }> = ({ className }) => {
  const { lang, setLang } = useLanguage();
  return (
    <div className={`flex items-center rounded-interactive border border-border bg-surface/60 p-0.5 ${className ?? ''}`}>
      {LANGUAGES.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => setLang(l.code)}
          aria-pressed={lang === l.code}
          title={l.label}
          className={`rounded-md px-2 py-1 text-[11px] font-semibold transition-colors ${lang === l.code ? 'bg-primary/20 text-primary-hover' : 'text-muted hover:text-content'}`}
        >
          {l.short}
        </button>
      ))}
    </div>
  );
};
