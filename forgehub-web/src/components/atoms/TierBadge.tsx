// src/components/atoms/TierBadge.tsx
// Badge de nível (tier) do Asset — Elite dourado, Pro azul, Enterprise ciano, Starter neutro.
import React from 'react';
import type { AssetLevel } from '../../types';

const LABEL: Record<AssetLevel, string> = {
  starter: 'Starter', pro: 'Pró', elite: 'Elite', enterprise: 'Empresa',
};

const STYLE: Record<AssetLevel, string> = {
  elite: 'bg-gold-glow text-[#0B1E3C] border border-transparent',
  pro: 'bg-primary/15 text-primary-hover border border-primary/40',
  enterprise: 'bg-cyan/10 text-cyan border border-cyan/50',
  starter: 'bg-surface-2 text-muted border border-border',
};

export const TierBadge: React.FC<{ level: AssetLevel; className?: string }> = ({ level, className }) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${STYLE[level]} ${className ?? ''}`}>
    {LABEL[level]}
  </span>
);
