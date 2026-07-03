// src/types/index.ts
// Modelo de domínio ForgeHub AI (Sprint 2).
// Fonte: FORGEHUB_AI_ASSET_ARCHITECTURE_PLAN.md
// ATENÇÃO: a ForgeHub guarda metadados/links/versões/classificação — nunca código.

// ---------------------------------------------------------------- Enums
export type AssetStatus = 'draft' | 'active' | 'updated' | 'archived';
export type AssetLevel = 'starter' | 'pro' | 'elite' | 'enterprise';
export type AssetDifficulty = 'iniciante' | 'intermediario' | 'avancado';
export type AssetLicense = 'uso_pessoal' | 'comercial' | 'white_label' | 'open_source';
export type LinkType =
  | 'microapp' | 'deploy' | 'github' | 'remix' | 'drive' | 'canva' | 'docs'
  | 'lovable_remix' | 'bolt_remix' | 'vercel' | 'netlify' | 'figma' | 'demo' | 'prompt'
  | 'base44' | 'cursor' | 'sales';
export type ChecklistItem =
  | 'github' | 'deploy' | 'drive' | 'canva' | 'prompt' | 'landing'
  | 'copy' | 'criativos' | 'documentacao' | 'videos' | 'microapp' | 'mockups';
export type AnalyticsMetric = 'views' | 'downloads' | 'remixes' | 'favorites' | 'opens' | 'shares';
export type UpdateType =
  | 'novo_prompt' | 'nova_landing' | 'novo_canva' | 'novo_agente' | 'nova_copy' | 'correcao' | 'outro';

// Classificação comercial
export type RevenueModel = 'one_time' | 'subscription' | 'freemium' | 'free' | 'royalties' | 'license_resale';
export type DeliveryBundle = 'solo' | 'pack' | 'suite' | 'full_kit';
export type PlatformKind = 'build_tool' | 'deploy' | 'sales' | 'marketing' | 'cms';
export type MemberRole = 'owner' | 'admin' | 'editor' | 'viewer';

// ---------------------------------------------------------------- Lookups
export interface Category { slug: string; label: string; icon?: string; parentSlug?: string | null; }
export interface Tag { id: string; slug: string; label: string; }
export interface Platform { slug: string; label: string; kind: PlatformKind; icon?: string; }
export interface AiTool { slug: string; label: string; icon?: string; }

// ---------------------------------------------------------------- Relações do Asset
export interface AssetLink { type: LinkType; url: string; label?: string; }
export interface AssetFile {
  id: string; kind?: string; name: string; format?: string; url?: string;
  driveFolder?: string; sizeBytes?: number;
}
export interface ChangelogEntry {
  id: string; version: string; notes?: string; releasedAt: string; isCurrent: boolean;
}
export interface AssetScreenshot { id: string; url: string; caption?: string; position: number; }
export interface AssetChecklistRow { item: ChecklistItem; present: boolean; weight: number; refUrl?: string; }
export interface AssetUpdate {
  id: string; type: UpdateType; title: string; description?: string; createdAt: string; versionId?: string | null;
}
export interface AssetReview {
  id: string; userId?: string | null; rating: number; comment?: string; createdAt: string;
}
export interface AssetAnalytics {
  views: number; downloads: number; remixes: number; favorites: number; opens: number; shares: number;
}

// ---------------------------------------------------------------- Asset
/**
 * Versão enxuta para cards/grades/listas (Vault, Dashboard).
 * É o que a UI atual (Sprint 1.5) consome.
 */
export interface AssetSummary {
  id: string;
  slug: string;
  name: string;
  category: string;
  shortDescription?: string;
  status: AssetStatus;
  version: string;
  level: AssetLevel;
  healthScore: number;
  updatedAt: string;
  coverUrl?: string;
}

/** Registro completo do Asset (ficha). */
export interface Asset extends AssetSummary {
  workspaceId: string;
  tags: string[];
  fullDescription?: string;
  license: AssetLicense;
  suggestedPrice?: number;
  setupTimeMinutes?: number;
  difficulty?: AssetDifficulty;
  bannerUrl?: string;
  mockupUrl?: string;
  logoUrl?: string;
  videoYoutubeUrl?: string;
  videoLoomUrl?: string;
  thumbnailUrl?: string;
  previewUrl?: string;
  promptContent?: string;
  promptFormat?: string;
  parentId?: string | null;
  createdBy?: string | null;
  createdAt: string;

  // Classificação comercial
  revenueModel: RevenueModel;
  timeToPublishMinutes?: number;
  deliveryBundle: DeliveryBundle;
  targetCountries: string[]; // ISO 3166-1 alpha-2
  languages: string[]; // ISO 639-1
  platforms: Platform[];
  buildAiTools: string[]; // slugs de ai_tools
}

// ---------------------------------------------------------------- Coleções / Settings (Sprint 5)
export interface Collection { id: string; name: string; slug: string; count?: number; }
export interface UserSettings {
  fullName?: string;
  avatarUrl?: string;
  theme: string;
  language: string;
  workspace?: string;
  preferences: Record<string, unknown>;
}

/** Asset + todas as relações (payload da ficha premium — Sprint 3). */
export interface AssetDetail extends Asset {
  links: AssetLink[];
  files: AssetFile[];
  versions: ChangelogEntry[];
  screenshots: AssetScreenshot[];
  checklist: AssetChecklistRow[];
  updates: AssetUpdate[];
  analytics: AssetAnalytics;
}
