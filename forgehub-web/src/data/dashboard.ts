// src/data/dashboard.ts — Dados reais para o Dashboard premium (Sprint 5.5).
// Não altera banco/arquitetura: apenas lê tabelas existentes e agrega.
import { supabase } from '../lib/supabaseClient';

// ------------------------------------------------------------- Série 30 dias
export interface ActivityPoint { label: string; aberturas: number; criacoes: number; atualizacoes: number; }

const dayKey = (iso: string) => iso.slice(0, 10);

export async function getActivitySeries(days = 30): Promise<ActivityPoint[]> {
  const [created, updates, versions, opens] = await Promise.all([
    supabase.from('assets').select('created_at'),
    supabase.from('asset_updates').select('created_at'),
    supabase.from('asset_versions').select('released_at'),
    supabase.from('recent_assets').select('opened_at'),
  ]);

  // buckets dos últimos N dias
  const buckets = new Map<string, ActivityPoint>();
  const order: string[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    order.push(key);
    buckets.set(key, {
      label: `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`,
      aberturas: 0, criacoes: 0, atualizacoes: 0,
    });
  }
  const bump = (rows: unknown[], field: string, metric: keyof ActivityPoint) => {
    (rows as Record<string, unknown>[]).forEach((r) => {
      const v = r[field];
      if (typeof v !== 'string') return;
      const b = buckets.get(dayKey(v));
      if (b && metric !== 'label') (b[metric] as number) += 1;
    });
  };
  bump(opens.data ?? [], 'opened_at', 'aberturas');
  bump(created.data ?? [], 'created_at', 'criacoes');
  bump(updates.data ?? [], 'created_at', 'atualizacoes');
  bump(versions.data ?? [], 'released_at', 'atualizacoes');

  return order.map((k) => buckets.get(k)!);
}

// ------------------------------------------------------------- Top Assets
export type TopMetric = 'views' | 'downloads' | 'remixes' | 'health';
export interface TopAsset {
  name: string; slug: string; category: string; health: number;
  views: number; downloads: number; remixes: number;
}

export async function getTopAssets(): Promise<TopAsset[]> {
  const { data, error } = await supabase
    .from('assets')
    .select('name, slug, health_score, categories(label), asset_analytics(views, downloads, remixes)')
    .in('status', ['active', 'updated']);
  if (error) throw error;
  return ((data ?? []) as Record<string, unknown>[]).map((r) => {
    const cat = Array.isArray(r.categories) ? r.categories[0] : r.categories;
    const a = (Array.isArray(r.asset_analytics) ? r.asset_analytics[0] : r.asset_analytics) as
      | { views?: number; downloads?: number; remixes?: number } | undefined;
    return {
      name: String(r.name), slug: String(r.slug),
      category: (cat as { label?: string })?.label ?? '',
      health: Number(r.health_score) || 0,
      views: a?.views ?? 0, downloads: a?.downloads ?? 0, remixes: a?.remixes ?? 0,
    };
  });
}

// ------------------------------------------------------------- Atividade recente
export interface ActivityItem { type: string; text: string; date: string; icon: string; tone: 'primary' | 'success' | 'gold' | 'cyan'; }

const nameOf = (rel: unknown): string => {
  const a = Array.isArray(rel) ? rel[0] : rel;
  return (a as { name?: string })?.name ?? 'Asset';
};

export async function getRecentActivity(limit = 8): Promise<ActivityItem[]> {
  const [assets, updates, versions, favs, colls] = await Promise.all([
    supabase.from('assets').select('name, created_at').order('created_at', { ascending: false }).limit(6),
    supabase.from('asset_updates').select('title, created_at, assets(name)').order('created_at', { ascending: false }).limit(6),
    supabase.from('asset_versions').select('version, released_at, assets(name)').order('released_at', { ascending: false }).limit(6),
    supabase.from('favorite_assets').select('created_at, assets(name)').order('created_at', { ascending: false }).limit(6),
    supabase.from('collections').select('name, created_at').order('created_at', { ascending: false }).limit(6),
  ]);

  const items: ActivityItem[] = [];
  ((assets.data ?? []) as Record<string, unknown>[]).forEach((r) =>
    items.push({ type: 'create', text: `Asset criado: ${r.name}`, date: String(r.created_at), icon: 'plus', tone: 'primary' }));
  ((updates.data ?? []) as Record<string, unknown>[]).forEach((r) =>
    items.push({ type: 'update', text: `Novidade em ${nameOf(r.assets)}: ${r.title}`, date: String(r.created_at), icon: 'sparkles', tone: 'cyan' }));
  ((versions.data ?? []) as Record<string, unknown>[]).forEach((r) =>
    items.push({ type: 'version', text: `${nameOf(r.assets)} — versão ${r.version}`, date: String(r.released_at), icon: 'clipboard', tone: 'primary' }));
  ((favs.data ?? []) as Record<string, unknown>[]).forEach((r) =>
    items.push({ type: 'favorite', text: `Favoritou ${nameOf(r.assets)}`, date: String(r.created_at), icon: 'favorite-solid', tone: 'gold' }));
  ((colls.data ?? []) as Record<string, unknown>[]).forEach((r) =>
    items.push({ type: 'collection', text: `Coleção criada: ${r.name}`, date: String(r.created_at), icon: 'stack', tone: 'success' }));

  return items
    .filter((i) => i.date && i.date !== 'null')
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, limit);
}
