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
} from '../types';

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
  parent_id: string | null;
  created_by: string | null;
  health_score: number;
  revenue_model: Asset['revenueModel'];
  time_to_publish_minutes: number | null;
  delivery_bundle: Asset['deliveryBundle'];
  created_at: string;
  updated_at: string;
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
