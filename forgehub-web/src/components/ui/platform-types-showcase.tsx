'use client';
// components/ui/platform-types-showcase.tsx
// Carrossel horizontal (Embla) dos TIPOS de recursos da plataforma
// (aplicativos, agentes de IA, páginas de venda, ebooks, planners...).
// Cada card pode ter um mini carrossel interno (fade automático) quando
// o tipo tem mais de uma imagem representativa.
import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, type LucideIcon } from 'lucide-react';

export type PlatformTypeCard = {
  id: string;
  label: string;
  icon: LucideIcon;
  images: { src: string; alt: string }[];
};

const CardImages = ({ images }: { images: { src: string; alt: string }[] }) => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const id = setInterval(() => setActive((v) => (v + 1) % images.length), 2200);
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <div className="relative h-full w-full">
      {images.map((img, i) => (
        <Image
          key={img.src}
          src={img.src}
          alt={img.alt}
          fill
          sizes="(max-width: 640px) 88vw, (max-width: 1024px) 56vw, 40vw"
          className={`object-contain transition-opacity duration-700 ${i === active ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
        />
      ))}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
          {images.map((_, i) => (
            <span
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${i === active ? 'w-4 bg-white' : 'w-1 bg-white/50'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const PlatformTypesShowcase = ({ cards }: { cards: PlatformTypeCard[] }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center', skipSnaps: false });
  const [selected, setSelected] = useState(0);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  const startAutoplay = useCallback(() => {
    stopAutoplay();
    autoplayRef.current = setInterval(() => emblaApi?.scrollNext(), 4000);
  }, [emblaApi, stopAutoplay]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    onSelect();
    startAutoplay();
    emblaApi.on('pointerDown', stopAutoplay);
    emblaApi.on('pointerUp', startAutoplay);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('pointerDown', stopAutoplay);
      emblaApi.off('pointerUp', startAutoplay);
      stopAutoplay();
    };
  }, [emblaApi, startAutoplay, stopAutoplay]);

  const arrowBtn =
    'flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card/80 text-content backdrop-blur transition-colors hover:border-gold/60 hover:text-gold';

  return (
    <div className="relative" onMouseEnter={stopAutoplay} onMouseLeave={startAutoplay}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {cards.map((card, i) => {
            const isActive = selected === i;
            const Icon = card.icon;
            return (
              <div key={card.id} className="min-w-0 shrink-0 grow-0 basis-[88%] pl-4 sm:basis-[56%] lg:basis-[40%]">
                <button
                  type="button"
                  onClick={() => scrollTo(i)}
                  className={`card-premium group block w-full overflow-hidden rounded-container border p-2 text-left transition-all duration-500 ease-out ${
                    isActive
                      ? 'z-10 scale-[1.06] border-gold/60 shadow-[var(--shadow-glow-gold)]'
                      : 'scale-[0.94] border-border opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-interactive border border-border/60 bg-deep/40">
                    <CardImages images={card.images} />
                  </div>
                  <div className="flex items-center gap-2 px-2 py-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-interactive bg-gold/15 text-gold">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="font-display text-sm font-bold text-content sm:text-base">{card.label}</span>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Controles */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <button type="button" onClick={scrollPrev} className={arrowBtn} aria-label="Anterior">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          {cards.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollTo(i)}
              aria-label={`Ir para o card ${i + 1}`}
              className={`h-2 rounded-full transition-all ${selected === i ? 'w-6 bg-gold' : 'w-2 bg-border hover:bg-muted'}`}
            />
          ))}
        </div>
        <button type="button" onClick={scrollNext} className={arrowBtn} aria-label="Próximo">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
