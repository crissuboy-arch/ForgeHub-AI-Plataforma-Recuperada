// src/components/molecules/StatCard.tsx
// Card de métrica premium — glass, número animado (Montserrat), delta chip, ícone com glow.
import React from 'react';
import { Icon } from '../atoms/Icon';
import { AnimatedNumber } from '../atoms/AnimatedNumber';

type StatCardProps = {
  label: string;
  value: number;
  delta?: string;
  deltaTone?: 'success' | 'primary';
  iconName: string;
};

export const StatCard: React.FC<StatCardProps> = ({ label, value, delta, deltaTone = 'success', iconName }) => (
  <div className="card-premium lift glow-blue-hover ring-hairline group relative overflow-hidden rounded-container p-5 hover:border-primary/40">
    {/* acento de gradiente no topo */}
    <span className="absolute inset-x-0 top-0 h-px bg-brand-glow opacity-60" />
    <div className="flex items-start justify-between">
      <span className="text-xs font-medium uppercase tracking-wide text-muted">{label}</span>
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/12 text-primary transition-shadow group-hover:shadow-[var(--shadow-glow-blue)]">
        <Icon name={iconName} size={16} />
      </span>
    </div>
    <div className="mt-3 font-display text-3xl font-extrabold tracking-tight text-content">
      <AnimatedNumber value={value} />
    </div>
    {delta && (
      <span className={`mt-1 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium ${deltaTone === 'success' ? 'bg-success/12 text-success' : 'bg-primary/12 text-primary-hover'}`}>
        {delta}
      </span>
    )}
  </div>
);
