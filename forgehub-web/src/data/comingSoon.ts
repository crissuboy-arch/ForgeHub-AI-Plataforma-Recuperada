// src/data/comingSoon.ts — vitrine "Em breve" (nichos/recursos futuros).
// Data-driven: novos itens entram aqui sem alterar o componente.
export type ComingSoonItem = { id: string; emoji: string; key: string; waitlist: number };

export const comingSoonItems: ComingSoonItem[] = [
  { id: 'black', emoji: '🔥', key: 'cs.black', waitlist: 1280 },
  { id: 'realestate', emoji: '🏡', key: 'cs.realestate', waitlist: 640 },
  { id: 'health', emoji: '🏥', key: 'cs.health', waitlist: 512 },
  { id: 'food', emoji: '🍔', key: 'cs.food', waitlist: 430 },
  { id: 'tourism', emoji: '✈️', key: 'cs.tourism', waitlist: 388 },
  { id: 'pets', emoji: '🐶', key: 'cs.pets', waitlist: 356 },
  { id: 'law', emoji: '⚖️', key: 'cs.law', waitlist: 274 },
  { id: 'education', emoji: '🎓', key: 'cs.education', waitlist: 246 },
  { id: 'beauty', emoji: '💇', key: 'cs.beautyPremium', waitlist: 502 },
  { id: 'localbiz', emoji: '💼', key: 'cs.localBiz', waitlist: 198 },
  { id: 'aiskills', emoji: '🤖', key: 'cs.aiSkills', waitlist: 910 },
  { id: 'canva', emoji: '📦', key: 'cs.canvaPacks', waitlist: 720 },
  { id: 'apps', emoji: '✨', key: 'cs.newApps', waitlist: 664 },
];
