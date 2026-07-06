'use client';
// src/app/assets/[slug]/page.tsx
// Asset Detail Premium (Sprint 3) — consome 100% dos dados reais do Supabase
// via useAssetDetail. Estilo Linear/Vercel/Notion: Dark Slate, glass, hover 200ms.
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAssetDetail } from '../../../hooks/useAssets';
import { getAssetTranslation } from '../../../data/assets';
import { toggleFavorite, recordRecent, listFavoriteIds } from '../../../data/userData';
import { listCollections, addToCollection, createCollection } from '../../../data/collections';
import { duplicateAsset } from '../../../data/adminAssets';
import { useRole } from '../../../hooks/useRole';
import { Typography } from '../../../components/atoms/Typography';
import { Badge } from '../../../components/atoms/Badge';
import { Icon } from '../../../components/atoms/Icon';
import { Skeleton } from '../../../components/atoms/Skeleton';
import { relativeDate, healthColor } from '../../../components/molecules/AssetCard';
import { HealthRing } from '../../../components/atoms/HealthRing';
import { useLanguage } from '../../../lib/i18n/LanguageProvider';
import { useToast } from '../../../components/organisms/Toast';
import type { AssetDetail, LinkType, PlatformKind } from '../../../types';

// ------------------------------------------------------------- Rótulos (via i18n: t(`revenue.${x}`), t(`checklist.${x}`)…)
const flag = (cc: string) =>
  cc.toUpperCase().replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));

// ------------------------------------------------------------- Sub-componentes locais
function Section({ icon, title, action, children }: {
  icon: string; title: string; action?: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <section className="rounded-container border border-border bg-card p-6 ring-hairline">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon name={icon} size={18} className="text-muted" />
          <Typography variant="h5">{title}</Typography>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function Meta({ icon, label, value }: { icon: string; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <span className="flex items-center gap-2 text-sm text-muted">
        <Icon name={icon} size={15} /> {label}
      </span>
      <span className="text-right text-sm font-medium text-content">{value}</span>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: string; label: string; value: number }) {
  return (
    <div className="lift rounded-container border border-border bg-surface p-4 ring-hairline hover:border-primary/40">
      <Icon name={icon} size={18} className="mb-2 text-primary-hover" />
      <div className="text-2xl font-bold text-content">{value.toLocaleString('pt-BR')}</div>
      <div className="text-xs text-muted">{label}</div>
    </div>
  );
}

// ------------------------------------------------------------- Estados
function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <Skeleton className="mb-6 h-6 w-24" />
      <Skeleton className="mb-6 h-56 w-full rounded-container" />
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Skeleton className="h-64 w-full rounded-container" />
          <Skeleton className="h-40 w-full rounded-container" />
        </div>
        <Skeleton className="h-96 w-full rounded-container" />
      </div>
    </div>
  );
}

function NotFound() {
  const { t } = useLanguage();
  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <Typography variant="h3" className="mb-2">{t('detail.notFound')}</Typography>
      <Typography variant="p" className="mb-8">
        {t('detail.notFoundDesc')}
      </Typography>
      <Link href="/assets" className="inline-flex h-11 items-center gap-2 rounded-interactive bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover">
        <Icon name="stack" size={16} /> {t('detail.seeAll')}
      </Link>
    </div>
  );
}

// ------------------------------------------------------------- Página
export default function AssetDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? '';
  const { data: asset, isLoading } = useAssetDetail(slug);

  if (isLoading) return <DetailSkeleton />;
  if (!asset) return <NotFound />;
  return <AssetDetailView asset={asset} />;
}

