// src/data/heroSlides.ts — dados do Hero Carousel da Home (data-driven, reutilizável).
// No futuro, Kits marcados como "Destaque" no Admin podem ser convertidos neste
// formato e concatenados a `heroSlides` sem alterar o componente.
import type { AppLanguage } from '../types';

type Loc = Record<AppLanguage, string>;

export type HeroSlide = {
  id: string;
  icon: string;           // ícone do Icon atom
  accent: string;         // cor de destaque (glow/chips)
  gradient: string;       // background do slide (CSS)
  link: string;           // CTA principal
  linkSecondary?: string; // CTA secundário
  buttonKey: string;      // chave i18n do botão principal
  buttonSecondaryKey?: string;
  image?: string;         // imagem real opcional (ex.: Kit em Destaque)
  mockups: string[];      // peças incluídas (chips)
  badge: Loc;
  title: Loc;
  subtitle: Loc;
  description: Loc;
};

const l = (pt: string, es: string, en: string): Loc => ({ 'pt-BR': pt, es, en });

export const heroSlides: HeroSlide[] = [
  {
    id: 'nutriplena',
    icon: 'sparkles',
    accent: '#22c55e',
    gradient: 'linear-gradient(135deg, #0B1E3C 0%, #0f3d2e 100%)',
    link: '/assets?niche=nutricao',
    linkSecondary: '/assets',
    buttonKey: 'hero.explore',
    buttonSecondaryKey: 'hero.details',
    mockups: ['Smartphone', 'Ebook', 'Landing Page', 'Checkout', 'Dashboard', 'Templates'],
    badge: l('Nutrição', 'Nutrición', 'Nutrition'),
    title: l('ForgeHub NutriPlena', 'ForgeHub NutriPlena', 'ForgeHub NutriPlena'),
    subtitle: l(
      'App + Ebook + Templates + Landing Page + Checkout + IA',
      'App + Ebook + Plantillas + Landing Page + Checkout + IA',
      'App + Ebook + Templates + Landing Page + Checkout + AI',
    ),
    description: l(
      'Tudo pronto para criar, personalizar e vender seu negócio digital de nutrição.',
      'Todo listo para crear, personalizar y vender tu negocio digital de nutrición.',
      'Everything ready to create, customize and sell your nutrition digital business.',
    ),
  },
  {
    id: 'estetica',
    icon: 'star',
    accent: '#c084fc',
    gradient: 'linear-gradient(135deg, #0B1E3C 0%, #3b1d4e 100%)',
    link: '/assets?niche=beleza-estetica',
    linkSecondary: '/assets',
    buttonKey: 'hero.explore',
    buttonSecondaryKey: 'hero.details',
    mockups: ['Ebook', 'Planner', 'Instagram', 'Canva', 'Landing Page'],
    badge: l('Estética', 'Estética', 'Aesthetics'),
    title: l('ForgeHub Estética Premium', 'ForgeHub Estética Premium', 'ForgeHub Aesthetics Premium'),
    subtitle: l(
      'Estética, skincare, harmonização facial, clínicas e beleza.',
      'Estética, skincare, armonización facial, clínicas y belleza.',
      'Aesthetics, skincare, facial harmonization, clinics and beauty.',
    ),
    description: l(
      'Ebook, Planner, Instagram, Canva e Landing Page prontos para a sua clínica.',
      'Ebook, Planner, Instagram, Canva y Landing Page listos para tu clínica.',
      'Ebook, Planner, Instagram, Canva and Landing Page ready for your clinic.',
    ),
  },
  {
    id: 'financas',
    icon: 'money',
    accent: '#00c2ff',
    gradient: 'linear-gradient(135deg, #0B1E3C 0%, #0e2a52 100%)',
    link: '/assets?niche=financas',
    linkSecondary: '/assets',
    buttonKey: 'hero.explore',
    buttonSecondaryKey: 'hero.details',
    mockups: ['Planilhas', 'Dashboard', 'Calculadoras', 'Templates', 'IA'],
    badge: l('Finanças', 'Finanzas', 'Finance'),
    title: l('ForgeHub Finanças', 'ForgeHub Finanzas', 'ForgeHub Finance'),
    subtitle: l('Controle financeiro completo.', 'Control financiero completo.', 'Complete financial control.'),
    description: l(
      'Planilhas, Dashboard, Calculadoras, Templates e IA em um só Kit.',
      'Planillas, Dashboard, Calculadoras, Plantillas e IA en un solo Kit.',
      'Spreadsheets, Dashboard, Calculators, Templates and AI in one Kit.',
    ),
  },
  {
    id: 'relacionamentos',
    icon: 'favorite',
    accent: '#fb7185',
    gradient: 'linear-gradient(135deg, #0B1E3C 0%, #4a1f38 100%)',
    link: '/assets?niche=relacionamentos',
    linkSecondary: '/assets',
    buttonKey: 'hero.explore',
    buttonSecondaryKey: 'hero.details',
    mockups: ['Ebooks', 'Planner', 'Templates', 'Canva', 'Jornais', 'IA'],
    badge: l('Relacionamentos', 'Relaciones', 'Relationships'),
    title: l('ForgeHub Relacionamentos', 'ForgeHub Relaciones', 'ForgeHub Relationships'),
    subtitle: l(
      'Ebooks + Planner + Templates + Canva + Jornais + IA',
      'Ebooks + Planner + Plantillas + Canva + Diarios + IA',
      'Ebooks + Planner + Templates + Canva + Journals + AI',
    ),
    description: l(
      'Conteúdo completo e pronto para o nicho de relacionamentos.',
      'Contenido completo y listo para el nicho de relaciones.',
      'Complete content ready for the relationships niche.',
    ),
  },
  {
    id: 'gospel',
    icon: 'star',
    accent: '#e3c88a',
    gradient: 'linear-gradient(135deg, #0B1E3C 0%, #3a2f14 100%)',
    link: '/assets?niche=devocional',
    linkSecondary: '/assets',
    buttonKey: 'hero.explore',
    buttonSecondaryKey: 'hero.details',
    mockups: ['Devocionais', 'Ebooks', 'Canva', 'Planner', 'Templates', 'IA'],
    badge: l('Gospel', 'Gospel', 'Gospel'),
    title: l('ForgeHub Gospel', 'ForgeHub Gospel', 'ForgeHub Gospel'),
    subtitle: l(
      'Devocionais + Ebooks + Canva + Planner + Templates + IA',
      'Devocionales + Ebooks + Canva + Planner + Plantillas + IA',
      'Devotionals + Ebooks + Canva + Planner + Templates + AI',
    ),
    description: l(
      'Conteúdo devocional completo, pronto para inspirar e vender.',
      'Contenido devocional completo, listo para inspirar y vender.',
      'Complete devotional content, ready to inspire and sell.',
    ),
  },
  {
    id: 'infantil',
    icon: 'sparkles',
    accent: '#f59e0b',
    gradient: 'linear-gradient(135deg, #0B1E3C 0%, #4a2f14 100%)',
    link: '/assets',
    linkSecondary: '/assets',
    buttonKey: 'hero.explore',
    buttonSecondaryKey: 'hero.details',
    mockups: ['Histórias', 'Colorir', 'Atividades', 'Planner', 'Canva', 'IA'],
    badge: l('Infantil', 'Infantil', 'Kids'),
    title: l('ForgeHub Infantil', 'ForgeHub Infantil', 'ForgeHub Kids'),
    subtitle: l(
      'Histórias + Colorir + Atividades + Planner + Canva + IA',
      'Cuentos + Colorear + Actividades + Planner + Canva + IA',
      'Stories + Coloring + Activities + Planner + Canva + AI',
    ),
    description: l(
      'Kit infantil completo, criativo e pronto para personalizar.',
      'Kit infantil completo, creativo y listo para personalizar.',
      'Complete kids kit, creative and ready to customize.',
    ),
  },
  {
    id: 'welcome',
    icon: 'rocket',
    accent: '#1472ff',
    gradient: 'linear-gradient(135deg, #0e2a52 0%, #1472ff 100%)',
    link: '/assets',
    buttonKey: 'hero.exploreLibrary',
    mockups: [],
    badge: l('ForgeHub AI', 'ForgeHub AI', 'ForgeHub AI'),
    title: l('Bem-vindo ao ForgeHub AI', 'Bienvenido a ForgeHub AI', 'Welcome to ForgeHub AI'),
    subtitle: l(
      'A maior biblioteca de Kits Digitais Remixáveis.',
      'La mayor biblioteca de Kits Digitales Remixables.',
      'The largest library of Remixable Digital Kits.',
    ),
    description: l(
      'Crie. Personalize. Remixe. Venda. Tudo em um único lugar.',
      'Crea. Personaliza. Remezcla. Vende. Todo en un solo lugar.',
      'Create. Customize. Remix. Sell. All in one place.',
    ),
  },
];
