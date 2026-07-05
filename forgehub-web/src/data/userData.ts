// src/data/userData.ts — Favoritos, Recentes e Configurações (Supabase real).
import { supabase } from '../lib/supabaseClient';
import type { AssetSummary, UserSettings } from '../types';

const SUMMARY_COLS =
  'id, slug, name, short_description, status, level, health_score, updated_at, cover_url, categories(label)';

type SummaryRow = {
  id: string; slug: string; name: string; short_description: string | null;
  status: AssetSummary['status']; level: AssetSummary['level']; health_score: number;
  updated_at: string; cover_url: string | null;
  categories?: { label: string } | { label: string }[] | null;
};

function rowToSummary(a: SummaryRow): AssetSummary {
  const cat = Array.isArray(a.categories) ? a.categories[0] : a.categories;
  return {
    id: a.id, slug: a.slug, name: a.name, category: cat?.label ?? '',
    shortDescription: a.short_description ?? undefined, status: a.status, version: '',
    level: a.level, healthScore: a.health_score, updatedAt: a.updated_at,
    coverUrl: a.cover_url ?? undefined,
  };
}

async function uid(): Promise<string | null> {
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

// ---------------------------------------------------------------- Favoritos
export async function listFavoriteIds(): Promise<string[]> {
  const u = await uid();
  if (!u) return [];
  const { data, error } = await supabase.from('favorite_assets').select('asset_id').eq('user_id', u);
  if (error) throw error;
  return ((data ?? []) as { asset_id: string }[]).map((r) => r.asset_id);
}

export async function toggleFavorite(assetId: string): Promise<boolean> {
  const u = await uid();
  if (!u) throw new Error('Faça login para favoritar.');
  const { data } = await supabase.from('favorite_assets').select('asset_id').eq('user_id', u).eq('asset_id', assetId).maybeSingle();
  if (data) {
    const { error } = await supabase.from('favorite_assets').delete().eq('user_id', u).eq('asset_id', assetId);
    if (error) throw error;
    return false;
  }
  const { error } = await supabase.from('favorite_assets').insert({ user_id: u, asset_id: assetId });
  if (error) throw error;
  return true;
}

export async function listFavorites(): Promise<AssetSummary[]> {
  const u = await uid();
  if (!u) return [];
  const { data, error } = await supabase.from('favorite_assets').select(`asset:assets(${SUMMARY_COLS})`).eq('user_id', u);
  if (error) throw error;
  return ((data ?? []) as { asset: SummaryRow | SummaryRow[] }[])
    .map((r) => (Array.isArray(r.asset) ? r.asset[0] : r.asset))
    .filter(Boolean)
    .map(rowToSummary);
}

// ---------------------------------------------------------------- Recentes
export async function recordRecent(assetId: string): Promise<void> {
  const u = await uid();
  if (!u) return; // silencioso se não autenticado
  await supabase.from('recent_assets').upsert(
    { user_id: u, asset_id: assetId, opened_at: new Date().toISOString() },
    { onConflict: 'user_id,asset_id' },
  );
}

export async function listRecents(limit = 8): Promise<AssetSummary[]> {
  const u = await uid();
  if (!u) return [];
  const { data, error } = await supabase
    .from('recent_assets')
    .select(`opened_at, asset:assets(${SUMMARY_COLS})`)
    .eq('user_id', u)
    .order('opened_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return ((data ?? []) as { asset: SummaryRow | SummaryRow[] }[])
    .map((r) => (Array.isArray(r.asset) ? r.asset[0] : r.asset))
    .filter(Boolean)
    .map(rowToSummary);
}

// ---------------------------------------------------------------- Configurações
export async function getSettings(): Promise<UserSettings | null> {
  const { data, error } = await supabase.from('user_settings').select('*').maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const r = data as Record<string, unknown>;
  return {
    fullName: (r.full_name as string) ?? undefined,
    avatarUrl: (r.avatar_url as string) ?? undefined,
    theme: (r.theme as string) ?? 'dark',
    language: (r.language as string) ?? 'pt',
    workspace: (r.workspace as string) ?? undefined,
    role: (r.role as UserSettings['role']) ?? 'aluno',
    preferences: (r.preferences as Record<string, unknown>) ?? {},
  };
}

export async function saveSettings(s: Partial<UserSettings>): Promise<void> {
  const u = await uid();
  if (!u) throw new Error('Faça login para salvar.');
  // Parcial-seguro: grava apenas os campos fornecidos (não zera os demais).
  const payload: Record<string, unknown> = { user_id: u, updated_at: new Date().toISOString() };
  if (s.fullName !== undefined) payload.full_name = s.fullName ?? null;
  if (s.avatarUrl !== undefined) payload.avatar_url = s.avatarUrl ?? null;
  if (s.theme !== undefined) payload.theme = s.theme;
  if (s.language !== undefined) payload.language = s.language;
  if (s.workspace !== undefined) payload.workspace = s.workspace ?? null;
  if (s.preferences !== undefined) payload.preferences = s.preferences;
  const { error } = await supabase.from('user_settings').upsert(payload, { onConflict: 'user_id' });
  if (error) throw error;
}
