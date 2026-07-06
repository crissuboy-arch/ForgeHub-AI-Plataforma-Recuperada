'use client';
// src/app/assets/page.tsx — BIBLIOTECA DE NEGÓCIOS DIGITAIS (por nicho, multilíngue).
import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Badge } from '../../components/atoms/Badge';
import { Icon } from '../../components/atoms/Icon';
import { Typography } from '../../components/atoms/Typography';
import { AssetGrid } from '../../components/organisms/AssetGrid';
import { listSearchableAssets, type SearchableAsset } from '../../data/assets';
import { listNiches } from '../../data/adminAssets';
import {
  listCollections, createCollection, deleteCollection,
  getCollectionAssets, removeFromCollection, reorderCollection,
} from '../../data/collections';
import { useLanguage } from '../../lib/i18n/LanguageProvider';
import type { AssetSummary } from '../../types';

function haystack(a: AssetSummary | SearchableAsset): string {
  const s = a as Partial<SearchableAsset>;
  return [
    a.name, a.slug, a.category, a.status, a.level, a.niche, a.language,
    s.description, s.license, s.revenueModel, s.deliveryBundle,
    ...(s.tags ?? []), ...(s.ai ?? []), ...(s.platforms ?? []),
    ...(s.languages ?? []), ...(s.countries ?? []), String(a.healthScore),
  ].filter(Boolean).join(' ').toLowerCase();
}

const LANGS: { code: string; label?: string; labelKey?: string }[] = [
  { code: 'todos', labelKey: 'library.all' }, { code: 'pt-BR', label: 'PT' }, { code: 'es', label: 'ES' }, { code: 'en', label: 'EN' },
];
const LEVELS: { code: string; labelKey: string }[] = [
  { code: 'todos', labelKey: 'library.all' }, { code: 'starter', labelKey: 'level.starter' }, { code: 'pro', labelKey: 'level.pro' },
  { code: 'elite', labelKey: 'level.elite' }, { code: 'enterprise', labelKey: 'level.enterprise' },
];
const PRICES: { code: string; labelKey: string }[] = [
  { code: 'todos', labelKey: 'library.all' }, { code: 'free', labelKey: 'price.free' }, { code: 'p50', labelKey: 'price.p50' },
  { code: 'p100', labelKey: 'price.p100' }, { code: 'p100plus', labelKey: 'price.p100plus' },
];
// "Tipo" do ativo (asset_type): App / Prompt / Kit / Template.
const TYPES: { code: string; labelKey: string }[] = [
  { code: 'todos', labelKey: 'library.all' }, { code: 'kit', labelKey: 'type.kit' }, { code: 'app', labelKey: 'type.app' },
  { code: 'prompt', labelKey: 'type.prompt' }, { code: 'template', labelKey: 'type.template' },
];
const priceBucket = (p?: number): string => {
  if (p == null || p === 0) return 'free';
  if (p <= 50) return 'p50';
  if (p <= 100) return 'p100';
  return 'p100plus';
};

