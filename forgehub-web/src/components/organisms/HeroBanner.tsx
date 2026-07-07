'use client';
// src/components/organisms/HeroBanner.tsx
// COMPONENTE ÚNICO orientado a dados. Recebe `niche: NicheConfig` — nunca muda por
// nicho. Novo nicho = 1 entrada em config/niches.ts + rodar o script de imagem.
import React, { useState } from 'react';
import Link from 'next/link';
import { Icon } from '../atoms/Icon';
import { useLanguage } from '../../lib/i18n/LanguageProvider';
import type { NicheConfig } from '../../config/niches';

// Cores fixas de marca (nunca mudam)
const NAVY = '#0A0F1C';

// Ícones lucide-react → mapa para o Icon atom existente (evita nova dependência).
const ICON_MAP: Record<string, string> = {
  Heart: 'favorite', BookOpen: 'docs', Home: 'home', Building: 'cube', Stethoscope: 'chart',
  UtensilsCrossed: 'sparkles', Plane: 'rocket', Dog: 'favorite', Scale: 'clipboard',
  GraduationCap: 'docs', Sparkles: 'sparkles', Briefcase: 'cube', Baby: 'sparkles', Star: 'star',
  Apple: 'sparkles', TrendingUp: 'chart', Brain: 'user', Rocket: 'rocket', Megaphone: 'sparkles', Coffee: 'sparkles',
};
const mapIcon = (name: string) => ICON_MAP[name] ?? 'star';

function hexA(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

type Props = { niche: NicheConfig; index: number; total: number; onDot: (i: number) => void };

export const HeroBanner: React.FC<Props> = ({ niche, index, total, onDot }) => {
  const { t } = useLanguage();
  const [failed, setFailed] = useState<Record<string, boolean>>({});
  const showImg = !failed[niche.id];
  const link = `/assets?niche=${niche.slug ?? niche.id}`;

  const stats = [
    { label: 'Kits', value: niche.stats.kits },
    { label: t('stat.downloads'), value: niche.stats.downloads },
    { label: t('stat.remixes'), value: niche.stats.remixes },
    { label: t('stat.favorites'), value: niche.stats.favoritos },
    { label: t('dash.updates'), value: niche.stats.atualizacoes },
  ];

  return (
    <div className="mb-8 overflow-hidden rounded-container border border-border shadow-modal">
      {/* Banner com camadas */}
      <div className="relative h-[420px] w-full" style={{ background: `linear-gradient(135deg, ${NAVY} 0%, ${hexA(niche.accentColor, 0.35)} 100%)` }}>
        {/* 1. Imagem de fundo (cover). Fallback: o gradiente acima aparece se faltar. */}
        {showImg && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={niche.backgroundImage}
            alt={niche.kitLabel}
            onError={() => setFailed((f) => ({ ...f, [niche.id]: true }))}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        {/* 2. Overlay — escuro sob o texto (esquerda), revelando a foto à direita */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(10,15,28,0.90) 0%, rgba(10,15,28,0.48) 45%, rgba(10,15,28,0.05) 100%)' }} />
        {/* 3. Vinheta (suave) */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 65%, rgba(0,0,0,0.38) 100%)' }} />

        {/* Card flutuante (glass) canto superior direito */}
        <div
          className="absolute right-6 top-6 hidden items-center gap-3 rounded-2xl px-4 py-3 sm:flex"
          style={{ backdropFilter: 'blur(12px)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl text-white" style={{ background: hexA(niche.accentColor, 0.9), boxShadow: `0 0 24px ${hexA(niche.accentColor, 0.6)}` }}>
            <Icon name={mapIcon(niche.icon)} size={20} />
          </span>
          <span className="text-sm font-bold text-white">{niche.kitLabel}</span>
        </div>

        {/* Conteúdo */}
        <div className="relative flex h-full max-w-2xl flex-col justify-center p-6 sm:p-10 lg:p-12">
          <span
            className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-white"
            style={{ backdropFilter: 'blur(12px)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <Icon name={mapIcon(niche.icon)} size={13} /> {niche.kitLabel}
          </span>
          <h2 className="font-display text-4xl font-extrabold leading-tight tracking-tight lg:text-5xl">
            <span className="text-white">ForgeHub </span>
            <span style={{ backgroundImage: `linear-gradient(90deg, ${niche.accentColor}, #FAFAF8)`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
              {niche.kitLabel}
            </span>
          </h2>
          <p className="mt-3 text-base font-medium text-white/90 sm:text-lg">{niche.tagline}</p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {niche.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-white/15 bg-white/10 px-2.5 py-0.5 text-[11px] font-medium text-white/85 backdrop-blur">
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={link}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-interactive px-6 text-sm font-bold text-white shadow-lg transition-transform hover:-translate-y-0.5"
              style={{ background: niche.accentColor, boxShadow: `0 0 24px ${hexA(niche.accentColor, 0.5)}` }}
            >
              <Icon name="bolt" size={16} /> {t('hero.explore')}
            </Link>
            <Link
              href={link}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-interactive px-6 text-sm font-semibold text-white transition-colors hover:bg-white/15"
              style={{ backdropFilter: 'blur(12px)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              {t('hero.details')} <Icon name="chevron" size={15} />
            </Link>
          </div>
        </div>

        {/* Dots do carrossel na base */}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {Array.from({ length: total }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onDot(i)}
              aria-label={`Slide ${i + 1}`}
              aria-current={i === index}
              className={`h-2 rounded-full transition-all ${i === index ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'}`}
            />
          ))}
        </div>
      </div>

      {/* Stats bar (5 métricas do nicho) */}
      <div className="grid grid-cols-5 divide-x divide-border border-t border-border bg-card">
        {stats.map((st) => (
          <div key={st.label} className="px-2 py-3 text-center">
            <div className="font-display text-lg font-bold text-content sm:text-xl">{st.value.toLocaleString('pt-BR')}</div>
            <div className="truncate text-[10px] uppercase tracking-wide text-muted sm:text-xs">{st.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
