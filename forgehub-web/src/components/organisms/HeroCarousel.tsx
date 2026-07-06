'use client';
// src/components/organisms/HeroCarousel.tsx
// Hero Carousel premium da Home — data-driven (heroSlides), fade + slide, setas,
// indicadores, hover pausa, loop infinito. Responsivo (desktop/tablet/mobile).
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Icon } from '../atoms/Icon';
import { useLanguage } from '../../lib/i18n/LanguageProvider';
import { heroSlides, type HeroSlide } from '../../data/heroSlides';

const INTERVAL = 6000;

function hexA(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

export const HeroCarousel: React.FC<{ slides?: HeroSlide[] }> = ({ slides = heroSlides }) => {
  const { lang, t } = useLanguage();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const len = slides.length;

  const go = (i: number) => setIndex((i + len) % len);

  // Autoplay 6s (reinicia a cada troca; pausa no hover). Loop infinito.
  useEffect(() => {
    if (paused || len <= 1) return;
    const id = window.setTimeout(() => setIndex((v) => (v + 1) % len), INTERVAL);
    return () => window.clearTimeout(id);
  }, [index, paused, len]);

  return (
    <div
      className="relative mb-8 h-[540px] overflow-hidden rounded-container border border-border shadow-modal sm:h-[460px] lg:h-[420px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="region"
      aria-roledescription="carousel"
    >
      {slides.map((s, i) => {
        const active = i === index;
        return (
          <div
            key={s.id}
            aria-hidden={!active}
            className={`absolute inset-0 transition-all duration-700 ease-out ${active ? 'z-10 translate-x-0 opacity-100' : 'pointer-events-none translate-x-6 opacity-0'}`}
            style={{ background: s.gradient }}
          >
            {/* Brilhos premium */}
            <span className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl" style={{ background: hexA(s.accent, 0.35) }} />
            <span className="pointer-events-none absolute -bottom-28 left-1/3 h-72 w-72 rounded-full blur-3xl" style={{ background: hexA(s.accent, 0.18) }} />
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-deep/70 via-transparent to-transparent" />

            <div className="relative grid h-full grid-cols-1 items-center gap-6 p-6 sm:p-10 md:grid-cols-2 lg:p-12">
              {/* Texto */}
              <div className="max-w-xl">
                <span
                  className="mb-4 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur"
                  style={{ borderColor: hexA(s.accent, 0.5), color: '#fff', background: hexA(s.accent, 0.15) }}
                >
                  <Icon name={s.icon} size={13} /> {s.badge[lang]}
                </span>
                <h2 className="font-display text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.75rem]">
                  {s.title[lang]}
                </h2>
                <p className="mt-3 text-base font-medium text-white/90 sm:text-lg">{s.subtitle[lang]}</p>
                <p className="mt-2 max-w-lg text-sm text-white/70">{s.description[lang]}</p>

                {/* Chips das peças */}
                {s.mockups.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {s.mockups.map((m) => (
                      <span key={m} className="rounded-full border border-white/15 bg-white/10 px-2.5 py-0.5 text-[11px] font-medium text-white/85 backdrop-blur">
                        {m}
                      </span>
                    ))}
                  </div>
                )}

                {/* Botões */}
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={s.link}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-interactive bg-white px-6 text-sm font-semibold text-[#0B1E3C] shadow-lg transition-transform hover:-translate-y-0.5"
                  >
                    <Icon name="bolt" size={16} /> {t(s.buttonKey)}
                  </Link>
                  {s.buttonSecondaryKey && s.linkSecondary && (
                    <Link
                      href={s.linkSecondary}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-interactive border border-white/25 bg-white/5 px-6 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
                    >
                      {t(s.buttonSecondaryKey)} <Icon name="chevron" size={15} />
                    </Link>
                  )}
                </div>
              </div>

              {/* Visual cinematográfico (mockup) — oculto no mobile */}
              <div className="relative hidden h-full items-center justify-center md:flex">
                {s.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s.image} alt={s.title[lang]} className="max-h-[320px] w-auto max-w-full rounded-container object-contain shadow-modal" />
                ) : (
                  <div className="relative flex h-[300px] w-[300px] items-center justify-center">
                    <span className="absolute inset-0 rounded-[32px] blur-2xl" style={{ background: hexA(s.accent, 0.28) }} />
                    <div
                      className="glass relative flex h-56 w-56 flex-col items-center justify-center gap-3 rounded-[28px] border"
                      style={{ borderColor: hexA(s.accent, 0.35) }}
                    >
                      <span className="flex h-16 w-16 items-center justify-center rounded-2xl text-white" style={{ background: hexA(s.accent, 0.9), boxShadow: `0 0 30px ${hexA(s.accent, 0.6)}` }}>
                        <Icon name={s.icon} size={30} />
                      </span>
                      <span className="px-4 text-center text-sm font-bold text-white">{s.badge[lang]}</span>
                    </div>
                    {/* Mini-cards flutuantes */}
                    {s.mockups.slice(0, 3).map((m, k) => (
                      <span
                        key={m}
                        className="glass absolute rounded-xl border border-white/15 px-3 py-1.5 text-[11px] font-medium text-white shadow-soft"
                        style={{ top: `${12 + k * 92}px`, [k % 2 ? 'right' : 'left']: `-8px` } as React.CSSProperties}
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Setas */}
      <button
        type="button"
        onClick={() => go(index - 1)}
        aria-label="Anterior"
        className="glass absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-white transition-colors hover:bg-white/20"
      >
        <Icon name="chevron" size={18} className="rotate-180" />
      </button>
      <button
        type="button"
        onClick={() => go(index + 1)}
        aria-label="Próximo"
        className="glass absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-white transition-colors hover:bg-white/20"
      >
        <Icon name="chevron" size={18} />
      </button>

      {/* Indicadores */}
      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => go(i)}
            aria-label={`Slide ${i + 1}`}
            aria-current={i === index}
            className={`h-2 rounded-full transition-all ${i === index ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'}`}
          />
        ))}
      </div>
    </div>
  );
};
