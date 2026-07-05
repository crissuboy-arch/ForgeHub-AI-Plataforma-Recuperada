// src/lib/assetSchema.ts
// Schema Zod + constantes do Admin Asset Studio (Sprint 4).
import { z } from 'zod';
import type { LinkType, ChecklistItem } from '../types';

// ------------------------------------------------------------- Opções de enum
export const LEVELS = ['starter', 'pro', 'elite', 'enterprise'] as const;
export const STATUSES = ['draft', 'active', 'updated', 'archived'] as const;
export const LICENSES = ['uso_pessoal', 'comercial', 'white_label', 'open_source'] as const;
export const REVENUE_MODELS = ['one_time', 'subscription', 'freemium', 'free', 'royalties', 'license_resale'] as const;
export const DELIVERY_BUNDLES = ['solo', 'pack', 'suite', 'full_kit'] as const;

export const ENUM_LABELS: Record<string, string> = {
  starter: 'Starter', pro: 'Pro', elite: 'Elite', enterprise: 'Enterprise',
  draft: 'Rascunho', active: 'Ativo', updated: 'Atualizado', archived: 'Arquivado',
  uso_pessoal: 'Uso pessoal', comercial: 'Comercial', white_label: 'White-label', open_source: 'Open Source',
  one_time: 'Pagamento único', subscription: 'Assinatura', freemium: 'Freemium', free: 'Gratuito',
  royalties: 'Royalties', license_resale: 'Revenda / Licença',
  solo: 'Solo', pack: 'Pack', suite: 'Suíte', full_kit: 'Kit Completo',
};

// ------------------------------------------------------------- Links (12)
export const LINK_FIELDS: { key: LinkType; label: string }[] = [
  { key: 'drive', label: 'Google Drive' },
  { key: 'lovable_remix', label: 'Lovable Remix' },
  { key: 'bolt_remix', label: 'Bolt Remix' },
  { key: 'github', label: 'GitHub' },
  { key: 'vercel', label: 'Vercel' },
  { key: 'netlify', label: 'Netlify' },
  { key: 'canva', label: 'Canva' },
  { key: 'figma', label: 'Figma' },
  { key: 'docs', label: 'Documentação' },
  { key: 'demo', label: 'Demo' },
  { key: 'deploy', label: 'Deploy' },
  { key: 'prompt', label: 'Prompt' },
];

// ------------------------------------------------------------- Checklist (12)
export const CHECKLIST_ITEMS: { key: ChecklistItem; label: string }[] = [
  { key: 'github', label: 'GitHub' }, { key: 'deploy', label: 'Deploy' },
  { key: 'drive', label: 'Google Drive' }, { key: 'canva', label: 'Canva' },
  { key: 'prompt', label: 'Prompt' }, { key: 'landing', label: 'Landing' },
  { key: 'copy', label: 'Copy' }, { key: 'criativos', label: 'Criativos' },
  { key: 'documentacao', label: 'Documentação' }, { key: 'videos', label: 'Vídeos' },
  { key: 'microapp', label: 'MicroApp' }, { key: 'mockups', label: 'Mockups' },
];

// ------------------------------------------------------------- ISO países / idiomas
export const COUNTRIES: { code: string; name: string }[] = [
  { code: 'BR', name: 'Brasil' }, { code: 'PT', name: 'Portugal' }, { code: 'US', name: 'Estados Unidos' },
  { code: 'ES', name: 'Espanha' }, { code: 'MX', name: 'México' }, { code: 'AR', name: 'Argentina' },
  { code: 'CO', name: 'Colômbia' }, { code: 'CL', name: 'Chile' }, { code: 'GB', name: 'Reino Unido' },
  { code: 'FR', name: 'França' }, { code: 'DE', name: 'Alemanha' }, { code: 'IT', name: 'Itália' },
  { code: 'CA', name: 'Canadá' }, { code: 'AU', name: 'Austrália' }, { code: 'JP', name: 'Japão' },
  { code: 'IN', name: 'Índia' }, { code: 'AO', name: 'Angola' }, { code: 'MZ', name: 'Moçambique' },
];

export const LANGUAGES: { code: string; name: string }[] = [
  { code: 'pt', name: 'Português' }, { code: 'en', name: 'Inglês' }, { code: 'es', name: 'Espanhol' },
  { code: 'fr', name: 'Francês' }, { code: 'de', name: 'Alemão' }, { code: 'it', name: 'Italiano' },
  { code: 'ja', name: 'Japonês' }, { code: 'zh', name: 'Chinês' }, { code: 'ru', name: 'Russo' },
];

