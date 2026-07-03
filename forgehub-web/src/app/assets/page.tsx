'use client';
// src/app/assets/page.tsx — Biblioteca com BUSCA real (P7) e COLEÇÕES (P8).
import { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '../../components/molecules/PageHeader';
import { Badge } from '../../components/atoms/Badge';
import { Icon } from '../../components/atoms/Icon';
import { Typography } from '../../components/atoms/Typography';
import { AssetGrid } from '../../components/organisms/AssetGrid';
import { listSearchableAssets, type SearchableAsset } from '../../data/assets';
import {
  listCollections, createCollection, deleteCollection,
  getCollectionAssets, removeFromCollection, reorderCollection,
} from '../../data/collections';
import type { AssetSummary } from '../../types';

function haystack(a: AssetSummary | SearchableAsset): string {
  const s = a as Partial<SearchableAsset>;
  return [
    a.name, a.slug, a.category, a.status, a.level,
    s.description, s.license, s.revenueModel, s.deliveryBundle,
    ...(s.tags ?? []), ...(s.ai ?? []), ...(s.platforms ?? []),
    ...(s.languages ?? []), ...(s.countries ?? []), String(a.healthScore),
  ].filter(Boolean).join(' ').toLowerCase();
}

export default function AssetsPage() {
  const qc = useQueryClient();
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('Todos');
  const [collectionId, setCollectionId] = useState<string | null>(null);

  const all = useQuery({ queryKey: ['search-assets'], queryFn: listSearchableAssets });
  const collections = useQuery({ queryKey: ['collections'], queryFn: listCollections });
  const collectionAssets = useQuery({
    queryKey: ['collection-assets', collectionId],
    queryFn: () => getCollectionAssets(collectionId as string),
    enabled: Boolean(collectionId),
  });

  const categories = useMemo(() => {
    const set = new Set((all.data ?? []).map((a) => a.category).filter(Boolean));
    return ['Todos', ...Array.from(set)];
  }, [all.data]);

  const filtered = useMemo(() => {
    const base: (AssetSummary | SearchableAsset)[] = collectionId ? collectionAssets.data ?? [] : all.data ?? [];
    const t = q.trim().toLowerCase();
    return base.filter((a) => {
      if (category !== 'Todos' && a.category !== category) return false;
      if (!t) return true;
      return haystack(a).includes(t);
    });
  }, [collectionId, collectionAssets.data, all.data, q, category]);

  const refreshCollections = () => qc.invalidateQueries({ queryKey: ['collections'] });
  const refreshCollAssets = () => qc.invalidateQueries({ queryKey: ['collection-assets', collectionId] });

  const onNewCollection = async () => {
    const name = window.prompt('Nome da nova coleção:');
    if (!name?.trim()) return;
    try { await createCollection(name.trim()); refreshCollections(); }
    catch (e) { window.alert(e instanceof Error ? e.message : String(e)); }
  };
  const onDeleteCollection = async (id: string) => {
    if (!window.confirm('Excluir esta coleção?')) return;
    await deleteCollection(id);
    if (collectionId === id) setCollectionId(null);
    refreshCollections();
  };
  const onRemove = async (assetId: string) => {
    if (!collectionId) return;
    await removeFromCollection(collectionId, assetId);
    refreshCollAssets();
  };
  const onMove = async (index: number, dir: -1 | 1) => {
    const items = collectionAssets.data ?? [];
    const j = index + dir;
    if (j < 0 || j >= items.length) return;
    const ids = items.map((a) => a.id);
    [ids[index], ids[j]] = [ids[j], ids[index]];
    await reorderCollection(collectionId as string, ids);
    refreshCollAssets();
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <PageHeader title="Assets" subtitle="Sua biblioteca de ativos digitais inteligentes." />

      {/* Busca real */}
      <div className="mb-6 flex flex-col gap-3">
        <div className="flex h-11 items-center gap-2 rounded-interactive border border-border bg-surface px-3">
          <Icon name="search" size={18} className="text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nome, categoria, tag, IA, plataforma, idioma, país…"
            className="h-full flex-1 bg-transparent text-sm text-content placeholder:text-muted focus:outline-none"
          />
          {q && <button onClick={() => setQ('')} className="text-muted hover:text-content"><Icon name="x" size={16} /></button>}
        </div>

        {/* Categorias */}
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button key={c} type="button" onClick={() => setCategory(c)}>
              <Badge tone={c === category ? 'primary' : 'default'}>{c}</Badge>
            </button>
          ))}
        </div>

        {/* Coleções */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-wide text-muted">Coleções:</span>
          <button type="button" onClick={() => setCollectionId(null)}>
            <Badge tone={collectionId === null ? 'primary' : 'default'}>Todas</Badge>
          </button>
          {(collections.data ?? []).map((col) => (
            <span key={col.id} className="inline-flex items-center gap-1">
              <button type="button" onClick={() => setCollectionId(col.id)}>
                <Badge tone={collectionId === col.id ? 'primary' : 'default'}>{col.name} · {col.count ?? 0}</Badge>
              </button>
              <button type="button" onClick={() => onDeleteCollection(col.id)} className="text-muted hover:text-danger" title="Excluir coleção">
                <Icon name="x" size={12} />
              </button>
            </span>
          ))}
          <button type="button" onClick={onNewCollection} className="inline-flex items-center gap-1 rounded-interactive border border-dashed border-border px-2.5 py-0.5 text-xs text-muted hover:text-content">
            <Icon name="plus" size={12} /> Nova
          </button>
        </div>
      </div>

      {/* Gerenciar itens da coleção (remover / reordenar) */}
      {collectionId && (collectionAssets.data ?? []).length > 0 && (
        <div className="mb-4 rounded-container border border-border bg-card p-4">
          <Typography variant="caption" className="mb-2 block uppercase tracking-wide">Gerenciar coleção</Typography>
          <ul className="space-y-1">
            {(collectionAssets.data ?? []).map((a, i) => (
              <li key={a.id} className="flex items-center justify-between rounded-interactive px-2 py-1 text-sm hover:bg-surface">
                <span className="truncate text-content">{i + 1}. {a.name}</span>
                <span className="flex shrink-0 gap-1">
                  <button onClick={() => onMove(i, -1)} disabled={i === 0} className="rounded-md border border-border p-1 text-muted disabled:opacity-30"><Icon name="chevron" size={12} className="-rotate-90" /></button>
                  <button onClick={() => onMove(i, 1)} disabled={i === (collectionAssets.data ?? []).length - 1} className="rounded-md border border-border p-1 text-muted disabled:opacity-30"><Icon name="chevron" size={12} className="rotate-90" /></button>
                  <button onClick={() => onRemove(a.id)} className="rounded-md border border-border p-1 text-danger"><Icon name="x" size={12} /></button>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {all.isLoading && !collectionId ? (
        <AssetGrid />
      ) : (
        <>
          <Typography variant="caption" className="mb-3 block">{filtered.length} resultado(s)</Typography>
          <AssetGrid assets={filtered as AssetSummary[]} />
        </>
      )}
    </div>
  );
}
