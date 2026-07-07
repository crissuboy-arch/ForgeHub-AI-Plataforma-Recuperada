'use client';
// components/ui/metrics-columns.tsx
// Colunas com scroll infinito (estrutura/animação do testimonials-columns original),
// mas o conteúdo NÃO são depoimentos fake: são CARDS DE RESULTADO REAL da plataforma.
// Sem avatar de pessoa, sem name/role — só métrica + contexto e um ícone lucide.
import React from 'react';
import { motion } from 'motion/react';
import type { LucideIcon } from 'lucide-react';

export type MetricCard = {
  icon: LucideIcon;
  value: string;
  label: string;
};

export const MetricsColumn = (props: {
  className?: string;
  metrics: MetricCard[];
  duration?: number;
}) => (
  <div className={props.className}>
    <motion.div
      animate={{ translateY: '-50%' }}
      transition={{ duration: props.duration || 12, repeat: Infinity, ease: 'linear', repeatType: 'loop' }}
      className="flex flex-col gap-5 pb-5"
    >
      {[0, 1].map((dup) => (
        <React.Fragment key={dup}>
          {props.metrics.map(({ icon: Icon, value, label }, idx) => (
            <div
              key={`${dup}-${idx}`}
              className="card-premium ring-hairline w-full max-w-xs rounded-3xl border border-border p-6 shadow-soft"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gold/12 text-gold">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="font-display text-3xl font-extrabold tracking-tight text-content">{value}</span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted">{label}</p>
            </div>
          ))}
        </React.Fragment>
      ))}
    </motion.div>
  </div>
);
