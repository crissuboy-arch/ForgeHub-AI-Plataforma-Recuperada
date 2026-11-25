'use client';
// components/landing/HeroShowcase.tsx
// Mockup do Hero com screenshots REAIS da plataforma (mesma moldura premium
// "browser" do DashboardMockup — glow, flutuação, top bar com LIVE), em
// crossfade automático. Sem imagem fake: prints reais já usados em /oferta.
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';

// Só banners reais de kits ANUNCIADOS (Nutrição, Infantil cristão, Relacionamentos),
// recortados sem a barra de estatísticas do painel (que mostrava 0 kits / 0 downloads)
// e sem a faixa «Em breve». Não mostrar números inventados nem zerados aqui.
const SLIDES = [
  { src: '/images/hero-kits/nutricao.webp', alt: 'Kit ForgeHub Nutrição' },
  { src: '/images/hero-kits/infantil.webp', alt: 'Kit ForgeHub Infantil cristão' },
  { src: '/images/hero-kits/relacionamentos.webp', alt: 'Kit ForgeHub Relacionamentos' },
];

export const HeroShowcase = ({ caption }: { caption?: string }) => {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  // Só o 1º slide (LCP) carrega no boot; os demais entram no DOM quando o
  // carrossel chega neles — evita 7 downloads competindo com o LCP do hero.
  const [mounted, setMounted] = useState<Set<number>>(() => new Set([0]));

  useEffect(() => {
    let cur = 0;
    const id = setInterval(() => {
      cur = (cur + 1) % SLIDES.length;
      const next = cur;
      setActive(next);
      setMounted((m) => (m.has(next) ? m : new Set(m).add(next)));
    }, 4500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative w-full" style={{ perspective: 1200 }}>
      {/* Glow royal atrás */}
      <div className="pointer-events-none absolute -inset-8 -z-10 rounded-[36px] bg-royal/25 blur-3xl" />

      <motion.div
        animate={reduce ? undefined : { y: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="rounded-[22px] border border-white/10 bg-white/[0.04] p-2.5 shadow-[0_40px_100px_-30px_rgba(36,107,255,0.5)] backdrop-blur-xl"
      >
        <div className="overflow-hidden rounded-[16px] border border-white/8 bg-ink/80">
          {/* Top bar (moldura de navegador) */}
          <div className="flex items-center gap-3 border-b border-white/8 px-4 py-3">
            <span className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            </span>
            <div className="ml-2 h-6 flex-1 rounded-md border border-white/8 bg-white/[0.03]" />
            <span className="flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
              <motion.span
                className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                animate={reduce ? undefined : { opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.6, repeat: Infinity }}
              />
              LIVE
            </span>
          </div>

          {/* Screenshots reais — crossfade, proporção original preservada (sem corte) */}
          <div className="relative aspect-[3/2] w-full bg-ink">
            {SLIDES.map((slide, i) =>
              mounted.has(i) ? (
                <Image
                  key={slide.src}
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  priority={i === 0}
                  sizes="(max-width: 1024px) 90vw, 45vw"
                  className={`object-cover object-left transition-opacity duration-1000 ease-in-out ${i === active ? 'opacity-100' : 'opacity-0'}`}
                />
              ) : null,
            )}
          </div>
          {caption && (
            <p className="border-t border-white/8 px-4 py-3 text-center text-[11px] font-medium leading-relaxed text-white/70 sm:text-xs">{caption}</p>
          )}
        </div>
      </motion.div>
    </div>
  );
};
