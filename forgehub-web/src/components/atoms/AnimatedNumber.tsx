'use client';
// src/components/atoms/AnimatedNumber.tsx — contador animado (ease-out).
import React, { useEffect, useRef, useState } from 'react';

export const AnimatedNumber: React.FC<{ value: number; duration?: number }> = ({ value, duration = 900 }) => {
  const [display, setDisplay] = useState(0);
  const fromRef = useRef(0);

  useEffect(() => {
    const from = fromRef.current;
    const to = value;
    let raf = 0;
    let start = 0;
    const tick = (t: number) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const cur = Math.round(from + (to - from) * eased);
      setDisplay(cur);
      fromRef.current = cur;
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return <>{display.toLocaleString('pt-BR')}</>;
};
