'use client';
// src/components/molecules/VideoBackground.tsx
// Fundo de vídeo em tela cheia com overlay premium. Se a URL estiver vazia ou for
// o placeholder, cai para o gradiente da marca (nunca quebra a tela).
import React from 'react';

export const VideoBackground: React.FC<{ videoUrl?: string; className?: string }> = ({ videoUrl, className }) => {
  const hasVideo = Boolean(videoUrl && !videoUrl.includes('SUBSTITUIR'));
  return (
    <div className={`fixed inset-0 -z-10 overflow-hidden ${className ?? ''}`} aria-hidden="true">
      {hasVideo ? (
        <video
          className="h-full w-full object-cover"
          src={videoUrl}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
      ) : (
        <div className="h-full w-full bg-brand-glow" />
      )}
      {/* Overlay para legibilidade do card */}
      <div className="absolute inset-0 bg-deep/80 backdrop-blur-[2px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/40 to-deep/70" />
    </div>
  );
};
