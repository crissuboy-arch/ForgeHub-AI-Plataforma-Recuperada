'use client';
// components/ui/limelight-nav.tsx
// Navegação com "holofote" (limelight) deslizante. Estrutura/lógica do componente
// original (21st.dev); adaptada aos tokens da ForgeHub (gold/card/border/content).
import React, { useState, useRef, useEffect, cloneElement } from 'react';
import { Home, Package, Workflow, Tag, HelpCircle } from 'lucide-react';

export type NavItem = {
  id: string;
  icon: React.ReactElement<{ className?: string }>;
  label: string;
  onClick?: () => void;
};

const defaultNavItems: NavItem[] = [
  { id: 'home', icon: <Home />, label: 'Home' },
  { id: 'kits', icon: <Package />, label: 'Kits' },
  { id: 'how', icon: <Workflow />, label: 'Como Funciona' },
  { id: 'pricing', icon: <Tag />, label: 'Preços' },
  { id: 'faq', icon: <HelpCircle />, label: 'FAQ' },
];

type LimelightNavProps = {
  items?: NavItem[];
  defaultActiveIndex?: number;
  onTabChange?: (index: number) => void;
  className?: string;
  limelightClassName?: string;
  iconContainerClassName?: string;
  iconClassName?: string;
};

export const LimelightNav = ({
  items = defaultNavItems,
  defaultActiveIndex = 0,
  onTabChange,
  className = '',
  limelightClassName = '',
  iconContainerClassName = '',
  iconClassName = '',
}: LimelightNavProps) => {
  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex);
  const [isReady, setIsReady] = useState(false);
  const navItemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const limelightRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const limelight = limelightRef.current;
    const activeItem = navItemRefs.current[activeIndex];
    if (limelight && activeItem) {
      const newLeft = activeItem.offsetLeft + activeItem.offsetWidth / 2 - limelight.offsetWidth / 2;
      limelight.style.left = `${newLeft}px`;
      if (!isReady) setTimeout(() => setIsReady(true), 50);
    }
  }, [activeIndex, isReady, items]);

  const handleItemClick = (index: number, itemOnClick?: () => void) => {
    setActiveIndex(index);
    onTabChange?.(index);
    itemOnClick?.();
  };

  if (items.length === 0) return null;

  return (
    <nav
      className={`relative inline-flex h-14 items-center rounded-interactive border border-border bg-card/70 px-1 backdrop-blur ${className}`}
      aria-label="Navegação da página de vendas"
    >
      {items.map((item, index) => {
        const isActive = activeIndex === index;
        return (
          <a
            key={item.id}
            ref={(el) => { navItemRefs.current[index] = el; }}
            className={`relative z-20 flex h-full cursor-pointer items-center justify-center px-4 ${iconContainerClassName}`}
            onClick={() => handleItemClick(index, item.onClick)}
            role="button"
            aria-label={item.label}
            title={item.label}
          >
            {cloneElement(item.icon, {
              className: `h-5 w-5 transition-all duration-150 ease-in-out ${isActive ? 'text-gold opacity-100' : 'text-muted opacity-60 hover:opacity-90'} ${iconClassName}`,
            })}
          </a>
        );
      })}

      <div
        ref={limelightRef}
        className={`absolute top-0 z-10 h-[4px] w-9 rounded-full bg-gold shadow-[0_18px_22px_2px_var(--color-gold)] ${isReady ? 'transition-[left] duration-400 ease-in-out' : ''} ${limelightClassName}`}
        style={{ left: '-999px' }}
      >
        <div className="pointer-events-none absolute left-[-30%] top-[4px] h-12 w-[160%] bg-gradient-to-b from-gold/25 to-transparent [clip-path:polygon(5%_100%,25%_0,75%_0,95%_100%)]" />
      </div>
    </nav>
  );
};
