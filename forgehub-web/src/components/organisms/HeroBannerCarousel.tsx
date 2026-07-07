'use client';
// src/components/organisms/HeroBannerCarousel.tsx
// Cicla os nichos de config/niches.ts pelo HeroBanner (componente único).
// Autoplay 6s + pausa no hover. Nada aqui muda ao adicionar um nicho novo.
import React, { useEffect, useState } from 'react';
import { HeroBanner } from './HeroBanner';
import { niches as defaultNiches } from '../../config/niches';
import type { NicheConfig } from '../../config/niches';

const INTERVAL = 6000;

export const HeroBannerCarousel: React.FC<{ niches?: NicheConfig[] }> = ({ niches = defaultNiches }) => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = niches.length;

  useEffect(() => {
    if (paused || total <= 1) return;
    const id = window.setTimeout(() => setIndex((v) => (v + 1) % total), INTERVAL);
    return () => window.clearTimeout(id);
  }, [index, paused, total]);

  if (total === 0) return null;
  const current = niches[index % total];

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <HeroBanner niche={current} index={index} total={total} onDot={(i) => setIndex(i)} />
    </div>
  );
};
