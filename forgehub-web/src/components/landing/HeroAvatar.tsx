'use client';
// components/landing/HeroAvatar.tsx
// Slot do vídeo de avatar do Hero — pronto ANTES do arquivo existir.
// Camadas: placeholder de marca (fundo) -> vídeo (se existir, por cima).
// Se /videos/hero-avatar.mp4 não existir, o vídeo dá erro silencioso e fica só o
// placeholder ("Vídeo em breve") — nunca uma imagem quebrada.
// Para ativar: subir hero-avatar.mp4 em public/videos/ e commitar (sem mexer no código).
import { useState } from 'react';

export const HeroAvatar = ({ className = '' }: { className?: string }) => {
  const [videoOk, setVideoOk] = useState(true);
  const [canPlay, setCanPlay] = useState(false);

  return (
    <div
      className={`relative aspect-[3/4] w-32 overflow-hidden rounded-2xl border border-white/12 bg-gradient-to-br from-royal/30 via-ink to-ink shadow-[0_22px_55px_-18px_rgba(36,107,255,0.55)] sm:w-36 ${className}`}
    >
      {/* Placeholder de marca (sempre no fundo) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-2 text-center">
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 backdrop-blur">
          <svg viewBox="0 0 24 24" className="h-4 w-4 translate-x-[1px] fill-white/80">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
        <span className="text-[10px] font-medium leading-tight text-white/55">Vídeo em breve</span>
      </div>

      {/* Vídeo (se o arquivo existir) — só aparece quando realmente pode tocar */}
      {videoOk && (
        <video
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${canPlay ? 'opacity-100' : 'opacity-0'}`}
          src="/videos/hero-avatar.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          onCanPlay={() => setCanPlay(true)}
          onError={() => setVideoOk(false)}
        />
      )}

      {/* Selo */}
      <span className="absolute bottom-2 left-2 z-10 flex items-center gap-1 rounded-full bg-black/45 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white backdrop-blur">
        <span className="h-1.5 w-1.5 rounded-full bg-red-500" /> Intro
      </span>
    </div>
  );
};
