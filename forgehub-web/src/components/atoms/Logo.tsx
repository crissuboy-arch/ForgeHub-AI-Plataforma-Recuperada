// src/components/atoms/Logo.tsx
// Logo oficial ForgeHub AI — hexágono (blueprint/forge) com "F", gradiente azul→ciano + acento dourado.
import React from 'react';

export const LogoSymbol: React.FC<{ size?: number; className?: string }> = ({ size = 32, className }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="fh-hex" x1="4" y1="3" x2="44" y2="45" gradientUnits="userSpaceOnUse">
        <stop stopColor="#1472FF" />
        <stop offset="1" stopColor="#00C2FF" />
      </linearGradient>
    </defs>
    <path
      d="M24 3 42.2 13.5V34.5L24 45 5.8 34.5V13.5Z"
      fill="url(#fh-hex)"
      fillOpacity="0.12"
      stroke="url(#fh-hex)"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* F — barra superior dourada (forge/spark), demais em branco */}
    <path d="M18 15H31" stroke="#C8A459" strokeWidth="3.4" strokeLinecap="round" />
    <path d="M18 15V33" stroke="#F1F5F9" strokeWidth="3.4" strokeLinecap="round" />
    <path d="M18 23.5H28" stroke="#F1F5F9" strokeWidth="3.4" strokeLinecap="round" />
  </svg>
);

export const Logo: React.FC<{ showWord?: boolean; size?: number; className?: string }> = ({
  showWord = true,
  size = 32,
  className,
}) => (
  <span className={`flex items-center gap-2.5 ${className ?? ''}`}>
    <span
      className="flex items-center justify-center rounded-interactive"
      style={{ boxShadow: 'var(--shadow-glow-blue)' }}
    >
      <LogoSymbol size={size} />
    </span>
    {showWord && (
      <span className="font-display text-lg font-extrabold leading-none tracking-tight">
        <span className="text-content">Forge</span>
        <span className="text-primary">Hub</span>
        <span className="ml-0.5 align-top text-xs text-gold">AI</span>
      </span>
    )}
  </span>
);
