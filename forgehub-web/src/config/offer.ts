// src/config/offer.ts — fatos da oferta usados no site (fonte única, sem números inventados).
//
// LIBRARY: contagem dos itens ATIVOS na biblioteca (tabela `assets`, status active/updated),
// conferida em 23/11/2026: 8 itens = 6 kits completos + 2 apps
// (NutriPlena, Finanças, Relacionamentos, Estética Premium, Alongamento Natural/Unhas,
//  Crescendo com Jesus Kids, Cardápio Pro/MenuFlow [app], Na Tua Presença [app]).
// Ao publicar um kit novo, atualize aqui (e o texto do dicionário que cita "8").
export const LIBRARY = { total: 8, kits: 6, apps: 2 } as const;

// E-mail de contato mostrado na /oferta. Só aparece se estiver definido
// (variável NEXT_PUBLIC_FORGEHUB_CONTACT_EMAIL na Vercel) — nunca inventar um endereço.
export const CONTACT_EMAIL = (process.env.NEXT_PUBLIC_FORGEHUB_CONTACT_EMAIL ?? '').trim();
