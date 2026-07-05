'use client';
// src/components/organisms/Splash.tsx
// Splash Screen: logo ForgeHub + barra de carregamento suave. Sem tela branca.
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LogoSymbol } from '../atoms/Logo';

/** Tela de abertura mostrada enquanto a autenticação é verificada (mín. ~1.2s). */
export const SplashGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { loading } = useAuth();
  const [minElapsed, setMinElapsed] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setMinElapsed(true), 1200);
    return () => window.clearTimeout(id);
  }, []);

  if (loading || !minElapsed) return <Splash />;
  return <>{children}</>;
};

export const Splash: React.FC = () => (
  <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-deep">
    <div className="flex flex-col items-center gap-6">
      <div style={{ animation: 'fh-pulse-glow 1.6s ease-in-out infinite' }}>
        <div className="flex h-20 w-20 items-center justify-center rounded-container" style={{ boxShadow: 'var(--shadow-glow-blue)' }}>
          <LogoSymbol size={56} />
        </div>
      </div>
      <span className="font-display text-lg font-bold tracking-tight text-content">ForgeHub AI</span>
      {/* Barra de carregamento suave (indeterminada) */}
      <div className="h-1 w-40 overflow-hidden rounded-full bg-surface-2">
        <div className="h-full w-1/2 rounded-full bg-brand-glow" style={{ animation: 'fh-loadbar 1.1s ease-in-out infinite' }} />
      </div>
    </div>
  </div>
);