function AssetDetailView({ asset }: { asset: AssetDetail }) {
  const { t, lang } = useLanguage();
  const { toast } = useToast();
  // Tradução do Kit para o idioma ativo (item 2); cai para o conteúdo base se ausente.
  const trQ = useQuery({ queryKey: ['asset-tr', asset.id, lang], queryFn: () => getAssetTranslation(asset.id, lang) });
  const displayName = trQ.data?.name || asset.name;
  const displayShort = trQ.data?.shortDescription || asset.shortDescription;
  const displayFull = trQ.data?.fullDescription || asset.fullDescription;
  const linkOf = (type: LinkType) => asset.links.find((l) => l.type === type)?.url;
  // Galeria: hero + miniaturas, até 10 imagens (item 4).
  const media = useMemo(
    () => ([asset.mockupUrl, asset.coverUrl, asset.bannerUrl, ...asset.screenshots.map((s) => s.url)].filter(Boolean) as string[]).slice(0, 10),
    [asset],
  );
  const [selected, setSelected] = useState(0);
  const [fav, setFav] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [favMsg, setFavMsg] = useState<string | null>(null);

  // Registra "recente" e carrega estado de favorito (persistidos no Supabase).
  useEffect(() => {
    recordRecent(asset.id).catch(() => {});
    listFavoriteIds().then((ids) => setFav(ids.includes(asset.id))).catch(() => {});
  }, [asset.id]);

  const onToggleFav = async () => {
    try {
      const now = await toggleFavorite(asset.id);
      setFav(now);
      setFavMsg(null);
      toast(t(now ? 'toast.favAdded' : 'toast.favRemoved'), 'success');
    } catch (e) {
      setFavMsg(e instanceof Error ? e.message : String(e));
      setTimeout(() => setFavMsg(null), 2500);
    }
  };

  const qc = useQueryClient();
  const collections = useQuery({ queryKey: ['collections'], queryFn: listCollections });
  const [collMsg, setCollMsg] = useState<string | null>(null);
  const addToColl = async (collectionId: string) => {
    if (!collectionId) return;
    try {
      await addToCollection(collectionId, asset.id);
      setCollMsg(t('coll.added'));
      setTimeout(() => setCollMsg(null), 1800);
    } catch (e) {
      setCollMsg(e instanceof Error ? e.message : String(e));
      setTimeout(() => setCollMsg(null), 2500);
    }
  };
  const onNewColl = async () => {
    const name = window.prompt(t('coll.prompt'));
    if (!name?.trim()) return;
    try {
      const c = await createCollection(name.trim());
      qc.invalidateQueries({ queryKey: ['collections'] });
      await addToColl(c.id);
    } catch (e) {
      setCollMsg(e instanceof Error ? e.message : String(e));
      setTimeout(() => setCollMsg(null), 2500);
    }
  };

  const copy = (key: string, text?: string) => {
    if (!text) return;
    navigator.clipboard?.writeText(text);
    setCopied(key);
    toast(t(key === 'prompt' ? 'toast.promptCopied' : 'toast.linkCopied'), 'success');
    setTimeout(() => setCopied(null), 1800);
  };

  // Remixar = clonar o Kit para a área pessoal. Original permanece intacto.
  // Admin abre o Studio para personalizar; aluno recebe a cópia na sua área.
  const router = useRouter();
  const { isAdmin } = useRole();
  // "Ver como aluno" (item 11): ?preview=student força a visão de aluno.
  const searchParams = useSearchParams();
  const showAdmin = isAdmin && searchParams.get('preview') !== 'student';
  const [remixing, setRemixing] = useState(false);
  const [remixErr, setRemixErr] = useState<string | null>(null);
  const onRemix = async () => {
    setRemixing(true);
    setRemixErr(null);
    try {
      const res = await duplicateAsset(asset.slug);
      if (res) {
        toast(t('toast.remixed'), 'success');
        router.push(showAdmin ? `/admin/assets/edit/${res.slug}` : `/assets/${res.slug}`);
      }
    } catch (e) {
      setRemixErr(e instanceof Error ? e.message : String(e));
      setTimeout(() => setRemixErr(null), 3000);
    } finally {
      setRemixing(false);
    }
  };

  const openUrl = linkOf('microapp') ?? linkOf('deploy') ?? linkOf('demo');
  const salesUrl = linkOf('sales') ?? linkOf('demo');
  const driveUrl = linkOf('drive');
  const docsUrl = linkOf('docs');
  const downloadUrl = driveUrl ?? linkOf('github') ?? linkOf('deploy'); // Drive → GitHub → deploy/ZIP
  // Copiar Prompt: conteúdo completo (P4); se não houver, cai para o link do prompt.
  const promptText = (trQ.data?.promptContent || asset.promptContent)?.trim() || '';
  const promptCopyTarget = promptText || linkOf('prompt') || driveUrl || docsUrl || '';
  const promptAvailable = Boolean(promptCopyTarget);

  const platformsByKind = useMemo(() => {
    const map = new Map<PlatformKind, string[]>();
    asset.platforms.forEach((p) => {
      const arr = map.get(p.kind) ?? [];
      arr.push(p.label);
      map.set(p.kind, arr);
    });
    return Array.from(map.entries());
  }, [asset.platforms]);

  const analytics = asset.analytics;

  // Presença de itens do checklist (para entregáveis + barra de conclusão).
  const has = (item: string) => asset.checklist.some((c) => c.item === item && c.present);
  const videoUrl = asset.videoYoutubeUrl || asset.videoLoomUrl || undefined;

  // Entregáveis do Kit (item 2): presente → abrir/incluído; ausente → "Em desenvolvimento".
  const deliverables: { label: string; icon: string; present: boolean; url?: string }[] = [
    { label: t('incl.appRemix'), icon: 'bolt', present: Boolean(openUrl) || has('microapp'), url: openUrl },
    { label: t('incl.salesPage'), icon: 'money', present: Boolean(salesUrl) || has('landing'), url: salesUrl },
    { label: t('incl.checkout'), icon: 'cube', present: Boolean(linkOf('deploy') ?? linkOf('demo')) || has('deploy'), url: linkOf('deploy') ?? linkOf('demo') },
    { label: t('incl.ebookPremium'), icon: 'docs', present: Boolean(docsUrl ?? driveUrl) || has('documentacao'), url: docsUrl ?? driveUrl },
    { label: t('incl.promptMaster'), icon: 'clipboard', present: promptAvailable, url: linkOf('prompt') },
    { label: t('incl.templates'), icon: 'asset', present: Boolean(linkOf('canva')) || has('canva'), url: linkOf('canva') },
    { label: t('incl.creatives'), icon: 'sparkles', present: has('criativos'), url: driveUrl },
    { label: t('incl.videos'), icon: 'rocket', present: Boolean(videoUrl) || has('videos'), url: videoUrl },
    { label: t('incl.logo'), icon: 'star', present: Boolean(asset.logoUrl), url: asset.logoUrl },
    { label: t('incl.mockups'), icon: 'cube', present: has('mockups') || Boolean(asset.mockupUrl), url: asset.mockupUrl },
  ];

  return (
    <div className="animate-in mx-auto max-w-6xl px-6 py-8">
      {/* Voltar */}
      <Link href="/assets" className="mb-5 inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-content">
        <Icon name="back" size={16} /> {t('gate.back')}
      </Link>

      {/* Hero — arte completa (object-contain), sem corte; título abaixo para não cobrir a arte */}
      <div className="mb-8 overflow-hidden rounded-container border border-border bg-card">
        {asset.bannerUrl ? (
          <div className="flex items-center justify-center bg-card p-3 sm:p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset.bannerUrl}
              alt={displayName}
              decoding="async"
              className="max-h-[440px] w-auto max-w-full rounded-interactive object-contain"
            />
          </div>
        ) : (
          <div className="h-40 w-full bg-brand-glow sm:h-52" />
        )}
        <div className="flex flex-wrap items-end justify-between gap-4 border-t border-border p-6">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge tone="primary">{asset.category}</Badge>
              <Badge tone="default">{asset.level.charAt(0).toUpperCase() + asset.level.slice(1)}</Badge>
              <Badge tone={asset.status === 'draft' ? 'warning' : 'success'}>
                {t(`status.${asset.status}`)}
              </Badge>
              <span className="text-xs text-muted">{asset.version}</span>
            </div>
            <Typography variant="h2" className="max-w-2xl">{displayName}</Typography>
            {displayShort && (
              <Typography variant="p" className="mt-1 max-w-2xl">{displayShort}</Typography>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Coluna principal */}
        <div className="space-y-6 lg:col-span-2">
          {/* Galeria / Imagem principal / Screenshots */}
          <Section icon="asset" title={t('detail.gallery')}>
            <div className="overflow-hidden rounded-container border border-border bg-surface">
              {media.length > 0 ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={media[selected]} alt={displayName} loading="lazy" decoding="async" className="h-72 w-full object-cover sm:h-96" />
              ) : (
                <div className="flex h-72 items-center justify-center bg-brand-glow/20 sm:h-96">
                  <Icon name="asset" size={56} className="text-muted" />
                </div>
              )}
            </div>
            {media.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto">
                {media.map((m, i) => (
                  <button
                    key={m}
                    onClick={() => setSelected(i)}
                    className={`h-16 w-24 shrink-0 overflow-hidden rounded-interactive border transition-colors ${i === selected ? 'border-primary' : 'border-border hover:border-primary/50'}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={m} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </Section>

          {/* Entregáveis do Kit (item 2) */}
          <Section icon="stack" title={t('detail.included')}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {deliverables.map((m) => (
                <div
                  key={m.label}
                  className={`flex items-center gap-3 rounded-container border p-3 transition-colors ${m.present ? 'border-success/25 bg-success/5' : 'border-border bg-surface/40'}`}
                >
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-interactive ${m.present ? 'bg-success/12 text-success' : 'bg-surface-2 text-muted'}`}>
                    <Icon name={m.present ? 'check' : m.icon} size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-content">{m.label}</span>
                    {m.present ? (
                      m.url ? (
                        <a href={m.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover">
                          {t('action.open')} <Icon name="external" size={11} />
                        </a>
                      ) : (
                        <span className="text-xs font-medium text-success">✓</span>
                      )
                    ) : (
                      <span className="text-xs text-muted">{t('incl.inDev')}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Vídeo (YouTube/Loom reais quando existirem) */}
          <Section icon="rocket" title={t('detail.video')}>
            {(() => {
              const ytId = asset.videoYoutubeUrl?.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{6,})/)?.[1];
              if (ytId) {
                return (
                  <div className="aspect-video w-full overflow-hidden rounded-container border border-border">
                    <iframe className="h-full w-full" src={`https://www.youtube.com/embed/${ytId}`} title={t('detail.video')} allowFullScreen />
                  </div>
                );
              }
              if (asset.videoLoomUrl) {
                return (
                  <a href={asset.videoLoomUrl} target="_blank" rel="noopener noreferrer" className="flex h-48 items-center justify-center rounded-container border border-border bg-surface/50 text-primary hover:text-primary-hover">
                    <span className="flex items-center gap-2"><Icon name="rocket" size={20} /> {t('detail.watchLoom')}</span>
                  </a>
                );
              }
              return (
                <div className="flex h-48 items-center justify-center rounded-container border border-dashed border-border bg-surface/50 text-center">
                  <div>
                    <Icon name="rocket" size={28} className="mx-auto mb-2 text-muted" />
                    <Typography variant="small">{t('detail.noVideo')}</Typography>
                  </div>
                </div>
              );
            })()}
          </Section>

          {/* Descrição completa */}
          {displayFull && (
            <Section icon="docs" title={t('detail.about')}>
              <Typography variant="p" className="whitespace-pre-line">{displayFull}</Typography>
            </Section>
          )}

          {/* Barra de conclusão do Kit (item 5) */}
          <Section icon="check" title={t('complete.title')}>
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="font-display text-sm font-bold uppercase tracking-wide text-content">
                {asset.healthScore >= 100
                  ? showAdmin ? t('complete.kitComplete') : t('complete.kitCompleteStudent')
                  : showAdmin ? `${asset.healthScore}%` : t('complete.kitCompleteStudent')}
              </span>
              {showAdmin && <span className={`text-sm font-bold ${healthColor(asset.healthScore)}`}>{asset.healthScore}%</span>}
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-surface-2">
              <div className="h-full rounded-full bg-brand-glow transition-all duration-500" style={{ width: `${Math.min(100, asset.healthScore)}%` }} />
            </div>

            {/* Lista de entregáveis (✔️ incluído / pendente) */}
            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {asset.checklist.map((c) => (
                <div key={c.item} className="flex items-center gap-2 text-sm">
                  <Icon name={c.present ? 'check' : 'x'} size={14} className={c.present ? 'text-success' : 'text-muted'} />
                  <span className={c.present ? 'text-content' : 'text-muted'}>{t(`checklist.${c.item}`)}</span>
                </div>
              ))}
            </div>

            {/* Métrica interna (somente administrador) */}
            {showAdmin && (
              <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                <HealthRing score={asset.healthScore} />
                <Typography variant="caption">{t('detail.health')}</Typography>
              </div>
            )}
          </Section>

          {/* Analytics */}
          <Section icon="chart" title={t('detail.analytics')}>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Stat icon="eye" label={t('stat.views')} value={analytics.views} />
              <Stat icon="rocket" label={t('stat.opens')} value={analytics.opens} />
              <Stat icon="download" label={t('stat.downloads')} value={analytics.downloads} />
              <Stat icon="favorite" label={t('stat.favorites')} value={analytics.favorites} />
              <Stat icon="remix" label={t('stat.remixes')} value={analytics.remixes} />
              <Stat icon="share" label={t('stat.shares')} value={analytics.shares} />
            </div>
          </Section>

          {/* Compatibilidade / Plataformas */}
          {platformsByKind.length > 0 && (
            <Section icon="cube" title={t('detail.platforms')}>
              <div className="space-y-3">
                {platformsByKind.map(([kind, labels]) => (
                  <div key={kind} className="flex flex-wrap items-center gap-2">
                    <span className="w-24 shrink-0 text-xs uppercase tracking-wide text-muted">{t(`kind.${kind}`)}</span>
                    {labels.map((l) => <Badge key={l} tone="default">{l}</Badge>)}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Idiomas / Países / IA / Tags */}
          <Section icon="globe" title={t('detail.reach')}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Typography variant="caption" className="mb-2 block uppercase tracking-wide">{t('detail.languages')}</Typography>
                <div className="flex flex-wrap gap-1.5">
                  {asset.languages.map((l) => <Badge key={l} tone="default">{l.toUpperCase()}</Badge>)}
                </div>
              </div>
              <div>
                <Typography variant="caption" className="mb-2 block uppercase tracking-wide">{t('detail.countries')}</Typography>
                <div className="flex flex-wrap gap-1.5">
                  {asset.targetCountries.map((c) => <Badge key={c} tone="default">{flag(c)} {c}</Badge>)}
                </div>
              </div>
              <div>
                <Typography variant="caption" className="mb-2 block uppercase tracking-wide">{t('detail.aiUsed')}</Typography>
                <div className="flex flex-wrap gap-1.5">
                  {asset.buildAiTools.map((a) => <Badge key={a} tone="primary">{a}</Badge>)}
                </div>
              </div>
              <div>
                <Typography variant="caption" className="mb-2 block uppercase tracking-wide">{t('detail.tags')}</Typography>
                <div className="flex flex-wrap gap-1.5">
                  {asset.tags.map((tag) => <Badge key={tag} tone="default"><Icon name="tag" size={11} /> {tag}</Badge>)}
                </div>
              </div>
            </div>
          </Section>

          {/* Arquivos disponíveis */}
          <Section icon="download" title={t('detail.files')}>
            {asset.files.length > 0 ? (
              <ul className="divide-y divide-border">
                {asset.files.map((f) => (
                  <li key={f.id} className="flex items-center justify-between py-3">
                    <span className="flex items-center gap-2 text-sm text-content">
                      <Icon name="docs" size={15} className="text-muted" /> {f.name}
                      {f.driveFolder && <Badge tone="default">{f.driveFolder}</Badge>}
                    </span>
                    {f.url && (
                      <a href={f.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:text-primary-hover">
                        <Icon name="external" size={15} />
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <Typography variant="small">
                {t('detail.filesEmpty')}
              </Typography>
            )}
          </Section>

          {/* Histórico de versões */}
          <Section icon="clipboard" title={t('detail.versions')}>
            {asset.versions.length > 0 ? (
              <ol className="relative space-y-4 border-l border-border pl-5">
                {asset.versions.slice().reverse().map((v) => (
                  <li key={v.id} className="relative">
                    <span className="absolute -left-[23px] top-1 h-2.5 w-2.5 rounded-full bg-primary" />
                    <div className="flex items-center gap-2">
                      <Typography variant="h6">{v.version}</Typography>
                      {v.isCurrent && <Badge tone="success">{t('detail.current')}</Badge>}
                      <span className="text-xs text-muted">{relativeDate(v.releasedAt)}</span>
                    </div>
                    {v.notes && <Typography variant="small">{v.notes}</Typography>}
                  </li>
                ))}
              </ol>
            ) : (
              <Typography variant="small">{t('detail.versionsEmpty')}</Typography>
            )}
          </Section>

          {/* Histórico de updates */}
          {asset.updates.length > 0 && (
            <Section icon="sparkles" title={t('detail.news')}>
              <ul className="space-y-3">
                {asset.updates.map((u) => (
                  <li key={u.id} className="flex items-start gap-3">
                    <Badge tone="primary">{t(`update.${u.type}`)}</Badge>
                    <div>
                      <Typography variant="h6">{u.title}</Typography>
                      {u.description && <Typography variant="small">{u.description}</Typography>}
                    </div>
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </div>

        {/* Coluna lateral (ações + metadados) */}
        <aside className="space-y-6">
          <div className="glass sticky top-6 space-y-5 rounded-container p-5">
            {/* Ações */}
            <div className="space-y-2">
              <a
                href={openUrl ?? undefined}
                target="_blank" rel="noopener noreferrer"
                aria-disabled={!openUrl}
                className={`flex h-12 w-full items-center justify-center gap-2 rounded-interactive text-sm font-semibold transition-colors ${openUrl ? 'bg-primary text-white hover:bg-primary-hover' : 'pointer-events-none bg-primary/40 text-white/60'}`}
              >
                <Icon name="bolt" size={16} /> {t('action.open')}
              </a>
              <button
                onClick={onRemix}
                disabled={remixing}
                className="bg-brand-glow flex h-12 w-full items-center justify-center gap-2 rounded-interactive text-sm font-semibold text-white transition-all hover:shadow-[var(--shadow-glow-blue)] disabled:opacity-60"
              >
                <Icon name="remix" size={16} /> {remixing ? t('action.remixing') : t('action.remixKit')}
              </button>
              {/* Editar Kit — somente administradores (item 3) */}
              {showAdmin && (
                <Link
                  href={`/admin/assets/edit/${asset.slug}`}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-interactive border border-primary/40 text-sm font-semibold text-primary-hover transition-colors hover:bg-primary/10"
                >
                  <Icon name="settings" size={15} /> {t('detail.editKit')}
                </Link>
              )}
              {remixErr && <p className="text-xs text-danger">{remixErr}</p>}
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={salesUrl ?? undefined} target="_blank" rel="noopener noreferrer"
                  aria-disabled={!salesUrl}
                  className={`flex h-11 items-center justify-center gap-2 rounded-interactive border border-border text-sm font-semibold transition-colors ${salesUrl ? 'text-content hover:bg-surface' : 'pointer-events-none text-muted/50'}`}
                >
                  <Icon name="money" size={15} /> {t('action.sales')}
                </a>
                <button
                  onClick={onToggleFav}
                  className="flex h-11 items-center justify-center gap-2 rounded-interactive border border-border text-sm font-semibold text-content transition-colors hover:bg-surface"
                >
                  <Icon name={fav ? 'favorite-solid' : 'favorite'} size={15} className={fav ? 'text-danger' : ''} />
                  {fav ? t('action.favYes') : t('action.favNo')}
                </button>
                <button
                  onClick={() => copy('share', typeof window !== 'undefined' ? window.location.href : '')}
                  className="flex h-11 items-center justify-center gap-2 rounded-interactive border border-border text-sm font-semibold text-content transition-colors hover:bg-surface"
                >
                  <Icon name={copied === 'share' ? 'check' : 'share'} size={15} className={copied === 'share' ? 'text-success' : ''} />
                  {copied === 'share' ? t('action.copied') : t('action.share')}
                </button>
                <a
                  href={downloadUrl ?? undefined} target="_blank" rel="noopener noreferrer"
                  aria-disabled={!downloadUrl}
                  onClick={() => downloadUrl && toast(t('toast.downloadStarted'), 'success')}
                  className={`flex h-11 items-center justify-center gap-2 rounded-interactive border border-border text-sm font-semibold transition-colors ${downloadUrl ? 'text-content hover:bg-surface' : 'pointer-events-none text-muted/50'}`}
                >
                  <Icon name="download" size={15} /> {t('action.download')}
                </a>
                <button
                  onClick={() => copy('prompt', promptCopyTarget)}
                  disabled={!promptAvailable}
                  className="flex h-11 items-center justify-center gap-2 rounded-interactive border border-border text-sm font-semibold text-content transition-colors hover:bg-surface disabled:pointer-events-none disabled:text-muted/50"
                  title={promptText ? t('action.promptTitleFull') : t('action.promptTitleLink')}
                >
                  <Icon name={copied === 'prompt' ? 'check' : 'clipboard'} size={15} className={copied === 'prompt' ? 'text-success' : ''} />
                  {copied === 'prompt' ? t('action.copied') : t('action.copyPrompt')}
                </button>
              </div>
              {favMsg && <p className="text-xs text-danger">{favMsg}</p>}
              <a
                href={docsUrl ?? undefined} target="_blank" rel="noopener noreferrer"
                aria-disabled={!docsUrl}
                className={`flex h-11 w-full items-center justify-center gap-2 rounded-interactive text-sm font-semibold transition-colors ${docsUrl ? 'text-primary hover:bg-primary/10' : 'pointer-events-none text-muted/50'}`}
              >
                <Icon name="docs" size={15} /> {t('action.openDocs')}
              </a>
            </div>

            {/* Adicionar à coleção */}
            <div className="border-t border-border pt-3">
              <Typography variant="caption" className="mb-2 block uppercase tracking-wide">{t('coll.add')}</Typography>
              <div className="flex gap-2">
                <select
                  value=""
                  onChange={(e) => { addToColl(e.target.value); e.target.value = ''; }}
                  className="h-9 flex-1 rounded-interactive border border-border bg-surface px-2 text-sm text-content focus:outline-none"
                >
                  <option value="">{t('coll.choose')}</option>
                  {(collections.data ?? []).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <button type="button" onClick={onNewColl} className="rounded-interactive border border-border px-2 text-muted transition-colors hover:text-content" title={t('coll.newTitle')}>
                  <Icon name="plus" size={14} />
                </button>
              </div>
              {collMsg && <p className="mt-1 text-xs text-success">{collMsg}</p>}
            </div>

            {/* Metadados */}
            <div className="divide-y divide-border border-t border-border pt-1">
              <Meta icon="clipboard" label={t('meta.currentVersion')} value={asset.version} />
              <Meta icon="recent" label={t('meta.updated')} value={relativeDate(asset.updatedAt)} />
              {asset.setupTimeMinutes != null && (
                <Meta icon="bolt" label={t('meta.setup')} value={`~${asset.setupTimeMinutes} min`} />
              )}
              {asset.timeToPublishMinutes != null && (
                <Meta icon="rocket" label={t('meta.toPublish')} value={`~${asset.timeToPublishMinutes} min`} />
              )}
              <Meta icon="star" label={t('meta.level')} value={asset.level.charAt(0).toUpperCase() + asset.level.slice(1)} />
              <Meta icon="money" label={t('meta.revenue')} value={t(`revenue.${asset.revenueModel}`)} />
              <Meta icon="cube" label={t('meta.bundle')} value={t(`bundle.${asset.deliveryBundle}`)} />
              <Meta icon="docs" label={t('meta.license')} value={t(`license.${asset.license}`)} />
              {asset.difficulty && (
                <Meta icon="chart" label={t('meta.difficulty')} value={t(`difficulty.${asset.difficulty}`)} />
              )}
              {asset.suggestedPrice != null && (
                <Meta icon="money" label={t('meta.suggestedPrice')} value={`R$ ${asset.suggestedPrice.toFixed(2)}`} />
              )}
            </div>

            {/* Links diretos */}
            {asset.links.length > 0 && (
              <div className="border-t border-border pt-3">
                <Typography variant="caption" className="mb-2 block uppercase tracking-wide">{t('detail.links')}</Typography>
                <div className="flex flex-wrap gap-1.5">
                  {asset.links.map((l) => (
                    <a
                      key={l.type} href={l.url} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-interactive border border-border px-2 py-1 text-xs text-muted transition-colors hover:border-primary/50 hover:text-content"
                    >
                      <Icon name={l.type === 'github' ? 'code' : l.type === 'docs' ? 'docs' : 'external'} size={12} />
                      {l.type}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
