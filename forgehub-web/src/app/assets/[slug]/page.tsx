'use client';
// src/app/assets/[slug]/page.tsx
// Asset Detail Premium (Sprint 3) — consome 100% dos dados reais do Supabase
// via useAssetDetail. Estilo Linear/Vercel/Notion: Dark Slate, glass, hover 200ms.
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAssetDetail } from '../../../hooks/useAssets';
import { toggleFavorite, recordRecent, listFavoriteIds } from '../../../data/userData';
import { listCollections, addToCollection, createCollection } from '../../../data/collections';
import { Typography } from '../../../components/atoms/Typography';
import { Badge } from '../../../components/atoms/Badge';
import { Icon } from '../../../components/atoms/Icon';
import { Skeleton } from '../../../components/atoms/Skeleton';
import { relativeDate } from '../../../components/molecules/AssetCard';
import { HealthRing } from '../../../components/atoms/HealthRing';
import type {
  AssetDetail,
  ChecklistItem,
  LinkType,
  PlatformKind,
  RevenueModel,
  DeliveryBundle,
  AssetLicense,
  AssetDifficulty,
  UpdateType,
} from '../../../types';

// ------------------------------------------------------------- Rótulos
const revenueLabel: Record<RevenueModel, string> = {
  one_time: 'Pagamento único', subscription: 'Assinatura', freemium: 'Freemium',
  free: 'Gratuito', royalties: 'Royalties', license_resale: 'Revenda / Licença',
};
const bundleLabel: Record<DeliveryBundle, string> = {
  solo: 'Solo', pack: 'Pack', suite: 'Suíte', full_kit: 'Kit Completo',
};
const licenseLabel: Record<AssetLicense, string> = {
  uso_pessoal: 'Uso pessoal', comercial: 'Comercial', white_label: 'White-label', open_source: 'Open Source',
};
const difficultyLabel: Record<AssetDifficulty, string> = {
  iniciante: 'Iniciante', intermediario: 'Intermediário', avancado: 'Avançado',
};
const kindLabel: Record<PlatformKind, string> = {
  build_tool: 'Construção', deploy: 'Deploy', sales: 'Vendas', marketing: 'Marketing', cms: 'CMS',
};
const checklistLabel: Record<ChecklistItem, string> = {
  github: 'GitHub', deploy: 'Deploy', drive: 'Google Drive', canva: 'Canva', prompt: 'Prompt',
  landing: 'Landing', copy: 'Copy', criativos: 'Criativos', documentacao: 'Documentação',
  videos: 'Vídeos', microapp: 'MicroApp', mockups: 'Mockups',
};
const updateLabel: Record<UpdateType, string> = {
  novo_prompt: 'Novo Prompt', nova_landing: 'Nova Landing', novo_canva: 'Novo Canva',
  novo_agente: 'Novo Agente', nova_copy: 'Nova Copy', correcao: 'Correção', outro: 'Atualização',
};

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
  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <Typography variant="h3" className="mb-2">Asset não encontrado</Typography>
      <Typography variant="p" className="mb-8">
        O ativo que você procura não existe, foi arquivado ou está em rascunho.
      </Typography>
      <Link href="/assets" className="inline-flex h-11 items-center gap-2 rounded-interactive bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover">
        <Icon name="stack" size={16} /> Ver todos os assets
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
  const linkOf = (t: LinkType) => asset.links.find((l) => l.type === t)?.url;
  const media = useMemo(
    () => [asset.mockupUrl, asset.coverUrl, ...asset.screenshots.map((s) => s.url)].filter(Boolean) as string[],
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
      setCollMsg('Adicionado à coleção.');
      setTimeout(() => setCollMsg(null), 1800);
    } catch (e) {
      setCollMsg(e instanceof Error ? e.message : String(e));
      setTimeout(() => setCollMsg(null), 2500);
    }
  };
  const onNewColl = async () => {
    const name = window.prompt('Nome da nova coleção:');
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
    setTimeout(() => setCopied(null), 1800);
  };

  const openUrl = linkOf('microapp') ?? linkOf('deploy') ?? linkOf('demo');
  const remixUrl = linkOf('remix') ?? linkOf('lovable_remix') ?? linkOf('bolt_remix') ?? linkOf('github');
  const driveUrl = linkOf('drive');
  const docsUrl = linkOf('docs');
  const downloadUrl = driveUrl ?? linkOf('github') ?? linkOf('deploy'); // Drive → GitHub → deploy/ZIP
  // Copiar Prompt: conteúdo completo (P4); se não houver, cai para o link do prompt.
  const promptText = asset.promptContent?.trim() || '';
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

  return (
    <div className="animate-in mx-auto max-w-6xl px-6 py-8">
      {/* Voltar */}
      <Link href="/assets" className="mb-5 inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-content">
        <Icon name="back" size={16} /> Voltar para Assets
      </Link>

      {/* Hero */}
      <div className="relative mb-8 overflow-hidden rounded-container border border-border">
        <div className="h-40 w-full bg-brand-glow sm:h-52" style={asset.bannerUrl ? { backgroundImage: `url(${asset.bannerUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined} />
        <div className="absolute inset-0 bg-gradient-to-t from-canvas/95 via-canvas/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 flex flex-wrap items-end justify-between gap-4 p-6">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge tone="primary">{asset.category}</Badge>
              <Badge tone="default">{asset.level.charAt(0).toUpperCase() + asset.level.slice(1)}</Badge>
              <Badge tone={asset.status === 'draft' ? 'warning' : 'success'}>
                {asset.status === 'updated' ? 'Atualizado' : asset.status === 'active' ? 'Ativo' : asset.status}
              </Badge>
              <span className="text-xs text-muted">{asset.version}</span>
            </div>
            <Typography variant="h2" className="max-w-2xl">{asset.name}</Typography>
            {asset.shortDescription && (
              <Typography variant="p" className="mt-1 max-w-2xl">{asset.shortDescription}</Typography>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Coluna principal */}
        <div className="space-y-6 lg:col-span-2">
          {/* Galeria / Imagem principal / Screenshots */}
          <Section icon="asset" title="Galeria">
            <div className="overflow-hidden rounded-container border border-border bg-surface">
              {media.length > 0 ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={media[selected]} alt={asset.name} className="h-72 w-full object-cover sm:h-96" />
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

          {/* Vídeo (YouTube/Loom reais quando existirem) */}
          <Section icon="rocket" title="Vídeo">
            {(() => {
              const ytId = asset.videoYoutubeUrl?.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{6,})/)?.[1];
              if (ytId) {
                return (
                  <div className="aspect-video w-full overflow-hidden rounded-container border border-border">
                    <iframe className="h-full w-full" src={`https://www.youtube.com/embed/${ytId}`} title="Vídeo" allowFullScreen />
                  </div>
                );
              }
              if (asset.videoLoomUrl) {
                return (
                  <a href={asset.videoLoomUrl} target="_blank" rel="noopener noreferrer" className="flex h-48 items-center justify-center rounded-container border border-border bg-surface/50 text-primary hover:text-primary-hover">
                    <span className="flex items-center gap-2"><Icon name="rocket" size={20} /> Assistir no Loom</span>
                  </a>
                );
              }
              return (
                <div className="flex h-48 items-center justify-center rounded-container border border-dashed border-border bg-surface/50 text-center">
                  <div>
                    <Icon name="rocket" size={28} className="mx-auto mb-2 text-muted" />
                    <Typography variant="small">Sem vídeo cadastrado.</Typography>
                  </div>
                </div>
              );
            })()}
          </Section>

          {/* Descrição completa */}
          {asset.fullDescription && (
            <Section icon="docs" title="Sobre este asset">
              <Typography variant="p" className="whitespace-pre-line">{asset.fullDescription}</Typography>
            </Section>
          )}

          {/* Health Score + Checklist */}
          <Section icon="check" title="Health Score">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <HealthRing score={asset.healthScore} />
              <div className="grid flex-1 grid-cols-2 gap-2 sm:grid-cols-3">
                {asset.checklist.map((c) => (
                  <div key={c.item} className="flex items-center gap-2 text-sm">
                    <Icon
                      name={c.present ? 'check' : 'x'}
                      size={14}
                      className={c.present ? 'text-success' : 'text-danger/70'}
                    />
                    <span className={c.present ? 'text-content' : 'text-muted line-through'}>
                      {checklistLabel[c.item]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          {/* Analytics */}
          <Section icon="chart" title="Analytics">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Stat icon="eye" label="Views" value={analytics.views} />
              <Stat icon="rocket" label="Opens" value={analytics.opens} />
              <Stat icon="download" label="Downloads" value={analytics.downloads} />
              <Stat icon="favorite" label="Favoritos" value={analytics.favorites} />
              <Stat icon="remix" label="Remixes" value={analytics.remixes} />
              <Stat icon="share" label="Shares" value={analytics.shares} />
            </div>
          </Section>

          {/* Compatibilidade / Plataformas */}
          {platformsByKind.length > 0 && (
            <Section icon="cube" title="Plataformas suportadas">
              <div className="space-y-3">
                {platformsByKind.map(([kind, labels]) => (
                  <div key={kind} className="flex flex-wrap items-center gap-2">
                    <span className="w-24 shrink-0 text-xs uppercase tracking-wide text-muted">{kindLabel[kind]}</span>
                    {labels.map((l) => <Badge key={l} tone="default">{l}</Badge>)}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Idiomas / Países / IA / Tags */}
          <Section icon="globe" title="Alcance e construção">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Typography variant="caption" className="mb-2 block uppercase tracking-wide">Idiomas</Typography>
                <div className="flex flex-wrap gap-1.5">
                  {asset.languages.map((l) => <Badge key={l} tone="default">{l.toUpperCase()}</Badge>)}
                </div>
              </div>
              <div>
                <Typography variant="caption" className="mb-2 block uppercase tracking-wide">Países</Typography>
                <div className="flex flex-wrap gap-1.5">
                  {asset.targetCountries.map((c) => <Badge key={c} tone="default">{flag(c)} {c}</Badge>)}
                </div>
              </div>
              <div>
                <Typography variant="caption" className="mb-2 block uppercase tracking-wide">IA utilizada</Typography>
                <div className="flex flex-wrap gap-1.5">
                  {asset.buildAiTools.map((a) => <Badge key={a} tone="primary">{a}</Badge>)}
                </div>
              </div>
              <div>
                <Typography variant="caption" className="mb-2 block uppercase tracking-wide">Tags</Typography>
                <div className="flex flex-wrap gap-1.5">
                  {asset.tags.map((t) => <Badge key={t} tone="default"><Icon name="tag" size={11} /> {t}</Badge>)}
                </div>
              </div>
            </div>
          </Section>

          {/* Arquivos disponíveis */}
          <Section icon="download" title="Arquivos disponíveis">
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
                Os arquivos deste asset ficam organizados no Google Drive (18 pastas). Use o botão “Download” para acessá-los.
              </Typography>
            )}
          </Section>

          {/* Histórico de versões */}
          <Section icon="clipboard" title="Histórico de versões">
            {asset.versions.length > 0 ? (
              <ol className="relative space-y-4 border-l border-border pl-5">
                {asset.versions.slice().reverse().map((v) => (
                  <li key={v.id} className="relative">
                    <span className="absolute -left-[23px] top-1 h-2.5 w-2.5 rounded-full bg-primary" />
                    <div className="flex items-center gap-2">
                      <Typography variant="h6">{v.version}</Typography>
                      {v.isCurrent && <Badge tone="success">atual</Badge>}
                      <span className="text-xs text-muted">{relativeDate(v.releasedAt)}</span>
                    </div>
                    {v.notes && <Typography variant="small">{v.notes}</Typography>}
                  </li>
                ))}
              </ol>
            ) : (
              <Typography variant="small">Sem versões registradas.</Typography>
            )}
          </Section>

          {/* Histórico de updates */}
          {asset.updates.length > 0 && (
            <Section icon="sparkles" title="Novidades">
              <ul className="space-y-3">
                {asset.updates.map((u) => (
                  <li key={u.id} className="flex items-start gap-3">
                    <Badge tone="primary">{updateLabel[u.type]}</Badge>
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
                <Icon name="bolt" size={16} /> Abrir
              </a>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={remixUrl ?? undefined} target="_blank" rel="noopener noreferrer"
                  aria-disabled={!remixUrl}
                  className={`flex h-11 items-center justify-center gap-2 rounded-interactive border border-border text-sm font-semibold transition-colors ${remixUrl ? 'text-content hover:bg-surface' : 'pointer-events-none text-muted/50'}`}
                >
                  <Icon name="remix" size={15} /> Remixar
                </a>
                <button
                  onClick={onToggleFav}
                  className="flex h-11 items-center justify-center gap-2 rounded-interactive border border-border text-sm font-semibold text-content transition-colors hover:bg-surface"
                >
                  <Icon name={fav ? 'favorite-solid' : 'favorite'} size={15} className={fav ? 'text-danger' : ''} />
                  {fav ? 'Favorito' : 'Favoritar'}
                </button>
                <button
                  onClick={() => copy('share', typeof window !== 'undefined' ? window.location.href : '')}
                  className="flex h-11 items-center justify-center gap-2 rounded-interactive border border-border text-sm font-semibold text-content transition-colors hover:bg-surface"
                >
                  <Icon name={copied === 'share' ? 'check' : 'share'} size={15} className={copied === 'share' ? 'text-success' : ''} />
                  {copied === 'share' ? 'Copiado' : 'Compartilhar'}
                </button>
                <a
                  href={downloadUrl ?? undefined} target="_blank" rel="noopener noreferrer"
                  aria-disabled={!downloadUrl}
                  className={`flex h-11 items-center justify-center gap-2 rounded-interactive border border-border text-sm font-semibold transition-colors ${downloadUrl ? 'text-content hover:bg-surface' : 'pointer-events-none text-muted/50'}`}
                >
                  <Icon name="download" size={15} /> Download
                </a>
                <button
                  onClick={() => copy('prompt', promptCopyTarget)}
                  disabled={!promptAvailable}
                  className="flex h-11 items-center justify-center gap-2 rounded-interactive border border-border text-sm font-semibold text-content transition-colors hover:bg-surface disabled:pointer-events-none disabled:text-muted/50"
                  title={promptText ? 'Copiar conteúdo completo do prompt' : 'Copiar link do prompt'}
                >
                  <Icon name={copied === 'prompt' ? 'check' : 'clipboard'} size={15} className={copied === 'prompt' ? 'text-success' : ''} />
                  {copied === 'prompt' ? 'Copiado' : 'Copiar Prompt'}
                </button>
              </div>
              {favMsg && <p className="text-xs text-danger">{favMsg}</p>}
              <a
                href={docsUrl ?? undefined} target="_blank" rel="noopener noreferrer"
                aria-disabled={!docsUrl}
                className={`flex h-11 w-full items-center justify-center gap-2 rounded-interactive text-sm font-semibold transition-colors ${docsUrl ? 'text-primary hover:bg-primary/10' : 'pointer-events-none text-muted/50'}`}
              >
                <Icon name="docs" size={15} /> Abrir documentação
              </a>
            </div>

            {/* Adicionar à coleção */}
            <div className="border-t border-border pt-3">
              <Typography variant="caption" className="mb-2 block uppercase tracking-wide">Adicionar à coleção</Typography>
              <div className="flex gap-2">
                <select
                  value=""
                  onChange={(e) => { addToColl(e.target.value); e.target.value = ''; }}
                  className="h-9 flex-1 rounded-interactive border border-border bg-surface px-2 text-sm text-content focus:outline-none"
                >
                  <option value="">Escolher coleção…</option>
                  {(collections.data ?? []).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <button type="button" onClick={onNewColl} className="rounded-interactive border border-border px-2 text-muted transition-colors hover:text-content" title="Nova coleção">
                  <Icon name="plus" size={14} />
                </button>
              </div>
              {collMsg && <p className="mt-1 text-xs text-success">{collMsg}</p>}
            </div>

            {/* Metadados */}
            <div className="divide-y divide-border border-t border-border pt-1">
              <Meta icon="clipboard" label="Versão atual" value={asset.version} />
              <Meta icon="recent" label="Atualizado" value={relativeDate(asset.updatedAt)} />
              {asset.setupTimeMinutes != null && (
                <Meta icon="bolt" label="Personalização" value={`~${asset.setupTimeMinutes} min`} />
              )}
              {asset.timeToPublishMinutes != null && (
                <Meta icon="rocket" label="Até publicação" value={`~${asset.timeToPublishMinutes} min`} />
              )}
              <Meta icon="star" label="Nível" value={asset.level.charAt(0).toUpperCase() + asset.level.slice(1)} />
              <Meta icon="money" label="Receita" value={revenueLabel[asset.revenueModel]} />
              <Meta icon="cube" label="Bundle" value={bundleLabel[asset.deliveryBundle]} />
              <Meta icon="docs" label="Licença" value={licenseLabel[asset.license]} />
              {asset.difficulty && (
                <Meta icon="chart" label="Dificuldade" value={difficultyLabel[asset.difficulty]} />
              )}
              {asset.suggestedPrice != null && (
                <Meta icon="money" label="Preço sugerido" value={`R$ ${asset.suggestedPrice.toFixed(2)}`} />
              )}
            </div>

            {/* Links diretos */}
            {asset.links.length > 0 && (
              <div className="border-t border-border pt-3">
                <Typography variant="caption" className="mb-2 block uppercase tracking-wide">Links</Typography>
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
