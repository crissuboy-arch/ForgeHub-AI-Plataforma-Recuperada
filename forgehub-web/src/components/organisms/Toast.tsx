'use client';
// src/components/organisms/Toast.tsx — feedback visual global (item 13 do aditivo).
// useToast().toast('Kit salvo.', 'success') exibe um toast animado, auto-dismiss.
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Icon } from '../atoms/Icon';

type ToastKind = 'success' | 'error' | 'info';
type ToastItem = { id: number; message: string; kind: ToastKind; leaving?: boolean };
type Ctx = { toast: (message: string, kind?: ToastKind) => void };

const ToastContext = createContext<Ctx | undefined>(undefined);

const ICON: Record<ToastKind, string> = { success: 'check', error: 'x', info: 'sparkles' };
const TONE: Record<ToastKind, string> = {
  success: 'border-success/40 text-success',
  error: 'border-danger/40 text-danger',
  info: 'border-primary/40 text-primary-hover',
};

let counter = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const remove = useCallback((id: number) => {
    setItems((list) => list.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
    window.setTimeout(() => setItems((list) => list.filter((t) => t.id !== id)), 220);
  }, []);

  const toast = useCallback(
    (message: string, kind: ToastKind = 'success') => {
      counter += 1;
      const id = counter;
      setItems((list) => [...list, { id, message, kind }]);
      window.setTimeout(() => remove(id), 2800);
    },
    [remove],
  );

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-[min(92vw,22rem)] flex-col gap-2">
        {items.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`pointer-events-auto flex items-center gap-3 rounded-container border bg-surface/95 px-4 py-3 shadow-modal backdrop-blur transition-all duration-200 ${TONE[t.kind]} ${
              t.leaving ? 'translate-x-2 opacity-0' : 'translate-x-0 opacity-100'
            }`}
            style={{ animation: t.leaving ? undefined : 'fh-toast-in 200ms ease-out' }}
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-current">
              <Icon name={ICON[t.kind]} size={13} />
            </span>
            <span className="flex-1 text-sm font-medium text-content">{t.message}</span>
            <button type="button" onClick={() => remove(t.id)} className="text-muted transition-colors hover:text-content" aria-label="fechar">
              <Icon name="x" size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): Ctx {
  const ctx = useContext(ToastContext);
  if (!ctx) return { toast: () => {} }; // fallback seguro fora do provider
  return ctx;
}
