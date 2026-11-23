// src/config/pricing.ts — FONTE ÚNICA de preço da ForgeHub AI no site.
//
// O preço cobrado de verdade é o do produto na Cakto (pay.cakto.com.br/8bnihyg_1349116).
// Este arquivo só controla o que o SITE mostra (landing, /oferta, JSON-LD e
// o `value` dos eventos do Meta Pixel) — mantenha-o em sincronia com a Cakto.
//
// Semana Black ForgeHub: R$ 19,90 até 30/11/2026 23:59 (America/Sao_Paulo).
// Depois disso o site volta SOZINHO para o preço normal (R$ 47,90) — no cliente
// na hora, e no HTML estático na próxima revalidação (revalidate = 300 s nas
// rotas / e /oferta). Para desligar antes: `enabled: false`.

/** Preço normal (BRL). */
export const PRICE_REGULAR = 47.9;

export const BLACK_FRIDAY = {
  /** Interruptor único da campanha. `false` = site mostra só o preço normal. */
  enabled: true,
  /** Preço promocional (BRL). */
  price: 19.9,
  /** Início (inclusive) — horário de Brasília (UTC-3, sem horário de verão). */
  startsAt: '2026-11-20T00:00:00-03:00',
  /** Fim (inclusive) — 30/11/2026 23:59:59 em America/Sao_Paulo. */
  endsAt: '2026-11-30T23:59:59-03:00',
} as const;

const START_MS = Date.parse(BLACK_FRIDAY.startsAt);
const END_MS = Date.parse(BLACK_FRIDAY.endsAt);

/** Fim da promoção em ms (epoch) — usado pelo contador real até o prazo. */
export const BLACK_FRIDAY_END_MS = END_MS;

export function isBlackFridayActive(now: number = Date.now()): boolean {
  return BLACK_FRIDAY.enabled && now >= START_MS && now <= END_MS;
}

export type Pricing = {
  /** Preço cobrado agora (BRL, número). */
  current: number;
  /** Preço normal (BRL, número). */
  regular: number;
  /** Semana Black ativa? */
  promo: boolean;
};

export function getPricing(now: number = Date.now()): Pricing {
  const promo = isBlackFridayActive(now);
  return { current: promo ? BLACK_FRIDAY.price : PRICE_REGULAR, regular: PRICE_REGULAR, promo };
}

/** 47.9 → "R$ 47,90" (pt-BR/es) | "R$ 47.90" (en). */
export function formatPrice(n: number, lang: string = 'pt-BR'): string {
  const s = n.toFixed(2);
  return `R$ ${lang === 'en' ? s : s.replace('.', ',')}`;
}

/** 47.9 → "47.90" (formato schema.org). */
export const schemaPrice = (n: number) => n.toFixed(2);
