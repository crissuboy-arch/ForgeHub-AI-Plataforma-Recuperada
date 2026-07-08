'use client';
// components/landing/DashboardMockup.tsx
// Mockup premium de um dashboard SaaS (não é imagem — é UI real em CSS/SVG),
// com leve flutuação, glow royal e um "live" pulsante. Puramente decorativo.
import { motion, useReducedMotion } from 'motion/react';
import { Counter } from './primitives';

const NAV = ['Dashboard', 'Kits', 'Studio', 'Nichos', 'Bônus'];
const KITS = [
  { name: 'Nutrição Premium', tag: 'Ativo', v: 'R$ 47,90' },
  { name: 'Relacionamentos', tag: 'Novo', v: 'R$ 47,90' },
  { name: 'Fitness Total', tag: 'Atualizado', v: 'R$ 47,90' },
];

// Sparkline suave (área) — pontos com um pico no final, como o dashboard real.
const PTS = [8, 10, 7, 14, 9, 12, 11, 18, 15, 24, 40];
const W = 260, H = 70;
const path = PTS.map((p, i) => {
  const x = (i / (PTS.length - 1)) * W;
  const y = H - (p / 40) * (H - 8) - 4;
  return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
}).join(' ');
const areaPath = `${path} L${W},${H} L0,${H} Z`;

export const DashboardMockup = () => {
  const reduce = useReducedMotion();
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
          {/* Top bar */}
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

          <div className="flex">
            {/* Sidebar */}
            <div className="hidden w-32 shrink-0 flex-col gap-1 border-r border-white/8 p-3 sm:flex">
              <div className="mb-2 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-royal text-[11px] font-bold text-white">F</span>
                <span className="text-[11px] font-semibold text-white/70">ForgeHub</span>
              </div>
              {NAV.map((n, i) => (
                <div
                  key={n}
                  className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-[11px] ${i === 0 ? 'bg-royal/15 text-white' : 'text-white/45'}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${i === 0 ? 'bg-goldp' : 'bg-white/25'}`} />
                  {n}
                </div>
              ))}
            </div>

            {/* Main */}
            <div className="min-w-0 flex-1 p-4">
              <div className="mb-3">
                <p className="text-[10px] text-white/40">Bem-vindo(a) de volta</p>
                <p className="font-display text-sm font-bold text-white">Sua biblioteca hoje</p>
              </div>

              {/* Stat tiles */}
              <div className="mb-3 grid grid-cols-3 gap-2">
                {[
                  { l: 'Downloads', v: 1995, s: '' },
                  { l: 'Remixes', v: 340, s: '' },
                  { l: 'Kits', v: 6, s: '+' },
                ].map((t) => (
                  <div key={t.l} className="rounded-lg border border-white/8 bg-white/[0.03] p-2.5">
                    <p className="text-[9px] uppercase tracking-wide text-white/40">{t.l}</p>
                    <Counter value={t.v} suffix={t.s} className="font-display text-base font-extrabold text-white" />
                  </div>
                ))}
              </div>

              {/* Chart */}
              <div className="mb-3 rounded-lg border border-white/8 bg-white/[0.03] p-3">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[10px] font-medium text-white/50">Atividade · 30 dias</span>
                  <span className="text-[10px] font-semibold text-goldp">+21,4%</span>
                </div>
                <svg viewBox={`0 0 ${W} ${H}`} className="h-16 w-full" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="mock-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#246bff" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#246bff" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d={areaPath} fill="url(#mock-grad)" />
                  <path d={path} fill="none" stroke="#246bff" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>

              {/* Kits list */}
              <div className="space-y-1.5">
                {KITS.map((k) => (
                  <div key={k.name} className="flex items-center gap-2 rounded-lg border border-white/8 bg-white/[0.03] px-2.5 py-2">
                    <span className="h-6 w-6 shrink-0 rounded-md bg-gradient-to-br from-royal to-royal/40" />
                    <span className="min-w-0 flex-1 truncate text-[11px] font-medium text-white/80">{k.name}</span>
                    <span className="rounded-full bg-white/8 px-1.5 py-0.5 text-[9px] text-white/50">{k.tag}</span>
                    <span className="text-[11px] font-semibold text-goldp">{k.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
