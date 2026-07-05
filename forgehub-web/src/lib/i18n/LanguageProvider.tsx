'use client';
// src/lib/i18n/LanguageProvider.tsx — contexto global de idioma (i18n leve, sem mudar rotas).
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { AppLanguage } from '../../types';
import { translate } from './dictionary';

type Ctx = { lang: AppLanguage; setLang: (l: AppLanguage) => void; t: (key: string) => string };
const LanguageContext = createContext<Ctx | undefined>(undefined);

const STORAGE_KEY = 'fh-lang';
const VALID: AppLanguage[] = ['pt-BR', 'es', 'en'];

function initialLang(): AppLanguage {
  if (typeof window === 'undefined') return 'pt-BR';
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved && VALID.includes(saved as AppLanguage)) return saved as AppLanguage;
  const nav = window.navigator.language;
  if (nav?.startsWith('es')) return 'es';
  if (nav?.startsWith('en')) return 'en';
  return 'pt-BR';
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<AppLanguage>('pt-BR');

  // hidrata do localStorage/navegador só no cliente (evita mismatch de hydration)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLangState(initialLang());
  }, []);

  const setLang = useCallback((l: AppLanguage) => {
    setLangState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
      document.documentElement.lang = l;
    } catch {
      /* ignore */
    }
    // persiste no Supabase se logado (best-effort, sem bloquear a UI)
    import('../../data/userData')
      .then((m) => m.saveSettings({ language: l }))
      .catch(() => {});
  }, []);

  const t = useCallback((key: string) => translate(lang, key), [lang]);
  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): Ctx {
  const ctx = useContext(LanguageContext);
  // Fallback seguro caso algum componente seja usado fora do provider (ex.: landing pública)
  if (!ctx) return { lang: 'pt-BR', setLang: () => {}, t: (k: string) => translate('pt-BR', k) };
  return ctx;
}
