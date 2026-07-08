'use client';
// components/ui/launch-countdown.tsx
// Contador regressivo de 4h que REINICIA a cada carregamento da página (na montagem).
import { useEffect, useState } from 'react';

const TOTAL_SECONDS = 4 * 60 * 60; // 4 horas

const pad = (n: number) => n.toString().padStart(2, '0');

export const LaunchCountdown = ({
  labels = { hours: 'horas', minutes: 'min', seconds: 'seg' },
}: {
  labels?: { hours: string; minutes: string; seconds: string };
}) => {
  const [remaining, setRemaining] = useState(TOTAL_SECONDS);

  // O estado já inicia em TOTAL_SECONDS a cada montagem (cada carregamento da página),
  // então basta iniciar o intervalo de contagem regressiva aqui.
  useEffect(() => {
    const id = setInterval(() => {
      setRemaining((r) => (r <= 0 ? 0 : r - 1));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const h = Math.floor(remaining / 3600);
  const m = Math.floor((remaining % 3600) / 60);
  const s = remaining % 60;

  const parts: { value: string; label: string }[] = [
    { value: pad(h), label: labels.hours },
    { value: pad(m), label: labels.minutes },
    { value: pad(s), label: labels.seconds },
  ];

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3" role="timer" aria-live="off">
      {parts.map((p, i) => (
        <div key={p.label} className="flex items-center gap-2 sm:gap-3">
          <div className="flex min-w-[64px] flex-col items-center rounded-interactive border border-gold/30 bg-deep/60 px-3 py-2">
            <span className="font-display text-3xl font-extrabold tabular-nums tracking-tight text-gold-light">{p.value}</span>
            <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted">{p.label}</span>
          </div>
          {i < parts.length - 1 && <span className="font-display text-2xl font-bold text-gold/50">:</span>}
        </div>
      ))}
    </div>
  );
};
