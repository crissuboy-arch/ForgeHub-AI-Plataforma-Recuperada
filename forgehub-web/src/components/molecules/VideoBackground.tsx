'use client';
// src/components/molecules/VideoBackground.tsx
// Fundo de vídeo em tela cheia com overlay premium. Se a URL estiver vazia ou for
// o placeholder, cai para o gradiente da marca (nunca quebra a tela).
import React from 'react';

export const VideoBackground: React.FC<{ videoUrl?: string; poster?: string; className?: string }> = ({
  videoUrl,
  poster,
  className,
}) => {
  // Preparado para vídeo, mas independente dele: sem URL válida, usa o gradiente premium.
  const hasVideo = Boolean(videoUrl && !videoUrl.includes('SUBSTITUIR'));
  return (
    <div className={`fixed inset-0 -z-10 overflow-hidden ${className ?? ''}`} aria-hidden="true">
      {hasVideo ? (
        <video
          className="h-full w-full object-cover"
          src={videoUrl}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
      ) : (
        <div className="relative h-full w-full bg-brand-glow">
          {/* Realces premium no fallback (glow ciano + profundidade) */}
          <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 28% 18%, rgba(0,194,255,0.38), transparent 55%)' }} />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 80% 90%, rgba(124,92,252,0.30), transparent 55%)' }} />
        </div>
      )}
      {/* Overlay para legibilidade do card (vale para vídeo e para o gradiente) */}
      <div className="absolute inset-0 bg-deep/80 backdrop-blur-[2px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/40 to-deep/70" />
    </div>
  );
};
