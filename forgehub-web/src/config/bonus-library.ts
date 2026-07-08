// src/config/bonus-library.ts — Biblioteca de Bônus 100% orientada a dados.
// REGRA DE OURO: adicionar um bônus = adicionar 1 objeto aqui. Nunca editar o
// componente BonusLibrary nem criar cards manualmente.

export interface BonusItem {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string; // nome do ícone lucide-react (mapeado no componente)
  badge?: string;
  buttonText: string;
  url: string; // preencher depois (Drive, Canva, Skill, página interna, site externo)
  color: string; // hex de destaque
}

export const bonusLibrary: BonusItem[] = [
  {
    id: 'skills-ia',
    title: 'Biblioteca de Skills IA',
    description:
      'Skills universais para Claude, GPT, Gemini, Lovable, Cursor, Windsurf, Replit, Bolt, Base44 e outras IAs.',
    category: 'Skills IA',
    icon: 'Sparkles',
    badge: 'Premium',
    buttonText: 'Abrir Biblioteca',
    url: '',
    color: '#1472FF',
  },
  {
    id: 'templates-canva',
    title: 'Templates Canva',
    description: 'Biblioteca completa de templates profissionais totalmente editáveis.',
    category: 'Design',
    icon: 'LayoutTemplate',
    buttonText: 'Abrir Templates',
    url: '',
    color: '#00C2FF',
  },
  {
    id: 'packs-profissionais',
    title: 'Packs Profissionais',
    description: 'Coleções completas prontas para uso comercial.',
    category: 'Packs',
    icon: 'Package',
    badge: 'Premium',
    buttonText: 'Abrir Packs',
    url: '',
    color: '#C8A459',
  },
  {
    id: 'figurinhas-instagram',
    title: 'Figurinhas para Instagram',
    description: 'Pacotes completos de stickers para Stories e Redes Sociais.',
    category: 'Social Media',
    icon: 'Sticker',
    buttonText: 'Abrir Biblioteca',
    url: '',
    color: '#E1306C',
  },
  {
    id: 'templates-stories',
    title: 'Templates para Stories',
    description: 'Stories profissionais prontos para editar.',
    category: 'Social Media',
    icon: 'Film',
    buttonText: 'Abrir',
    url: '',
    color: '#1E4FD4',
  },
  {
    id: 'mockups-premium',
    title: 'Mockups Premium',
    description: 'Mockups realistas para ebooks, aplicativos e produtos digitais.',
    category: 'Design',
    icon: 'Smartphone',
    badge: 'Premium',
    buttonText: 'Abrir',
    url: '',
    color: '#22C55E',
  },
  {
    id: 'prompts-premium',
    title: 'Prompts Premium',
    description: 'Biblioteca com prompts prontos para IA.',
    category: 'IA',
    icon: 'MessageSquare',
    badge: 'Premium',
    buttonText: 'Abrir',
    url: '',
    color: '#F59E0B',
  },
  {
    id: 'icones',
    title: 'Biblioteca de Ícones',
    description: 'Coleção premium de ícones para interfaces.',
    category: 'Design',
    icon: 'Shapes',
    buttonText: 'Abrir',
    url: '',
    color: '#60A5FA',
  },
  {
    id: 'fontes',
    title: 'Biblioteca de Fontes',
    description: 'Fontes recomendadas para branding e design.',
    category: 'Design',
    icon: 'Type',
    buttonText: 'Abrir',
    url: '',
    color: '#FB7185',
  },
  {
    id: 'banco-imagens',
    title: 'Banco de Imagens',
    description: 'Coleção premium de imagens utilizadas na plataforma.',
    category: 'Recursos',
    icon: 'Image',
    buttonText: 'Abrir',
    url: '',
    color: '#2DD4BF',
  },
  {
    id: 'ferramentas',
    title: 'Ferramentas Recomendadas',
    description: 'Lista das melhores ferramentas utilizadas na ForgeHub AI.',
    category: 'Ferramentas',
    icon: 'Wrench',
    buttonText: 'Abrir',
    url: '',
    color: '#94A3B8',
  },
  {
    id: 'ebooks',
    title: 'Ebooks',
    description: 'Coleção de ebooks prontos para editar e distribuir.',
    category: 'Conteúdo',
    icon: 'BookOpen',
    buttonText: 'Abrir',
    url: '',
    color: '#38BDF8',
  },
  {
    id: 'checklists',
    title: 'Checklists',
    description: 'Checklists profissionais prontos para uso.',
    category: 'Produtividade',
    icon: 'CheckSquare',
    buttonText: 'Abrir',
    url: '',
    color: '#22C55E',
  },
  {
    id: 'agentes',
    title: 'Agentes',
    description: 'Agentes de IA prontos para automatizar tarefas.',
    category: 'IA',
    icon: 'Bot',
    badge: 'Premium',
    buttonText: 'Abrir',
    url: '',
    color: '#1E4FD4',
  },
];
