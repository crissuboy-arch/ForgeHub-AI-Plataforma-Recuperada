// src/data/adminAssets.ts
// Camada de dados do Admin Asset Studio (Sprint 4) — CRUD real no Supabase.
import { supabase } from '../lib/supabaseClient';
import type { AiTool, Platform, Tag, Category, KitTranslation } from '../types';
import { LINK_FIELDS, CHECKLIST_ITEMS, emptyFormValues, type AssetFormValues } from '../lib/assetSchema';

// ------------------------------------------------------------- Lookups reais
export async function listCategories(): Promise<Category[]> {
  const { data, error } = await supabase.from('categories').select('*').order('label');
  if (error) throw error;
  return ((data ?? []) as { slug: string; label: string; icon: string | null; parent_slug: string | null }[]).map(
    (c) => ({ slug: c.slug, label: c.label, icon: c.icon ?? undefined, parentSlug: c.parent_slug }),
  );
}
export async function listPlatforms(): Promise<Platform[]> {
  const { data, error } = await supabase.from('platforms').select('*').order('kind').order('label');
  if (error) throw error;
  return (data ?? []) as Platform[];
}
export async function listAiTools(): Promise<AiTool[]> {
  const { data, error } = await supabase.from('ai_tools').select('*').order('label');
  if (error) throw error;
  return (data ?? []) as AiTool[];
}
export async function listTags(): Promise<Tag[]> {
  const { data, error } = await supabase.from('tags').select('*').order('label');
  if (error) throw error;
  return (data ?? []) as Tag[];
}
export async function listNiches(): Promise<import('../types').Niche[]> {
  const { data, error } = await supabase.from('niches').select('*').order('position');
  if (error) return []; // resiliente: se a migration 0005 ainda não foi aplicada
  return ((data ?? []) as { slug: string; label: string; icon: string | null; position: number }[]).map((n) => ({
    slug: n.slug, label: n.label, icon: n.icon ?? undefined, position: n.position,
  }));
}

export type AdminAssetRow = {
  id: string; slug: string; name: string; status: string; level: string; healthScore: number; updatedAt: string;
};

export async function listAllAssets(): Promise<AdminAssetRow[]> {
  const { data, error } = await supabase
    .from('assets')
    .select('id, slug, name, status, level, health_score, updated_at')
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return ((data ?? []) as Record<string, unknown>[]).map((r) => ({
    id: String(r.id), slug: String(r.slug), name: String(r.name), status: String(r.status),
    level: String(r.level), healthScore: Number(r.health_score), updatedAt: String(r.updated_at),
  }));
}

async function getDefaultWorkspaceId(): Promise<string> {
  const { data, error } = await supabase.from('workspaces').select('id').limit(1).maybeSingle();
  if (error) throw error;
  if (!data) throw new Error('Nenhum workspace encontrado. Aplique o seed do Supabase.');
  return (data as { id: string }).id;
}

const slugify = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