function LibraryContent() {
  const qc = useQueryClient();
  const { t, lang } = useLanguage();
  const sp = useSearchParams();
  const [q, setQ] = useState(sp.get('q') ?? '');
  const [niche, setNiche] = useState(sp.get('niche') ?? 'todos');
  const [langFilter, setLangFilter] = useState<string>(lang);
  const [level, setLevel] = useState('todos');
  const [price, setPrice] = useState('todos');
  const [type, setType] = useState(sp.get('tipo') ?? 'todos');
  const [collectionId, setCollectionId] = useState<string | null>(null);

  // Ao trocar o idioma global, a biblioteca acompanha automaticamente.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setLangFilter(lang); }, [lang]);

  const all = useQuery({ queryKey: ['search-assets'], queryFn: listSearchableAssets });
  const niches = useQuery({ queryKey: ['niches'], queryFn: listNiches });
  const collections = useQuery({ queryKey: ['collections'], queryFn: listCollections });
  const collectionAssets = useQuery({
    queryKey: ['collection-assets', collectionId],
    queryFn: () => getCollectionAssets(collectionId as string),
    enabled: Boolean(collectionId),
  });

  const filtered = useMemo(() => {
    const base: (AssetSummary | SearchableAsset)[] = collectionId ? collectionAssets.data ?? [] : all.data ?? [];
    const term = q.trim().toLowerCase();
    return base.filter((a) => {
      if (niche !== 'todos' && a.niche !== niche) return false;
      if (langFilter !== 'todos' && (a.language ?? 'pt-BR') !== langFilter) return false;
      if (level !== 'todos' && a.level !== level) return false;
      if (price !== 'todos' && priceBucket((a as SearchableAsset).suggestedPrice) !== price) return false;
      if (type !== 'todos' && (a as SearchableAsset).assetType !== type) return false;
      if (!term) return true;
      return haystack(a).includes(term);
    });
  }, [collectionId, collectionAssets.data, all.data, q, niche, langFilter, level, price, type]);

  const refreshCollections = () => qc.invalidateQueries({ queryKey: ['collections'] });
  const refreshCollAssets = () => qc.invalidateQueries({ queryKey: ['collection-assets', collectionId] });
  const onNewCollection = async () => {
    const name = window.prompt(t('coll.prompt'));
    if (!name?.trim()) return;
    try { await createCollection(name.trim()); refreshCollections(); }
    catch (e) { window.alert(e instanceof Error ? e.message : String(e)); }
  };
  const onDeleteCollection = async (id: string) => {
    if (!window.confirm(t('lib.confirmDeleteCollection'))) return;
    await deleteCollection(id);
    if (collectionId === id) setCollectionId(null);
    refreshCollections();
  };
  const onRemove = async (assetId: string) => { if (collectionId) { await removeFromCollection(collectionId, assetId); refreshCollAssets(); } };
  const onMove = async (index: number, dir: -1 | 1) => {
    const items = collectionAssets.data ?? [];
    const j = index + dir; if (j < 0 || j >= items.length) return;
    const ids = items.map((a) => a.id); [ids[index], ids[j]] = [ids[j], ids[index]];
    await reorderCollection(collectionId as string, ids); refreshCollAssets();
  };

  const chip = (active: boolean) =>
    `rounded-full px-3 py-1 text-sm font-medium transition-colors ${active ? 'bg-primary/20 text-primary-hover' : 'border border-border bg-surface/60 text-muted hover:text-content'}`;

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* Hero da Biblioteca */}
      <div className="mb-8">
        <Typography variant="h2" className="mb-2 max-w-2xl">{t('library.hero')}</Typography>
        <Typography variant="p" className="max-w-2xl">{t('library.subtitle')}</Typography>
      </div>

      {/* Grade de nichos */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <button
          type="button"
          onClick={() => setNiche('todos')}
          className={`card-premium lift ring-hairline flex flex-col items-center gap-2 rounded-container p-4 text-center ${niche === 'todos' ? 'border-primary/60' : ''}`}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-interactive bg-primary/12 text-primary-hover"><Icon name="stack" size={20} /></span>
          <span className="text-xs font-semibold text-content">{t('library.allNiches')}</span>
        </button>
        {(niches.data ?? []).map((n) => (
          <button
            key={n.slug}
            type="button"
            onClick={() => setNiche(n.slug)}
            className={`card-premium lift ring-hairline flex flex-col items-center gap-2 rounded-container p-4 text-center ${niche === n.slug ? 'border-primary/60' : ''}`}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-interactive bg-primary/12 text-primary-hover"><Icon name={n.icon ?? 'asset'} size={20} /></span>
            <span className="text-xs font-semibold text-content">{n.label}</span>
          </button>
        ))}
      </div>

      {/* Busca + filtros */}
      <div className="mb-6 flex flex-col gap-3">
        <div className="flex h-11 items-center gap-2 rounded-interactive border border-border bg-surface px-3">
          <Icon name="search" size={18} className="text-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('topbar.search')} className="h-full flex-1 bg-transparent text-sm text-content placeholder:text-muted focus:outline-none" />
          {q && <button onClick={() => setQ('')} aria-label={t('common.clear')} className="text-muted hover:text-content"><Icon name="x" size={16} /></button>}
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-xs uppercase tracking-wide text-dim">{t('settings.language')}</span>
            {LANGS.map((l) => <button key={l.code} onClick={() => setLangFilter(l.code)} className={chip(langFilter === l.code)}>{l.labelKey ? t(l.labelKey) : l.label}</button>)}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs uppercase tracking-wide text-dim">{t('studio.f.level')}</span>
            {LEVELS.map((l) => <button key={l.code} onClick={() => setLevel(l.code)} className={chip(level === l.code)}>{t(l.labelKey)}</button>)}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs uppercase tracking-wide text-dim">{t('lib.price')}</span>
            {PRICES.map((p) => <button key={p.code} onClick={() => setPrice(p.code)} className={chip(price === p.code)}>{t(p.labelKey)}</button>)}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs uppercase tracking-wide text-dim">{t('lib.type')}</span>
            {TYPES.map((ty) => <button key={ty.code} onClick={() => setType(ty.code)} className={chip(type === ty.code)}>{t(ty.labelKey)}</button>)}
          </div>
        </div>

        {/* Coleções */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-wide text-dim">{t('nav.collections')}:</span>
          <button type="button" onClick={() => setCollectionId(null)}><Badge tone={collectionId === null ? 'primary' : 'default'}>{t('library.all')}</Badge></button>
          {(collections.data ?? []).map((col) => (
            <span key={col.id} className="inline-flex items-center gap-1">
              <button type="button" onClick={() => setCollectionId(col.id)}><Badge tone={collectionId === col.id ? 'primary' : 'default'}>{col.name} · {col.count ?? 0}</Badge></button>
              <button type="button" onClick={() => onDeleteCollection(col.id)} className="text-muted hover:text-danger" title={t('lib.deleteCollection')}><Icon name="x" size={12} /></button>
            </span>
          ))}
          <button type="button" onClick={onNewCollection} className="inline-flex items-center gap-1 rounded-interactive border border-dashed border-border px-2.5 py-0.5 text-xs text-muted hover:text-content"><Icon name="plus" size={12} /> {t('lib.newCollection')}</button>
        </div>
      </div>

      {/* Gerenciar coleção */}
      {collectionId && (collectionAssets.data ?? []).length > 0 && (
        <div className="mb-4 rounded-container border border-border bg-card p-4">
          <Typography variant="caption" className="mb-2 block uppercase tracking-wide">{t('lib.manageCollection')}</Typography>
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
          <Typography variant="caption" className="mb-3 block">{filtered.length} {t('library.results')}</Typography>
          <AssetGrid assets={filtered as AssetSummary[]} />
        </>
      )}
    </div>
  );
}

// useSearchParams exige Suspense em páginas estáticas.
export default function LibraryPage() {
  return (
    <Suspense fallback={null}>
      <LibraryContent />
    </Suspense>
  );
}
