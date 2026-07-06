// src/data/assets.ts
// Camada de dados dos Assets (Supabase). Sprint 2 — ainda NÃO consumida pela UI.
// Responsável por consultar o banco e mapear snake_case (DB) → camelCase (domínio).
import { supabase } from '../lib/supabaseClient';
import type {
  Asset,
  AssetDetail,
  AssetSummary,
  Category,
  Platform,
  AssetLink,
  AssetFile,
  ChangelogEntry,
  AssetScreenshot,
  AssetChecklistRow,
  AssetUpdate,
  AssetAnalytics,
  KitTranslation,
} from '../types';

/** Tradução pública de um Kit para um idioma (asset_translations). Null se não houver. */
export async function getAssetTranslation(assetId: string, language: string): Promise<KitTranslation | null> {
  const { data, error } = await supabase
    .from('asset_translations')
    .select('name, short_description, full_description, prompt_content')
    .eq('asset_id', assetId)
    .eq('language', language)
    .maybeSingle();
  if (error || !data) return null;
  const r = data as Record<string, unknown>;
  return {
    name: (r.name as string) || undefined,
    shortDescription: (r.short_description as string) || undefined,
    fullDescription: (r.full_description as string) || undefined,
    promptContent: (r.prompt_content as string) || undefined,
  };
}

// ------------------------------------------------------------- Row types (DB)
interface AssetRow {
  id: string;
  workspace_id: string;
  slug: string;
  name: string;
  category_slug: string | null;
  short_description: string | null;
  full_description: string | null;
  status: AssetSummary['status'];
  version: string;
  level: AssetSummary['level'];
  license: Asset['license'];
  suggested_price: number | null;
  setup_time_minutes: number | null;
  difficulty: Asset['difficulty'] | null;
  cover_url: string | null;
  banner_url: string | null;
  mockup_url: string | null;
  logo_url?: string | null;
  video_youtube_url?: string | null;
  video_loom_url?: string | null;
  thumbnail_url?: string | null;
  preview_url?: string | null;
  prompt_content?: string | null;
  prompt_format?: string | null;
  parent_id: string | null;
  created_by: string | null;
  health_score: number;
  revenue_model: Asset['revenueModel'];
  time_to_publish_minutes: number | null;
  delivery_bundle: Asset['deliveryBundle'];
  created_at: string;
  updated_at: string;
  language?: string | null;
  niche?: string | null;
  categories?: { label: string } | { label: string }[] | null;
}

const toOne = <T>(rel: T | T[] | null | undefined): T | undefined =>
  Array.isArray(rel) ? rel[0] : rel ?? undefined;

const categoryLabel = (row: AssetRow): string =>
  toOne(row.categories)?.label ?? row.category_slug ?? '';

// ------------------------------------------------------------- Mappers
function mapSummary(row: AssetRow): AssetSummary {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: categoryLabel(row),
    shortDescription: row.short_description ?? undefined,
    status: row.status,
    version: row.version,
    level: row.level,
    healthScore: row.health_score,
    updatedAt: row.updated_at,
    coverUrl: row.cover_url ?? undefined,
    language: row.language ?? undefined,
    niche: row.niche ?? undefined,
  };
}

// ------------------------------------------------------------- Busca (Sprint 5)
export interface SearchableAsset extends AssetSummary {
  description?: string;
  tags: string[];
  ai: string[];
  platforms: string[];
  languages: string[];
  countries: string[];
  license: string;
  revenueModel: string;
  deliveryBundle: string;
}