// ------------------------------------------------------------- Zod schema
const optionalUrl = z
  .string()
  .trim()
  .refine((v) => v === '' || /^https?:\/\//i.test(v), 'URL deve começar com http(s)://');

const optionalInt = z.preprocess(
  (v) => (v === '' || v == null ? null : Number(v)),
  z.number().int().nonnegative().nullable(),
);

const linksShape = Object.fromEntries(LINK_FIELDS.map((l) => [l.key, optionalUrl])) as Record<LinkType, typeof optionalUrl>;
const checklistShape = Object.fromEntries(CHECKLIST_ITEMS.map((c) => [c.key, z.boolean()])) as Record<ChecklistItem, z.ZodBoolean>;

export const assetFormSchema = z.object({
  // 1. Dados básicos
  name: z.string().trim().min(2, 'Informe o nome'),
  // Normaliza (trim + lowercase + remove caracteres invisíveis) ANTES de validar,
  // evitando falsos negativos por colagem (maiúsculas, espaços, zero-width, nbsp).
  slug: z.preprocess(
    (v) =>
      typeof v === 'string'
        ? v.trim().toLowerCase().replace(/[\u200B-\u200D\uFEFF\u00A0]/g, '')
        : v,
    z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug inválido (use apenas minúsculas, números e hífens)'),
  ),
  category: z.string().min(1, 'Selecione a categoria'),
  language: z.enum(['pt-BR', 'es', 'en']),
  niche: z.string().optional().or(z.literal('')),
  shortDescription: z.string().trim().max(200, 'Máximo 200 caracteres').optional().or(z.literal('')),
  fullDescription: z.string().trim().optional().or(z.literal('')),
  level: z.enum(LEVELS),
  status: z.enum(STATUSES),
  license: z.enum(LICENSES),
  revenueModel: z.enum(REVENUE_MODELS),
  deliveryBundle: z.enum(DELIVERY_BUNDLES),
  setupTimeMinutes: optionalInt,
  timeToPublishMinutes: optionalInt,
  suggestedPrice: z.preprocess(
    (v) => (v === '' || v == null ? null : Number(v)),
    z.number().nonnegative().nullable(),
  ),

  // 2. Mídia
  coverUrl: optionalUrl,
  bannerUrl: optionalUrl,
  logoUrl: optionalUrl,
  thumbnailUrl: optionalUrl,
  previewUrl: optionalUrl,
  mockupUrl: optionalUrl,
  videoYoutubeUrl: optionalUrl,
  videoLoomUrl: optionalUrl,

  // Conteúdo do Prompt (copiável) — Prompt/Markdown/TXT/JSON
  promptContent: z.string().optional().or(z.literal('')),
  promptFormat: z.enum(['markdown', 'text', 'json', 'prompt']),

  // 3. Links
  links: z.object(linksShape),

  // 4-5-6-7-8. Multiseleções
  platforms: z.array(z.string()),
  aiTools: z.array(z.string()),
  countries: z.array(z.string()),
  languages: z.array(z.string()),
  tags: z.array(z.string()),

  // 9. Arquivos
  files: z.array(
    z.object({
      name: z.string().trim().min(1, 'Nome obrigatório'),
      kind: z.string().trim().optional().or(z.literal('')),
      sizeBytes: optionalInt,
      url: optionalUrl,
      driveFolder: z.string().trim().optional().or(z.literal('')),
    }),
  ),

  // 10. Screenshots
  screenshots: z.array(
    z.object({
      url: optionalUrl,
      caption: z.string().trim().optional().or(z.literal('')),
      position: z.number().int().nonnegative(),
    }),
  ),

  // 11. Checklist
  checklist: z.object(checklistShape),
});

export type AssetFormValues = z.infer<typeof assetFormSchema>;

// ------------------------------------------------------------- Valores default
export function emptyFormValues(): AssetFormValues {
  return {
    name: '', slug: '', category: '', language: 'pt-BR', niche: '', shortDescription: '', fullDescription: '',
    level: 'starter', status: 'draft', license: 'comercial',
    revenueModel: 'one_time', deliveryBundle: 'solo',
    setupTimeMinutes: null, timeToPublishMinutes: null, suggestedPrice: null,
    coverUrl: '', bannerUrl: '', logoUrl: '', thumbnailUrl: '', previewUrl: '',
    mockupUrl: '', videoYoutubeUrl: '', videoLoomUrl: '',
    promptContent: '', promptFormat: 'markdown',
    links: Object.fromEntries(LINK_FIELDS.map((l) => [l.key, ''])) as AssetFormValues['links'],
    platforms: [], aiTools: [], countries: [], languages: [], tags: [],
    files: [], screenshots: [],
    checklist: Object.fromEntries(CHECKLIST_ITEMS.map((c) => [c.key, false])) as AssetFormValues['checklist'],
  };
}

// Health score derivado (mesma fórmula do trigger do banco) para preview ao vivo.
export function computeHealth(checklist: AssetFormValues['checklist']): number {
  const items = Object.values(checklist);
  if (items.length === 0) return 0;
  const present = items.filter(Boolean).length;
  return Math.round((present / items.length) * 100);
}
