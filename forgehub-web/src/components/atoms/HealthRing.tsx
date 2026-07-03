'use client';
// src/components/atoms/HealthRing.tsx — anel de Health Score circular, animado, com glow e cor dinâmica.
import React, { useEffect, useState } from 'react';

export const HealthRing: React.FC<{ score: number; size?: number; stroke?: number; showLabel?: boolean }> = ({
  score,
  size = 96,
  stroke = 8,
  showLabel = true,
}) => {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const [prog, setProg] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setProg(score), 80);
    return () => clearTimeout(t);
  }, [score]);

  const color = score >= 80 ? '#22C55E' : score >= 40 ? '#F59E0B' : '#EF4444';
  const dash = (prog / 100) * c;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-border)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          style={{
            transition: 'stroke-dasharray 900ms cubic-bezier(0.22, 1, 0.36, 1)',
            filter: `drop-shadow(0 0 5px ${color}99)`,
          }}
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-xl font-extrabold" style={{ color }}>{score}%</span>
          <span className="text-[10px] uppercase tracking-wide text-muted">saúde</span>
        </div>
      )}
    </div>
  );
};
