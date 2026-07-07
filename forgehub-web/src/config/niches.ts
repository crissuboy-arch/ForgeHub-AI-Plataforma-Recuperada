// src/config/niches.ts — fonte única e orientada por dados dos nichos do Hero Banner.
// REGRA DE OURO: novo nicho = 1 entrada aqui + rodar scripts/generate-niche-images.ts
// UMA vez. Nunca editar o componente HeroBanner por causa de um nicho novo.

export interface NicheConfig {
  id: string;
  slug?: string; // slug real do nicho no banco (para o "Explorar Kit"); default = id
  kitLabel: string;
  tagline: string;
  description: string;
  tags: string[];
  imagePrompt: string; // prompt em inglês para gerar a imagem (build-time)
  backgroundImage: string; // path final: /images/niches/{id}.jpg (preenchido após gerar)
  accentColor: string; // hex
  icon: string; // nome do ícone lucide-react
  stats: { kits: number; downloads: number; remixes: number; favoritos: number; atualizacoes: number };
}

export const niches: NicheConfig[] = [
  {
    id: 'relacionamentos',
    kitLabel: 'Relacionamentos',
    tagline: 'Ebooks + Planner + Templates + Canva + IA',
    description: 'Negócio digital completo para o nicho de relacionamentos, pronto para personalizar e vender.',
    tags: ['Ebooks', 'Planner', 'Templates', 'Canva', 'IA', 'Premium'],
    imagePrompt:
      'cinematic photo, elegant couple having sophisticated dinner at golden hour, luxury restaurant terrace, warm candlelight, shallow depth of field, photorealistic, editorial photography style, no text, no logos',
    accentColor: '#D4568C',
    icon: 'Heart',
    backgroundImage: '/images/niches/relacionamentos.jpg',
    stats: { kits: 6, downloads: 1995, remixes: 340, favoritos: 595, atualizacoes: 1 },
  },
  {
    id: 'gospel',
    slug: 'devocional',
    kitLabel: 'Gospel',
    tagline: 'Ebooks + Devocionais + Templates + Canva + IA',
    description: 'Conteúdo devocional e gospel completo, pronto para inspirar, personalizar e vender.',
    tags: ['Ebooks', 'Devocional', 'Templates', 'Canva', 'IA', 'Premium'],
    imagePrompt:
      'cinematic photo, open bible on wooden table, soft warm light rays, shallow depth of field, photorealistic, editorial photography style, no text, no logos',
    accentColor: '#C9A227',
    icon: 'BookOpen',
    backgroundImage: '/images/niches/gospel.jpg',
    stats: { kits: 0, downloads: 0, remixes: 0, favoritos: 0, atualizacoes: 0 },
  },
  {
    id: 'nutricao',
    kitLabel: 'Nutrição',
    tagline: 'App + Ebook + Templates + Landing Page + Checkout + IA',
    description: 'Negócio digital completo de nutrição, pronto para personalizar, publicar e vender.',
    tags: ['App', 'Ebook', 'Templates', 'Landing Page', 'Checkout', 'IA'],
    imagePrompt:
      'cinematic photo, colorful healthy meal bowl with fresh vegetables and fruits on marble table, natural morning light, shallow depth of field, photorealistic, editorial food photography, no text, no logos',
    accentColor: '#22C55E',
    icon: 'Apple',
    backgroundImage: '/images/niches/nutricao.jpg',
    stats: { kits: 0, downloads: 0, remixes: 0, favoritos: 0, atualizacoes: 0 },
  },
  {
    id: 'financas',
    kitLabel: 'Finanças',
    tagline: 'Planilhas + Dashboard + Calculadoras + Templates + IA',
    description: 'Controle financeiro completo, pronto para personalizar e vender.',
    tags: ['Planilhas', 'Dashboard', 'Calculadoras', 'Templates', 'IA', 'Premium'],
    imagePrompt:
      'cinematic photo, modern financial workspace with laptop showing charts, coffee and notebook, soft daylight, shallow depth of field, photorealistic, editorial photography, no text, no logos',
    accentColor: '#00C2FF',
    icon: 'TrendingUp',
    backgroundImage: '/images/niches/financas.jpg',
    stats: { kits: 0, downloads: 0, remixes: 0, favoritos: 0, atualizacoes: 0 },
  },
  {
    id: 'beleza-estetica',
    kitLabel: 'Beleza e Estética',
    tagline: 'Ebook + Planner + Instagram + Canva + Landing Page',
    description: 'Estética, skincare, clínicas e beleza — tudo pronto para personalizar e vender.',
    tags: ['Ebook', 'Planner', 'Instagram', 'Canva', 'Landing Page', 'Premium'],
    imagePrompt:
      'cinematic photo, elegant skincare products on soft pastel background with fresh flowers, spa atmosphere, natural light, shallow depth of field, photorealistic, editorial beauty photography, no text, no logos',
    accentColor: '#C084FC',
    icon: 'Sparkles',
    backgroundImage: '/images/niches/beleza-estetica.jpg',
    stats: { kits: 0, downloads: 0, remixes: 0, favoritos: 0, atualizacoes: 0 },
  },
  {
    id: 'psicologia',
    kitLabel: 'Psicologia',
    tagline: 'Ebooks + Templates + Canva + Planner + IA',
    description: 'Conteúdo para o nicho de psicologia e bem-estar, pronto para personalizar e vender.',
    tags: ['Ebooks', 'Templates', 'Canva', 'Planner', 'IA', 'Premium'],
    imagePrompt:
      'cinematic photo, cozy calm therapy office with armchair and plants, warm soft light, shallow depth of field, photorealistic, editorial photography, no text, no logos',
    accentColor: '#60A5FA',
    icon: 'Brain',
    backgroundImage: '/images/niches/psicologia.jpg',
    stats: { kits: 0, downloads: 0, remixes: 0, favoritos: 0, atualizacoes: 0 },
  },
  {
    id: 'desenvolvimento-pessoal',
    kitLabel: 'Desenvolvimento Pessoal',
    tagline: 'Ebooks + Planner + Templates + Canva + IA',
    description: 'Kits de desenvolvimento pessoal e produtividade, prontos para personalizar e vender.',
    tags: ['Ebooks', 'Planner', 'Templates', 'Canva', 'IA', 'Premium'],
    imagePrompt:
      'cinematic photo, person journaling at sunrise on a mountain viewpoint, inspiring golden light, shallow depth of field, photorealistic, editorial photography, no text, no logos',
    accentColor: '#F59E0B',
    icon: 'Rocket',
    backgroundImage: '/images/niches/desenvolvimento-pessoal.jpg',
    stats: { kits: 0, downloads: 0, remixes: 0, favoritos: 0, atualizacoes: 0 },
  },
  {
    id: 'marketing-digital',
    kitLabel: 'Marketing Digital',
    tagline: 'Prompts + Criativos + Templates + Canva + IA',
    description: 'Arsenal de marketing digital pronto para personalizar, publicar e vender.',
    tags: ['Prompts', 'Criativos', 'Templates', 'Canva', 'IA', 'Premium'],
    imagePrompt:
      'cinematic photo, creative marketing workspace with smartphone showing social media, colorful sticky notes on a modern desk, bright light, shallow depth of field, photorealistic, editorial photography, no text, no logos',
    accentColor: '#1472FF',
    icon: 'Megaphone',
    backgroundImage: '/images/niches/marketing-digital.jpg',
    stats: { kits: 0, downloads: 0, remixes: 0, favoritos: 0, atualizacoes: 0 },
  },
  {
    id: 'educacao',
    kitLabel: 'Educação',
    tagline: 'Ebooks + Templates + Planner + Canva + IA',
    description: 'Kits educacionais completos, prontos para personalizar e vender.',
    tags: ['Ebooks', 'Templates', 'Planner', 'Canva', 'IA', 'Premium'],
    imagePrompt:
      'cinematic photo, elegant study desk with open books, notebook and warm lamp light, cozy academic atmosphere, shallow depth of field, photorealistic, editorial photography, no text, no logos',
    accentColor: '#38BDF8',
    icon: 'GraduationCap',
    backgroundImage: '/images/niches/educacao.jpg',
    stats: { kits: 0, downloads: 0, remixes: 0, favoritos: 0, atualizacoes: 0 },
  },
  {
    id: 'lifestyle',
    kitLabel: 'Lifestyle',
    tagline: 'Ebooks + Planner + Templates + Canva + IA',
    description: 'Conteúdo lifestyle e bem-estar, pronto para personalizar e vender.',
    tags: ['Ebooks', 'Planner', 'Templates', 'Canva', 'IA', 'Premium'],
    imagePrompt:
      'cinematic photo, aesthetic minimalist lifestyle flatlay with coffee, plant and phone on a light table, soft natural light, shallow depth of field, photorealistic, editorial photography, no text, no logos',
    accentColor: '#FB7185',
    icon: 'Coffee',
    backgroundImage: '/images/niches/lifestyle.jpg',
    stats: { kits: 0, downloads: 0, remixes: 0, favoritos: 0, atualizacoes: 0 },
  },
  {
    id: 'infantil',
    kitLabel: 'Infantil',
    tagline: 'Histórias + Colorir + Atividades + Planner + Canva + IA',
    description: 'Kit infantil completo e criativo, pronto para personalizar e vender.',
    tags: ['Histórias', 'Colorir', 'Atividades', 'Planner', 'Canva', 'IA'],
    imagePrompt:
      'cinematic photo, colorful children creative desk with crayons, storybooks and toys, cheerful bright light, shallow depth of field, photorealistic, editorial photography, no text, no logos',
    accentColor: '#FBBF24',
    icon: 'Baby',
    backgroundImage: '/images/niches/infantil.jpg',
    stats: { kits: 0, downloads: 0, remixes: 0, favoritos: 0, atualizacoes: 0 },
  },
  {
    id: 'imobiliario',
    kitLabel: 'Imobiliário',
    tagline: 'Landing Pages + Templates + Contratos + Canva + IA',
    description: 'Kit imobiliário completo para corretores e imobiliárias. (Em breve na Biblioteca.)',
    tags: ['Landing Pages', 'Templates', 'Contratos', 'Canva', 'IA', 'Premium'],
    imagePrompt:
      'cinematic photo, modern luxury house exterior at golden hour with warm interior lights, architectural photography, shallow depth of field, photorealistic, editorial real estate photography, no text, no logos',
    accentColor: '#34D399',
    icon: 'Home',
    backgroundImage: '/images/niches/imobiliario.jpg',
    stats: { kits: 0, downloads: 0, remixes: 0, favoritos: 0, atualizacoes: 0 },
  },
  {
    id: 'saude',
    kitLabel: 'Saúde',
    tagline: 'Ebooks + Planner + Templates + Canva + IA',
    description: 'Kit de saúde e bem-estar para profissionais e clínicas. (Em breve na Biblioteca.)',
    tags: ['Ebooks', 'Planner', 'Templates', 'Canva', 'IA', 'Premium'],
    imagePrompt:
      'cinematic photo, clean modern wellness setting with stethoscope, plant and soft daylight, shallow depth of field, photorealistic, editorial health photography, no text, no logos',
    accentColor: '#2DD4BF',
    icon: 'Stethoscope',
    backgroundImage: '/images/niches/saude.jpg',
    stats: { kits: 0, downloads: 0, remixes: 0, favoritos: 0, atualizacoes: 0 },
  },
  {
    id: 'gastronomia',
    kitLabel: 'Gastronomia',
    tagline: 'Cardápios + Templates + Ebooks + Canva + IA',
    description: 'Kit gastronômico para restaurantes, chefs e food service. (Em breve na Biblioteca.)',
    tags: ['Cardápios', 'Templates', 'Ebooks', 'Canva', 'IA', 'Premium'],
    imagePrompt:
      'cinematic photo, gourmet dish plated elegantly on a rustic table with warm restaurant light and steam, shallow depth of field, photorealistic, editorial food photography, no text, no logos',
    accentColor: '#FB923C',
    icon: 'UtensilsCrossed',
    backgroundImage: '/images/niches/gastronomia.jpg',
    stats: { kits: 0, downloads: 0, remixes: 0, favoritos: 0, atualizacoes: 0 },
  },
  {
    id: 'pets',
    kitLabel: 'Pets',
    tagline: 'Ebooks + Planner + Templates + Canva + IA',
    description: 'Kit para o nicho pet: petshops, adestradores e clínicas. (Em breve na Biblioteca.)',
    tags: ['Ebooks', 'Planner', 'Templates', 'Canva', 'IA', 'Premium'],
    imagePrompt:
      'cinematic photo, happy dog and cat together in a cozy sunlit living room, warm light, shallow depth of field, photorealistic, editorial pet photography, no text, no logos',
    accentColor: '#F472B6',
    icon: 'Dog',
    backgroundImage: '/images/niches/pets.jpg',
    stats: { kits: 0, downloads: 0, remixes: 0, favoritos: 0, atualizacoes: 0 },
  },
];
