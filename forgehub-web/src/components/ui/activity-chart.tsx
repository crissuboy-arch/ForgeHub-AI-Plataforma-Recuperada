'use client';
// components/ui/activity-chart.tsx
// Réplica visual do gráfico "Atividade dos últimos 30 dias" do dashboard real.
// AreaChart com 3 séries (Aberturas, Atualizações, Criações), fundo transparente,
// grid sutil, sem eixo Y poluído. Dados mockados no MESMO formato do dashboard
// (linha quase reta com picos ocasionais e um spike no fim), só como prova visual.
import { AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const COLOR = { aberturas: '#1472ff', atualizacoes: '#c8a459', criacoes: '#00c2ff' };

const data = [
  { d: '04/06', aberturas: 4, atualizacoes: 2, criacoes: 1 },
  { d: '06/06', aberturas: 6, atualizacoes: 3, criacoes: 2 },
  { d: '08/06', aberturas: 5, atualizacoes: 2, criacoes: 1 },
  { d: '09/06', aberturas: 22, atualizacoes: 8, criacoes: 4 },
  { d: '11/06', aberturas: 8, atualizacoes: 3, criacoes: 2 },
  { d: '13/06', aberturas: 6, atualizacoes: 4, criacoes: 2 },
  { d: '15/06', aberturas: 9, atualizacoes: 5, criacoes: 3 },
  { d: '17/06', aberturas: 7, atualizacoes: 3, criacoes: 2 },
  { d: '19/06', aberturas: 26, atualizacoes: 10, criacoes: 5 },
  { d: '21/06', aberturas: 10, atualizacoes: 5, criacoes: 3 },
  { d: '23/06', aberturas: 12, atualizacoes: 6, criacoes: 3 },
  { d: '25/06', aberturas: 18, atualizacoes: 8, criacoes: 5 },
  { d: '27/06', aberturas: 24, atualizacoes: 11, criacoes: 6 },
  { d: '29/06', aberturas: 68, atualizacoes: 40, criacoes: 22 },
  { d: '30/06', aberturas: 52, atualizacoes: 30, criacoes: 16 },
];

const legend: { key: keyof typeof COLOR; label: string }[] = [
  { key: 'aberturas', label: 'Aberturas' },
  { key: 'atualizacoes', label: 'Atualizações' },
  { key: 'criacoes', label: 'Criações' },
];

export const ActivityChart = ({
  title = 'Atividade dos últimos 30 dias',
  labels,
}: {
  title?: string;
  labels?: { aberturas: string; atualizacoes: string; criacoes: string };
}) => {
  const legendItems = labels
    ? [
        { key: 'aberturas' as const, label: labels.aberturas },
        { key: 'atualizacoes' as const, label: labels.atualizacoes },
        { key: 'criacoes' as const, label: labels.criacoes },
      ]
    : legend;

  return (
    <div className="card-premium ring-hairline h-full rounded-container border border-border p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-display text-base font-bold text-content">{title}</h3>
        <div className="flex flex-wrap items-center gap-3">
          {legendItems.map((l) => (
            <span key={l.key} className="flex items-center gap-1.5 text-xs text-muted">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLOR[l.key] }} />
              {l.label}
            </span>
          ))}
        </div>
      </div>

      <div className="h-56 w-full sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 6, left: 6, bottom: 0 }}>
            <defs>
              {legend.map((l) => (
                <linearGradient key={l.key} id={`grad-${l.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLOR[l.key]} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={COLOR[l.key]} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" />
            <XAxis
              dataKey="d"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
              interval="preserveStartEnd"
              minTickGap={24}
            />
            <Tooltip
              cursor={{ stroke: 'rgba(255,255,255,0.15)' }}
              contentStyle={{
                background: '#101c33',
                border: '1px solid #22304d',
                borderRadius: 12,
                color: '#f1f5f9',
                fontSize: 12,
              }}
            />
            <Area type="monotone" dataKey="criacoes" stroke={COLOR.criacoes} strokeWidth={2} fill="url(#grad-criacoes)" />
            <Area type="monotone" dataKey="atualizacoes" stroke={COLOR.atualizacoes} strokeWidth={2} fill="url(#grad-atualizacoes)" />
            <Area type="monotone" dataKey="aberturas" stroke={COLOR.aberturas} strokeWidth={2} fill="url(#grad-aberturas)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
