// src/components/atoms/CategoryBadge.tsx
// Badge de categoria com cores fixas da identidade ForgeHub.
import React from 'react';

const COLORS: Record<string, string> = {
  microapp: '#1472FF',
  'ai agent': '#22C55E',
  agente: '#22C55E',
  agent: '#22C55E',
  template: '#A78BFA',
  landing: '#A78BFA',
  prompt: '#C8A459',
  automacao: '#00C2FF',
  automation: '#00C2FF',
  copy: '#1472FF',
  planilha: '#00C2FF',
  checkout: '#22C55E',
  criativos: '#A78BFA',
};

const norm = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

export const categoryColor = (category: string): string => COLORS[norm(category)] ?? '#1472FF';

const CAT_ICONS: Record<string, string> = {
  microapp: 'stack', 'ai agent': 'sparkles', agente: 'sparkles', agent: 'sparkles',
  template: 'stack', landing: 'stack', prompt: 'command', automacao: 'bolt', automation: 'bolt',
  copy: 'command', planilha: 'stack', checkout: 'bolt', criativos: 'asset',
};
export const categoryIcon = (category: string): string => CAT_ICONS[norm(category)] ?? 'asset';

const hexA = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

export const CategoryBadge: React.FC<{ category: string; className?: string }> = ({ category, className }) => {
  const color = COLORS[norm(category)] ?? '#1472FF';
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${className ?? ''}`}
      style={{ color, borderColor: hexA(color, 0.35), backgroundColor: hexA(color, 0.12) }}
    >
      {category}
    </span>
  );
};