// ------------------------------------------------------------- Carregar p/ edição
export async function getAssetForEdit(
  slug: string,
): Promise<{ id: string; values: AssetFormValues } | null> {
  const { data, error } = await supabase.from('assets').select('*').eq('slug', slug).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const row = data as Record<string, unknown>;
  const id = row.id as string;

  const [links, platforms, ai, countries, languages, tags, files, screenshots, checklist] = await Promise.all([
    supabase.from('asset_links').select('type, url').eq('asset_id', id),
    supabase.from('asset_platforms').select('platform_slug').eq('asset_id', id),
    supabase.from('asset_ai_tools').select('ai_slug').eq('asset_id', id),
    supabase.from('asset_countries').select('country_code').eq('asset_id', id),
    supabase.from('asset_languages').select('language_code').eq('asset_id', id),
    supabase.from('asset_tags').select('tags(label)').eq('asset_id', id),
    supabase.from('asset_files').select('*').eq('asset_id', id),
    supabase.from('asset_screenshots').select('*').eq('asset_id', id).order('position'),
    supabase.from('asset_checklist').select('item, present').eq('asset_id', id),
  ]);

  const values = emptyFormValues();
  const str = (k: string) => (row[k] == null ? '' : String(row[k]));
  const num = (k: string) => (row[k] == null ? null : Number(row[k]));

  values.name = str('name');
  values.slug = str('slug');
  values.category = str('category_slug');
  values.language = (str('language') || 'pt-BR') as AssetFormValues['language'];
  values.niche = str('niche');
  values.shortDescription = str('short_description');
  values.fullDescription = str('full_description');
  values.level = (row.level as AssetFormValues['level']) ?? 'starter';
  values.status = (row.status as AssetFormValues['status']) ?? 'draft';
  values.license = (row.license as AssetFormValues['license']) ?? 'comercial';
  values.revenueModel = (row.revenue_model as AssetFormValues['revenueModel']) ?? 'one_time';
  values.deliveryBundle = (row.delivery_bundle as AssetFormValues['deliveryBundle']) ?? 'solo';
  values.setupTimeMinutes = num('setup_time_minutes');
  values.timeToPublishMinutes = num('time_to_publish_minutes');
  values.suggestedPrice = num('suggested_price');
  values.coverUrl = str('cover_url');
  values.bannerUrl = str('banner_url');
  values.logoUrl = str('logo_url');
  values.thumbnailUrl = str('thumbnail_url');
  values.previewUrl = str('preview_url');
  values.mockupUrl = str('mockup_url');
  values.videoYoutubeUrl = str('video_youtube_url');
  values.videoLoomUrl = str('video_loom_url');
  values.promptContent = str('prompt_content');
  values.promptFormat = (row.prompt_format as AssetFormValues['promptFormat']) ?? 'markdown';

  ((links.data ?? []) as { type: string; url: string }[]).forEach((l) => {
    if (l.type in values.links) (values.links as Record<string, string>)[l.type] = l.url;
  });
  values.platforms = ((platforms.data ?? []) as { platform_slug: string }[]).map((p) => p.platform_slug);
  values.aiTools = ((ai.data ?? []) as { ai_slug: string }[]).map((a) => a.ai_slug);
  values.countries = ((countries.data ?? []) as { country_code: string }[]).map((c) => c.country_code);
  values.languages = ((languages.data ?? []) as { language_code: string }[]).map((l) => l.language_code);
  values.tags = ((tags.data ?? []) as { tags: { label: string } | { label: string }[] }[])
    .map((t) => (Array.isArray(t.tags) ? t.tags[0]?.label : t.tags?.label) ?? '')
    .filter(Boolean);
  values.files = ((files.data ?? []) as Record<string, unknown>[]).map((f) => ({
    name: String(f.name ?? ''), kind: f.kind ? String(f.kind) : '',
    sizeBytes: f.size_bytes == null ? null : Number(f.size_bytes),
    url: f.url ? String(f.url) : '', driveFolder: f.drive_folder ? String(f.drive_folder) : '',
  }));
  values.screenshots = ((screenshots.data ?? []) as Record<string, unknown>[]).map((s, i) => ({
    url: s.url ? String(s.url) : '', caption: s.caption ? String(s.caption) : '',
    position: s.position == null ? i : Number(s.position),
  }));
  ((checklist.data ?? []) as { item: string; present: boolean }[]).forEach((c) => {
    if (c.item in values.checklist) (values.checklist as Record<string, boolean>)[c.item] = c.present;
  });

  return { id, values };
}

// ------------------------------------------------------------- Salvar (create/update)
async function ensureTagIds(labels: string[]): Promise<string[]> {
  if (labels.length === 0) return [];
  const rows = labels.map((label) => ({ slug: slugify(label), label }));
  const { error } = await supabase.from('tags').upsert(rows, { onConflict: 'slug', ignoreDuplicates: true });
  if (error) throw error;
  const slugs = rows.map((r) => r.slug);
  const { data, error: e2 } = await supabase.from('tags').select('id, slug').in('slug', slugs);
  if (e2) throw e2;
  return ((data ?? []) as { id: string }[]).map((t) => t.id);
}

async function replaceRows(table: string, assetId: string, rows: Record<string, unknown>[]) {
  const del = await supabase.from(table).delete().eq('asset_id', assetId);
  if (del.error) throw del.error;
  if (rows.length > 0) {
    const ins = await supabase.from(table).insert(rows);
    if (ins.error) throw ins.error;
  }
}