/** Carrega os assets com os campos pesquisáveis para busca instantânea client-side. */
export async function listSearchableAssets(): Promise<SearchableAsset[]> {
  const { data, error } = await supabase
    .from('assets')
    // '*' mantém compatibilidade caso a migration 0005 (language/niche) ainda não tenha sido aplicada.
    .select(
      '*, categories(label), asset_tags(tags(label)), asset_ai_tools(ai_slug),' +
        ' asset_platforms(platform_slug), asset_languages(language_code),' +
        ' asset_countries(country_code), asset_files(count), asset_analytics(remixes, downloads)',
    )
    .in('status', ['active', 'updated'])
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return ((data ?? []) as unknown as Record<string, unknown>[]).map((r) => {
    const base = mapSummary(r as unknown as AssetRow);
    const arr = <T>(rel: unknown, pick: (x: Record<string, unknown>) => T): T[] =>
      ((rel ?? []) as Record<string, unknown>[]).map(pick);
    const filesRel = r.asset_files as { count: number }[] | undefined;
    const an = r.asset_analytics as { remixes?: number; downloads?: number } | { remixes?: number; downloads?: number }[] | undefined;
    const a0 = Array.isArray(an) ? an[0] : an;
    return {
      ...base,
      filesCount: filesRel?.[0]?.count ?? 0,
      remixes: Number(a0?.remixes ?? 0),
      downloads: Number(a0?.downloads ?? 0),
      description: (r.short_description as string) ?? undefined,
      tags: arr(r.asset_tags, (t) => {
        const tag = Array.isArray(t.tags) ? t.tags[0] : t.tags;
        return (tag as { label: string })?.label ?? '';
      }).filter(Boolean),
      ai: arr(r.asset_ai_tools, (a) => a.ai_slug as string),
      platforms: arr(r.asset_platforms, (p) => p.platform_slug as string),
      languages: arr(r.asset_languages, (l) => l.language_code as string),
      countries: arr(r.asset_countries, (c) => c.country_code as string),
      license: String(r.license ?? ''),
      revenueModel: String(r.revenue_model ?? ''),
      deliveryBundle: String(r.delivery_bundle ?? ''),
      suggestedPrice: r.suggested_price != null ? Number(r.suggested_price) : undefined,
    };
  });
}

// ------------------------------------------------------------- Dashboard stats (reais)
export interface DashboardStats { totalAssets: number; views: number; downloads: number; remixes: number; favorites: number; updates: number; }

export async function getDashboardStats(): Promise<DashboardStats> {
  const [assets, updated, analytics] = await Promise.all([
    supabase.from('assets').select('id', { count: 'exact', head: true }).in('status', ['active', 'updated']),
    supabase.from('assets').select('id', { count: 'exact', head: true }).eq('status', 'updated'),
    supabase.from('asset_analytics').select('views, downloads, remixes, favorites'),
  ]);
  const rows = (analytics.data ?? []) as { views: number; downloads: number; remixes: number; favorites: number }[];
  const sum = (k: 'views' | 'downloads' | 'remixes' | 'favorites') => rows.reduce((a, r) => a + (Number(r[k]) || 0), 0);
  return {
    totalAssets: assets.count ?? 0,
    views: sum('views'),
    downloads: sum('downloads'),
    remixes: sum('remixes'),
    favorites: sum('favorites'),
    updates: updated.count ?? 0,
  };
}

// ------------------------------------------------------------- Queries
const ASSET_COLUMNS = '*, categories(label)';

export async function listAssets(): Promise<AssetSummary[]> {
  const { data, error } = await supabase
    .from('assets')
    .select(ASSET_COLUMNS)
    .in('status', ['active', 'updated'])
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r) => mapSummary(r as AssetRow));
}

