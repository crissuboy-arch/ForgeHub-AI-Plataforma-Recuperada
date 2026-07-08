'use client';
// components/landing/primitives.tsx
// Primitivas de animação da landing — ROBUSTAS: o conteúdo é renderizado VISÍVEL
// no HTML (SSR). A animação (fade/slide/contagem) é aplicada só via JS como
// enriquecimento. Se o JS falhar (ex.: extensão do navegador quebrando o script),
// o conteúdo continua visível — nunca fica preso em opacity:0.
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

// useLayoutEffect no cliente (aplica o estado inicial antes do paint, sem flash);
// no servidor cai para useEffect (no-op) evitando warning de SSR.
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** Fade + slide-up ao entrar na viewport. Visível por padrão se o JS não rodar. */
export const Reveal = ({
  children,
  delay = 0,
  y = 24,
  className,
  as: Tag = 'div',
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: 'div' | 'section' | 'li' | 'span';
}) => {
  const ref = useRef<HTMLElement | null>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced()) return;

    // Estado inicial (escondido) aplicado só quando o JS roda, antes do paint.
    el.style.opacity = '0';
    el.style.transform = `translateY(${y}px)`;
    el.style.willChange = 'opacity, transform';
    el.style.transition = `opacity 0.7s ${delay}s cubic-bezier(0.16,1,0.3,1), transform 0.7s ${delay}s cubic-bezier(0.16,1,0.3,1)`;

    const reveal = () => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    };

    let io: IntersectionObserver | undefined;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            reveal();
            io?.disconnect();
          }
        },
        { rootMargin: '0px 0px -80px 0px' },
      );
      io.observe(el);
    } else {
      reveal();
    }
    // Failsafe: revela em 2.5s mesmo que o observer não dispare.
    const t = window.setTimeout(reveal, 2500);
    return () => { io?.disconnect(); window.clearTimeout(t); };
  }, [delay, y]);

  return (
    <Tag ref={ref as React.Ref<never>} className={className}>
      {children}
    </Tag>
  );
};

/** Contador 0 → value ao entrar na tela. Mostra o valor final se o JS não rodar. */
export const Counter = ({
  value,
  prefix = '',
  suffix = '',
  duration = 1600,
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) => {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState(value); // SSR / sem-JS mostra o valor real

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced()) return;
    let raf = 0;
    let io: IntersectionObserver | undefined;
    const run = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        setDisplay(Math.round(value * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(
        (entries) => { if (entries.some((e) => e.isIntersecting)) { run(); io?.disconnect(); } },
        { rootMargin: '-40px' },
      );
      io.observe(el);
    } else {
      run();
    }
    return () => { io?.disconnect(); if (raf) cancelAnimationFrame(raf); };
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display.toLocaleString('pt-BR')}
      {suffix}
    </span>
  );
};
