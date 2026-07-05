'use client';
// src/lib/theme/ThemeProvider.tsx — tema Dark/Light/System (itens 11/12).
// Persiste em localStorage + Supabase (user_settings.theme). Aplica data-theme no <html>.
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type ThemeMode = 'dark' | 'light' | 'system';
type Resolved = 'dark' | 'light';
type Ctx = { mode: ThemeMode; resolved: Resolved; setMode: (m: ThemeMode) => void };

const ThemeContext = createContext<Ctx | undefined>(undefined);
const STORAGE_KEY = 'fh-theme';
const VALID: ThemeMode[] = ['dark', 'light', 'system'];

function systemPrefersLight(): boolean {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: light)').matches;
}
function resolve(mode: ThemeMode): Resolved {
  if (mode === 'system') return systemPrefersLight() ? 'light' : 'dark';
  return mode;
}
function apply(resolved: Resolved) {
  if (typeof document !== 'undefined') document.documentElement.dataset.theme = resolved;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('dark');

  // Hidrata a preferência salva (o script anti-FOUC já aplicou o data-theme).
  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    if (saved && VALID.includes(saved)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setModeState(saved);
    }
  }, []);

  // Reage a mudanças do SO quando o modo é "system".
  useEffect(() => {
    apply(resolve(mode));
    if (mode !== 'system' || typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const onChange = () => apply(resolve('system'));
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [mode]);

  const setMode = useCallback((m: ThemeMode) => {
    setModeState(m);
    apply(resolve(m));
    try {
      window.localStorage.setItem(STORAGE_KEY, m);
    } catch {
      /* ignore */
    }
    // persiste no Supabase (best-effort)
    import('../../data/userData').then((mod) => mod.saveSettings({ theme: m })).catch(() => {});
  }, []);

  const value = useMemo<Ctx>(() => ({ mode, resolved: resolve(mode), setMode }), [mode, setMode]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Ctx {
  const ctx = useContext(ThemeContext);
  if (!ctx) return { mode: 'dark', resolved: 'dark', setMode: () => {} };
  return ctx;
}
