'use client';
// components/ui/phone-mockups-1-utils/phone-carousel.tsx
// Carrossel horizontal (Embla) de mockups de celular — usado para depoimentos
// reais em print de conversa. Autoplay, loop infinito, swipe, celular ativo
// centralizado e maior, laterais parcialmente visíveis.
import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export type ImageItem = { src: string; alt: string };

const PhoneFrame = ({ image, active }: { image: ImageItem; active: boolean }) => (
  <div
    className={`relative mx-auto aspect-[4/5] w-full max-w-[260px] overflow-hidden rounded-[2.2rem] border-[6px] transition-all duration-500 ease-out ${
      active
        ? 'scale-100 border-goldp/70 opacity-100 shadow-[0_0_32px_rgba(217,180,74,0.45)]'
        : 'scale-90 border-white/10 opacity-60'
    }`}
    style={{ background: '#000' }}
  >
    <span className="absolute left-1/2 top-1.5 z-10 h-4 w-24 -translate-x-1/2 rounded-full bg-black/80" />
    <Image
      src={image.src}
      alt={image.alt}
      fill
      sizes="(max-width: 640px) 72vw, (max-width: 1024px) 40vw, 26vw"
      className="object-contain object-top"
      loading="lazy"
    />
  </div>
);

export const PhoneCarousel = ({ images }: { images: ImageItem[] }) => {
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
    'flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white backdrop-blur transition-colors hover:border-goldp/60 hover:text-goldp';

  return (
    <div className="relative" onMouseEnter={stopAutoplay} onMouseLeave={startAutoplay}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {images.map((image, i) => (
            <div key={image.src} className="min-w-0 shrink-0 grow-0 basis-[72%] pl-4 sm:basis-[42%] lg:basis-[28%]">
              <button type="button" onClick={() => scrollTo(i)} className="block w-full" aria-label={image.alt}>
                <PhoneFrame image={image} active={selected === i} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center gap-4">
        <button type="button" onClick={scrollPrev} className={arrowBtn} aria-label="Anterior">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollTo(i)}
              aria-label={`Ir para o depoimento ${i + 1}`}
              className={`h-2 rounded-full transition-all ${selected === i ? 'w-6 bg-goldp' : 'w-2 bg-white/20 hover:bg-white/40'}`}
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
