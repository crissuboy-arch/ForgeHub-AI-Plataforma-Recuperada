// src/lib/analytics/meta-pixel.ts
// Meta Pixel — ID oficial (Gerenciador de Eventos) + helper de eventos.
// O carregamento do Pixel vive em components/analytics/MetaPixel.tsx.

export const META_PIXEL_ID = '1610553524011173';

// Produto único vendido no checkout externo (Kiwify).
export const CHECKOUT_PRODUCT = {
  id: 'iY5RLP7', // id do produto na URL de checkout da Kiwify
  name: 'ForgeHub AI — Acesso à Biblioteca',
  value: 47.9,
  currency: 'BRL',
} as const;

type FbqParams = Record<string, unknown>;

type Fbq = ((...args: unknown[]) => void) & { queue?: unknown[] };

function getFbq(): Fbq | undefined {
  if (typeof window === 'undefined') return undefined;
  const fbq = (window as unknown as { fbq?: Fbq }).fbq;
  return typeof fbq === 'function' ? fbq : undefined;
}

/**
 * Dispara um evento padrão do Meta Pixel de forma segura.
 * No-op no servidor ou se o Pixel ainda não carregou (o stub `fbq` da tag
 * base enfileira as chamadas, então normalmente isso não acontece).
 */
export function trackMeta(event: string, params?: FbqParams): void {
  getFbq()?.('track', event, params);
}
