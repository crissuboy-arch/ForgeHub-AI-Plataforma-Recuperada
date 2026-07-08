'use client';
// components/ui/platform-showcase.tsx
// Carrossel horizontal (Embla) com SCREENSHOTS REAIS da plataforma ForgeHub.
// Nada de mockup: imagens exportadas do próprio app (public/images/showcase/).
import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export type ShowcaseSlide = { src: string; caption: string };

export const PlatformShowcase = ({ slides }: { slides: ShowcaseSlide[] }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center', skipSnaps: false });
  const [selected, setSelected] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    onSelect();
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi]);

  const arrowBtn =
    'flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card/80 text-content backdrop-blur transition-colors hover:border-gold/60 hover:text-gold';

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {slides.map((slide, i) => (
            <div key={i} className="min-w-0 shrink-0 grow-0 basis-[88%] pl-4 sm:basis-[70%] lg:basis-[62%]">
              <figure className="group card-premium overflow-hidden rounded-container border border-border p-2 transition-all duration-300 hover:border-gold/50 hover:shadow-[var(--shadow-glow-gold)]">
                <div className="relative aspect-video w-full overflow-hidden rounded-interactive border border-border/60">
                  <Image
                    src={slide.src}
                    alt={slide.caption}
                    fill
                    sizes="(max-width: 640px) 88vw, (max-width: 1024px) 70vw, 900px"
                    className="object-cover object-top"
                    loading="lazy"
                  />
                </div>
                <figcaption className="px-2 py-3 text-center text-sm font-medium text-muted">
                  {slide.caption}
                </figcaption>
              </figure>
            </div>
          ))}
        </div>
      </div>

      {/* Controles */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <button type="button" onClick={scrollPrev} className={arrowBtn} aria-label="Anterior">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollTo(i)}
              aria-label={`Ir para o slide ${i + 1}`}
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