export async function saveAsset(
  values: AssetFormValues,
  opts: { id?: string; publish?: boolean } = {},
): Promise<{ id: string; slug: string }> {
  const status = opts.publish ? 'active' : values.status;
  const assetRow = {
    slug: values.slug,
    name: values.name,
    category_slug: values.category || null,
    language: values.language || 'pt-BR',
    niche: values.niche || null,
    short_description: values.shortDescription || null,
    full_description: values.fullDescription || null,
    status,
    level: values.level,
    license: values.license,
    revenue_model: values.revenueModel,
    delivery_bundle: values.deliveryBundle,
    setup_time_minutes: values.setupTimeMinutes,
    time_to_publish_minutes: values.timeToPublishMinutes,
    suggested_price: values.suggestedPrice,
    cover_url: values.coverUrl || null,
    banner_url: values.bannerUrl || null,
    logo_url: values.logoUrl || null,
    thumbnail_url: values.thumbnailUrl || null,
    preview_url: values.previewUrl || null,
    mockup_url: values.mockupUrl || null,
    video_youtube_url: values.videoYoutubeUrl || null,
    video_loom_url: values.videoLoomUrl || null,
    prompt_content: values.promptContent || null,
    prompt_format: values.promptFormat || 'markdown',
  };

  let id = opts.id;
  if (id) {
    const { error } = await supabase.from('assets').update(assetRow).eq('id', id);
    if (error) throw error;
  } else {
    const workspace_id = await getDefaultWorkspaceId();
    const { data, error } = await supabase
      .from('assets')
      .insert({ ...assetRow, workspace_id })
      .select('id')
      .single();
    if (error) throw error;
    id = (data as { id: string }).id;
  }
  const assetId = id!;

  // Relações (delete + insert)
  const linkRows = LINK_FIELDS
    .filter((l) => (values.links[l.key] ?? '').trim() !== '')
    .map((l) => ({ asset_id: assetId, type: l.key, url: values.links[l.key] }));
  await replaceRows('asset_links', assetId, linkRows);

  await replaceRows('asset_platforms', assetId, values.platforms.map((platform_slug) => ({ asset_id: assetId, platform_slug })));
  await replaceRows('asset_ai_tools', assetId, values.aiTools.map((ai_slug) => ({ asset_id: assetId, ai_slug })));
  await replaceRows('asset_countries', assetId, values.countries.map((country_code) => ({ asset_id: assetId, country_code })));
  await replaceRows('asset_languages', assetId, values.languages.map((language_code) => ({ asset_id: assetId, language_code })));

  const tagIds = await ensureTagIds(values.tags);
  await replaceRows('asset_tags', assetId, tagIds.map((tag_id) => ({ asset_id: assetId, tag_id })));

  await replaceRows('asset_files', assetId, values.files.map((f) => ({
    asset_id: assetId, name: f.name, kind: f.kind || null,
    size_bytes: f.sizeBytes, url: f.url || null, drive_folder: f.driveFolder || null,
  })));

  await replaceRows('asset_screenshots', assetId, values.screenshots
    .filter((s) => (s.url ?? '').trim() !== '')
    .map((s, i) => ({ asset_id: assetId, url: s.url, caption: s.caption || null, position: i })));

  // Checklist (12 itens) — dispara o recálculo do Health Score no banco
  await replaceRows('asset_checklist', assetId, CHECKLIST_ITEMS.map((c) => ({
    asset_id: assetId, item: c.key, present: values.checklist[c.key] ?? false,
  })));

  return { id: assetId, slug: values.slug };
}

export async function deleteAsset(id: string): Promise<void> {
  const { error } = await supabase.from('assets').delete().eq('id', id);
  if (error) throw error;
}

// ------------------------------------------------------------- Traduções do Kit (item 2)
export async function getAssetTranslations(assetId: string): Promise<Record<string, KitTranslation>> {
  const { data, error } = await supabase.from('asset_translations').select('*').eq('asset_id', assetId);
  if (error) throw error;
  const out: Record<string, KitTranslation> = {};
  ((data ?? []) as Record<string, unknown>[]).forEach((r) => {
    out[r.language as string] = {
      name: (r.name as string) ?? '',
      shortDescription: (r.short_description as string) ?? '',
      fullDescription: (r.full_description as string) ?? '',
      promptContent: (r.prompt_content as string) ?? '',
    };
  });
  return out;
}

const trFilled = (v?: KitTranslation) =>
  Boolean(v && (v.name || v.shortDescription || v.fullDescription || v.promptContent));

export async function saveAssetTranslations(
  assetId: string,
  translations: Record<string, KitTranslation>,
): Promise<void> {
  const rows = Object.entries(translations)
    .filter(([, v]) => trFilled(v))
    .map(([language, v]) => ({
      asset_id: assetId,
      language,
      name: v.name || null,
      short_description: v.shortDescription || null,
      full_description: v.fullDescription || null,
      prompt_content: v.promptContent || null,
    }));
  // idiomas esvaziados pelo admin → remover
  const emptyLangs = Object.entries(translations).filter(([, v]) => !trFilled(v)).map(([l]) => l);
  if (emptyLangs.length) {
    await supabase.from('asset_translations').delete().eq('asset_id', assetId).in('language', emptyLangs);
  }
  if (rows.length) {
    const { error } = await supabase.from('asset_translations').upsert(rows, { onConflict: 'asset_id,language' });
    if (error) throw error;
  }
}

export async function duplicateAsset(slug: string): Promise<{ slug: string } | null> {
  const loaded = await getAssetForEdit(slug);
  if (!loaded) return null;
  const copy = { ...loaded.values };
  copy.name = `${copy.name} (cópia)`;
  copy.slug = `${copy.slug}-copia-${Math.floor(performance.now())}`.replace(/\.+/g, '');
  copy.status = 'draft';
  const res = await saveAsset(copy, {});
  // copia as traduções do Kit original para a cópia (remix seguro completo)
  try {
    const trs = await getAssetTranslations(loaded.id);
    if (Object.keys(trs).length) await saveAssetTranslations(res.id, trs);
  } catch {
    /* traduções são best-effort na duplicação */
  }
  return { slug: res.slug };
}
