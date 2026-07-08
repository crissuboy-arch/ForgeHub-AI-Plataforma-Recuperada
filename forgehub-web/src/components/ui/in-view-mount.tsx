'use client';
// components/ui/in-view-mount.tsx
// Monta os filhos apenas quando o bloco se aproxima da viewport (IntersectionObserver),
// adiando chunks pesados (carrossel/gráfico/animações) do bundle inicial.
// A altura é reservada por `className` (min-h responsivo) que fica SEMPRE aplicada —
// altura constante entre placeholder e conteúdo montado = zero layout shift (CLS).
import React, { useEffect, useRef, useState } from 'react';

export const InViewMount = ({
  children,
  className,
  rootMargin = '400px',
}: {
  children: React.ReactNode;
  className?: string;
  rootMargin?: string;
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [show, rootMargin]);

  return (
    <div ref={ref} className={className}>
      {show ? children : null}
    </div>
  );
};
