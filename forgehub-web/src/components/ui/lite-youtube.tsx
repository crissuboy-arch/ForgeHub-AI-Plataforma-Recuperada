'use client';
// components/ui/lite-youtube.tsx
// Fachada leve (lite embed) para vídeo do YouTube: no carregamento inicial
// mostra só a thumbnail publica do YouTube + botão de play custom da
// identidade ForgeHub — o iframe real (youtube-nocookie) só monta depois
// do clique. Sem lib externa, sem baixar/hospedar vídeo, sem layout shift
// (o container já reserva o aspect-video antes de qualquer conteúdo).
import { useState } from 'react';

export const LiteYouTube = ({ videoId, title, autoplay = true }: { videoId: string; title: string; autoplay?: boolean }) => {
  const [play, setPlay] = useState(false);

  if (play) {
    return (
      <iframe
        className="absolute inset-0 h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0${autoplay ? '&autoplay=1' : ''}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlay(true)}
      aria-label={`Assistir ao vídeo: ${title}`}
      className="group absolute inset-0 h-full w-full cursor-pointer"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`}
        onError={(e) => {
          const img = e.currentTarget;
          if (!img.src.includes('hqdefault')) img.src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
        }}
        alt={title}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/25 via-ink/35 to-ink/70" />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/15 bg-white/10 backdrop-blur transition-all duration-300 group-hover:scale-110 group-hover:border-goldp/50 group-hover:shadow-[0_0_32px_rgba(217,180,74,0.4)]">
          <svg viewBox="0 0 24 24" className="h-6 w-6 translate-x-[2px] fill-white/90">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </span>
    </button>
  );
};
