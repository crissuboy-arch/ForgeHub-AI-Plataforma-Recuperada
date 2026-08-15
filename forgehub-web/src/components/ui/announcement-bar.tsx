// components/ui/announcement-bar.tsx
// Barra de avisos no topo absoluto da página — marquee horizontal infinito,
// só CSS (sem lib externa). A sequência é duplicada internamente para o
// loop ficar perfeito (a faixa anda -50%, que é exatamente uma cópia).
import React from 'react';

const Track = ({ items, hidden }: { items: string[]; hidden?: boolean }) => (
  <div className="flex shrink-0 items-center" aria-hidden={hidden}>
    {items.map((item, i) => (
      <span key={i} className="flex shrink-0 items-center whitespace-nowrap px-4 text-xs font-medium text-white">
        {item}
        <span className="ml-4 text-white/50">•</span>
      </span>
    ))}
  </div>
);

export const AnnouncementBar = ({ items }: { items: string[] }) => (
  <div className="flex h-8 w-full items-center overflow-hidden bg-[image:var(--gradient-brand)] sm:h-[34px]">
    <div className="flex w-max animate-marquee">
      <Track items={items} />
      <Track items={items} hidden />
    </div>
  </div>
);
