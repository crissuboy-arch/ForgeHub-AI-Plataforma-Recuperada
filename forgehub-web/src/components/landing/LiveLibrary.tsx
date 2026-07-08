'use client';
// components/landing/LiveLibrary.tsx
// Carrossel automático em loop infinito (sensação de "plataforma viva").
// Duas colunas verticais deslizando em sentidos opostos. Sem imagem parada.
import { motion, useReducedMotion } from 'motion/react';

export type LibItem = { name: string; status: string; color: string };

const Card = ({ item }: { item: LibItem }) => (
  <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3.5 backdrop-blur-md">
    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: item.color, boxShadow: `0 0 10px ${item.color}` }} />
    <div className="min-w-0 flex-1">
      <p className="truncate text-sm font-semibold text-white">{item.name}</p>
      <p className="text-xs text-white/45">{item.status}</p>
    </div>
  </div>
);

const Column = ({ items, direction, duration }: { items: LibItem[]; direction: 'up' | 'down'; duration: number }) => {
  const reduce = useReducedMotion();
  const doubled = [...items, ...items];
  const from = direction === 'up' ? '0%' : '-50%';
  const to = direction === 'up' ? '-50%' : '0%';
  return (
    <div className="flex flex-col gap-3">
      <motion.div
        className="flex flex-col gap-3"
        animate={reduce ? undefined : { y: [from, to] }}
        transition={{ duration, repeat: Infinity, ease: 'linear' }}
      >
        {doubled.map((it, i) => (
          <Card key={`${it.name}-${i}`} item={it} />
        ))}
      </motion.div>
    </div>
  );
};

export const LiveLibrary = ({ items }: { items: LibItem[] }) => {
  const half = Math.ceil(items.length / 2);
  const colA = items.slice(0, half);
  const colB = items.slice(half);
  return (
    <div className="relative grid max-h-[460px] grid-cols-2 gap-3 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]">
      <Column items={colA} direction="up" duration={26} />
      <Column items={colB} direction="down" duration={30} />
    </div>
  );
};
