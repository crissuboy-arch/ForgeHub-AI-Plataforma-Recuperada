'use client';
// src/components/organisms/ActivityChart.tsx — gráfico de atividade (30 dias) com Recharts.
// Exportado como default para lazy-load via next/dynamic (mantém o bundle inicial leve).
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { ActivityPoint } from '../../data/dashboard';

type TP = { active?: boolean; payload?: { name?: string; value?: number; color?: string; dataKey?: string }[]; label?: string };
const LABELS: Record<string, string> = { aberturas: 'Aberturas', atualizacoes: 'Atualizações', criacoes: 'Criações' };

function GlassTooltip({ active, payload, label }: TP) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-interactive px-3 py-2 text-xs shadow-modal">
      <div className="mb-1 font-semibold text-content">{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2 text-muted">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
          {LABELS[p.dataKey ?? ''] ?? p.dataKey}: <span className="font-medium text-content">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function ActivityChart({ data }: { data: ActivityPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id="fh-ab" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1472FF" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#1472FF" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="fh-at" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00C2FF" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#00C2FF" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="fh-cr" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C8A459" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#C8A459" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" vertical={false} />
        <XAxis dataKey="label" tick={{ fill: '#64748B', fontSize: 11 }} tickLine={false} axisLine={false} interval={4} minTickGap={16} />
        <YAxis tick={{ fill: '#64748B', fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} width={28} />
        <Tooltip content={<GlassTooltip />} cursor={{ stroke: 'rgba(20,114,255,0.3)' }} />
        <Area type="monotone" dataKey="aberturas" stroke="#1472FF" strokeWidth={2.5} fill="url(#fh-ab)" />
        <Area type="monotone" dataKey="atualizacoes" stroke="#00C2FF" strokeWidth={2} fill="url(#fh-at)" />
        <Area type="monotone" dataKey="criacoes" stroke="#C8A459" strokeWidth={2} fill="url(#fh-cr)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