export async function getAssetDetail(slug: string): Promise<AssetDetail | null> {
  const { data: assetRow, error } = await supabase
    .from('assets')
    .select(ASSET_COLUMNS)
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  if (!assetRow) return null;
  const row = assetRow as AssetRow;
  const id = row.id;

  const [
    links, files, versions, screenshots, checklist, updates, analytics,
    tags, countries, languages, platforms, aiTools,
  ] = await Promise.all([
    supabase.from('asset_links').select('type, url, label').eq('asset_id', id),
    supabase.from('asset_files').select('*').eq('asset_id', id),
    supabase.from('asset_versions').select('*').eq('asset_id', id).order('released_at', { ascending: true }),
    supabase.from('asset_screenshots').select('*').eq('asset_id', id).order('position', { ascending: true }),
    supabase.from('asset_checklist').select('item, present, weight, ref_url').eq('asset_id', id),
    supabase.from('asset_updates').select('*').eq('asset_id', id).order('created_at', { ascending: false }),
    supabase.from('asset_analytics').select('*').eq('asset_id', id).maybeSingle(),
    supabase.from('asset_tags').select('tags(label)').eq('asset_id', id),
    supabase.from('asset_countries').select('country_code').eq('asset_id', id),
    supabase.from('asset_languages').select('language_code').eq('asset_id', id),
    supabase.from('asset_platforms').select('platforms(slug, label, kind)').eq('asset_id', id),
    supabase.from('asset_ai_tools').select('ai_slug').eq('asset_id', id),
  ]);

  const analyticsRow = (analytics.data ?? null) as Partial<AssetAnalytics> | null;

  const asset: Asset = {
    ...mapSummary(row),
    workspaceId: row.workspace_id,
    language: row.language ?? 'pt-BR',
    niche: row.niche ?? undefined,
    tags: ((tags.data ?? []) as { tags: { label: string } | { label: string }[] }[])
      .map((t) => toOne(t.tags)?.label ?? '')
      .filter(Boolean),
    fullDescription: row.full_description ?? undefined,
    license: row.license,
    suggestedPrice: row.suggested_price ?? undefined,
    setupTimeMinutes: row.setup_time_minutes ?? undefined,
    difficulty: row.difficulty ?? undefined,
    bannerUrl: row.banner_url ?? undefined,
    mockupUrl: row.mockup_url ?? undefined,
    logoUrl: row.logo_url ?? undefined,
    videoYoutubeUrl: row.video_youtube_url ?? undefined,
    videoLoomUrl: row.video_loom_url ?? undefined,
    thumbnailUrl: row.thumbnail_url ?? undefined,
    previewUrl: row.preview_url ?? undefined,
    promptContent: row.prompt_content ?? undefined,
    promptFormat: row.prompt_format ?? undefined,
    parentId: row.parent_id,
    createdBy: row.created_by,
    createdAt: row.created_at,
    revenueModel: row.revenue_model,
    timeToPublishMinutes: row.time_to_publish_minutes ?? undefined,
    deliveryBundle: row.delivery_bundle,
    targetCountries: ((countries.data ?? []) as { country_code: string }[]).map((c) => c.country_code),
    languages: ((languages.data ?? []) as { language_code: string }[]).map((l) => l.language_code),
    platforms: ((platforms.data ?? []) as { platforms: Platform | Platform[] }[])
      .map((p) => toOne(p.platforms))
      .filter((p): p is Platform => Boolean(p)),
    buildAiTools: ((aiTools.data ?? []) as { ai_slug: string }[]).map((a) => a.ai_slug),
  };

  return {
    ...asset,
    links: (links.data ?? []) as AssetLink[],
    files: mapFiles(files.data ?? []),
    versions: mapVersions(versions.data ?? []),
    screenshots: (screenshots.data ?? []) as AssetScreenshot[],
    checklist: mapChecklist(checklist.data ?? []),
    updates: mapUpdates(updates.data ?? []),
    analytics: {
      views: analyticsRow?.views ?? 0,
      downloads: analyticsRow?.downloads ?? 0,
      remixes: analyticsRow?.remixes ?? 0,
      favorites: analyticsRow?.favorites ?? 0,
      opens: analyticsRow?.opens ?? 0,
      shares: analyticsRow?.shares ?? 0,
    },
  };
}

export async function listCategories(): Promise<Category[]> {
  const { data, error } = await supabase.from('categories').select('*').order('label');
  if (error) throw error;
  return ((data ?? []) as { slug: string; label: string; icon: string | null; parent_slug: string | null }[]).map(
    (c) => ({ slug: c.slug, label: c.label, icon: c.icon ?? undefined, parentSlug: c.parent_slug }),
  );
}

export async function listPlatforms(): Promise<Platform[]> {
  const { data, error } = await supabase.from('platforms').select('*').order('label');
  if (error) throw error;
  return (data ?? []) as Platform[];
}

// ------------------------------------------------------------- Mappers auxiliares
function mapFiles(rows: unknown[]): AssetFile[] {
  return (rows as {
    id: string; kind: string | null; name: string; format: string | null;
    url: string | null; drive_folder: string | null; size_bytes: number | null;
  }[]).map((r) => ({
    id: r.id, kind: r.kind ?? undefined, name: r.name, format: r.format ?? undefined,
    url: r.url ?? undefined, driveFolder: r.drive_folder ?? undefined, sizeBytes: r.size_bytes ?? undefined,
  }));
}

function mapVersions(rows: unknown[]): ChangelogEntry[] {
  return (rows as {
    id: string; version: string; notes: string | null; released_at: string; is_current: boolean;
  }[]).map((r) => ({
    id: r.id, version: r.version, notes: r.notes ?? undefined, releasedAt: r.released_at, isCurrent: r.is_current,
  }));
}

function mapChecklist(rows: unknown[]): AssetChecklistRow[] {
  return (rows as { item: AssetChecklistRow['item']; present: boolean; weight: number; ref_url: string | null }[])
    .map((r) => ({ item: r.item, present: r.present, weight: r.weight, refUrl: r.ref_url ?? undefined }));
}

function mapUpdates(rows: unknown[]): AssetUpdate[] {
  return (rows as {
    id: string; type: AssetUpdate['type']; title: string; description: string | null;
    created_at: string; version_id: string | null;
  }[]).map((r) => ({
    id: r.id, type: r.type, title: r.title, description: r.description ?? undefined,
    createdAt: r.created_at, versionId: r.version_id,
  }));
}
