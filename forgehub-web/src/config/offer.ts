// src/config/offer.ts — fatos da oferta usados no site (fonte única, sem números inventados).
//
// Contagem PÚBLICA da /oferta: 7 kits / 7 nichos (decisão de 23/11/2026:
// a página promete 7; o 8.º item da biblioteca — Alongamento Natural/Unhas —
// fica como surpresa na entrega e não deve ser citado na /oferta).
// Ao acrescentar um nicho anunciado, atualize aqui e o dicionário.
export const LIBRARY = { total: 7 } as const;

// E-mail de contato mostrado na /oferta. Só aparece se estiver definido
// (variável NEXT_PUBLIC_FORGEHUB_CONTACT_EMAIL na Vercel) — nunca inventar um endereço.
export const CONTACT_EMAIL = (process.env.NEXT_PUBLIC_FORGEHUB_CONTACT_EMAIL ?? '').trim();
