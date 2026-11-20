'use client';
// src/lib/pricing/PricingProvider.tsx
// O server component da rota decide `promo` na renderização (build/ISR) e passa
// aqui — assim o HTML e a hidratação batem. Depois de montar, o cliente
// reconfere a cada 30 s: se o prazo passar com a página aberta (ou o HTML em
// cache ainda for da promo), volta para o preço normal sem recarregar.
import React from 'react';
import { getPricing, isBlackFridayActive, PRICE_REGULAR, BLACK_FRIDAY, type Pricing } from '../../config/pricing';

const PricingContext = React.createContext<Pricing | null>(null);

const fromPromo = (promo: boolean): Pricing => ({
  current: promo ? BLACK_FRIDAY.price : PRICE_REGULAR,
  regular: PRICE_REGULAR,
  promo,
});

export function PricingProvider({ promo, children }: { promo: boolean; children: React.ReactNode }) {
  const [active, setActive] = React.useState(promo);
  React.useEffect(() => {
    const check = () => setActive(isBlackFridayActive());
    check();
    const id = setInterval(check, 30_000);
    return () => clearInterval(id);
  }, []);
  const value = React.useMemo(() => fromPromo(active), [active]);
  return <PricingContext.Provider value={value}>{children}</PricingContext.Provider>;
}

/** Preço atual. Fora de um PricingProvider, calcula pelo relógio. */
export function usePricing(): Pricing {
  return React.useContext(PricingContext) ?? getPricing();
}
