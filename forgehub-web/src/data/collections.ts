// src/data/collections.ts — Coleções (Supabase real). Superfície: seletor na página Assets.
import { supabase } from '../lib/supabaseClient';
import type { AssetSummary, Collection } from '../types';

const SUMMARY_COLS =
  'id, slug, name, short_description, status, level, health_score, updated_at, cover_url, categories(label)';

const slugify = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

type SummaryRow = {
  id: string; slug: string; name: string; short_description: string | null;
  status: AssetSummary['status']; level: AssetSummary['level']; health_score: number;
  updated_at: string; cover_url: string | null; categories?: { label: string } | { label: string }[] | null;
};
const toSummary = (a: SummaryRow): AssetSummary => {
  const cat = Array.isArray(a.categories) ? a.categories[0] : a.categories;
  return {
    id: a.id, slug: a.slug, name: a.name, category: cat?.label ?? '',
    shortDescription: a.short_description ?? undefined, status: a.status, version: '',
    level: a.level, healthScore: a.health_score, updatedAt: a.updated_at, coverUrl: a.cover_url ?? undefined,
  };
};

export async function listCollections(): Promise<Collection[]> {
  const { data, error } = await supabase
    .from('collections')
    .select('id, name, slug, collection_assets(count)')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return ((data ?? []) as { id: string; name: string; slug: string; collection_assets?: { count: number }[] }[]).map((c) => ({
    id: c.id, name: c.name, slug: c.slug, count: c.collection_assets?.[0]?.count ?? 0,
  }));
}

export async function createCollection(name: string): Promise<Collection> {
  const { data, error } = await supabase
    .from('collections')
    .insert({ name, slug: slugify(name) })
    .select('id, name, slug')
    .single();
  if (error) throw error;
  const c = data as { id: string; name: string; slug: string };
  return { id: c.id, name: c.name, slug: c.slug, count: 0 };
}

export async function deleteCollection(id: string): Promise<void> {
  const { error } = await supabase.from('collections').delete().eq('id', id);
  if (error) throw error;
}

export async function addToCollection(collectionId: string, assetId: string): Promise<void> {
  const { error } = await supabase
    .from('collection_assets')
    .upsert({ collection_id: collectionId, asset_id: assetId }, { onConflict: 'collection_id,asset_id' });
  if (error) throw error;
}

export async function removeFromCollection(collectionId: string, assetId: string): Promise<void> {
  const { error } = await supabase
    .from('collection_assets')
    .delete()
    .eq('collection_id', collectionId)
    .eq('asset_id', assetId);
  if (error) throw error;
}

export async function reorderCollection(collectionId: string, orderedAssetIds: string[]): Promise<void> {
  await Promise.all(
    orderedAssetIds.map((asset_id, position) =>
      supabase.from('collection_assets').update({ position }).eq('collection_id', collectionId).eq('asset_id', asset_id),
    ),
  );
}

export async function getCollectionAssets(collectionId: string): Promise<AssetSummary[]> {
  const { data, error } = await supabase
    .from('collection_assets')
    .select(`position, asset:assets(${SUMMARY_COLS})`)
    .eq('collection_id', collectionId)
    .order('position', { ascending: true });
  if (error) throw error;
  return ((data ?? []) as { asset: SummaryRow | SummaryRow[] }[])
    .map((r) => (Array.isArray(r.asset) ? r.asset[0] : r.asset))
    .filter(Boolean)
    .map(toSummary);
}
