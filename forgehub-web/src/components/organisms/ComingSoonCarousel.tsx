'use client';
// src/components/organisms/ComingSoonCarousel.tsx
// Vitrine "Em breve na ForgeHub AI" — cards horizontais deslizantes, autoplay lento,
// hover pausa, "Avise-me" (salva em localStorage), contador de lista de espera.
import React, { useEffect, useRef, useState } from 'react';
import { Icon } from '../atoms/Icon';
import { useLanguage } from '../../lib/i18n/LanguageProvider';
import { useToast } from './Toast';
import { comingSoonItems } from '../../data/comingSoon';

const STORAGE_KEY = 'fh-waitlist';

export const ComingSoonCarousel: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const ref = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [notified, setNotified] = useState<string[]>([]);

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNotified(JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]'));
    } catch {
      /* ignore */
    }
  }, []);

  // Autoplay lento: avança um card a cada 3.2s; pausa no hover; loop infinito.
  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      const el = ref.current;
      if (!el) return;
      const card = el.querySelector('[data-card]') as HTMLElement | null;
      const step = card ? card.offsetWidth + 12 : 240;
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 4) el.scrollTo({ left: 0, behavior: 'smooth' });
      else el.scrollBy({ left: step, behavior: 'smooth' });
    }, 3200);
    return () => window.clearInterval(id);
  }, [paused]);

  const notify = (id: string) => {
    setNotified((prev) => {
      const next = Array.from(new Set([...prev, id]));
      try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
    toast(t('comingSoon.notified'), 'success');
  };

  return (
    <section className="mb-8 overflow-hidden rounded-container border border-border bg-card p-5 ring-hairline">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-interactive bg-gold-glow text-deep">
          <Icon name="sparkles" size={15} />
        </span>
        <h3 className="text-gold-glow font-display text-sm font-extrabold uppercase tracking-[0.15em]">
          {t('comingSoon.title')}
        </h3>
      </div>

      <div
        ref={ref}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="flex snap-x gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {comingSoonItems.map((it) => {
          const done = notified.includes(it.id);
          return (
            <div
              key={it.id}
              data-card
              className="glass lift ring-hairline flex w-[220px] shrink-0 snap-start flex-col rounded-container p-4"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-2xl leading-none">{it.emoji}</span>
                <span className="rounded-full border border-gold/30 bg-gold/10 px-2 py-0.5 text-[10px] font-semibold text-gold-light">
                  {it.waitlist.toLocaleString('pt-BR')} {t('comingSoon.waitlist')}
                </span>
              </div>
              <span className="truncate text-sm font-bold text-content" title={t(it.key)}>{t(it.key)}</span>
              <span className="mb-3 text-xs text-muted">{t('incl.inDev')}</span>
              <button
                type="button"
                onClick={() => !done && notify(it.id)}
                disabled={done}
                className={`mt-auto inline-flex h-8 items-center justify-center gap-1.5 rounded-interactive text-xs font-semibold transition-all ${
                  done
                    ? 'cursor-default border border-success/30 bg-success/10 text-success'
                    : 'bg-brand-glow text-white hover:shadow-[var(--shadow-glow-blue)]'
                }`}
              >
                <Icon name={done ? 'check' : 'recent'} size={13} />
                {done ? t('comingSoon.notified') : t('comingSoon.notify')}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};
