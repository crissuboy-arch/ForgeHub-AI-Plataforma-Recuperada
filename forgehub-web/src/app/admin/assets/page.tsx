'use client';
// src/app/admin/assets/page.tsx — índice do Admin Asset Studio (lista para gerenciar)
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '../../../components/molecules/PageHeader';
import { Badge } from '../../../components/atoms/Badge';
import { Icon } from '../../../components/atoms/Icon';
import { Skeleton } from '../../../components/atoms/Skeleton';
import { Typography } from '../../../components/atoms/Typography';
import { listAllAssets } from '../../../data/adminAssets';
import { healthColor } from '../../../components/molecules/AssetCard';
import { ENUM_LABELS } from '../../../lib/assetSchema';

export default function AdminAssetsPage() {
  const { data, isLoading, isError } = useQuery({ queryKey: ['admin-all-assets'], queryFn: listAllAssets });

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <PageHeader
        title="Asset Studio"
        subtitle="Gerencie o catálogo — todos os assets, inclusive rascunhos."
        action={
          <Link href="/admin/assets/new" className="inline-flex h-11 items-center gap-2 rounded-interactive bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover">
            <Icon name="plus" size={16} /> Novo Asset
          </Link>
        }
      />

      {isLoading && <div className="space-y-2">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>}
      {isError && <Typography variant="small" className="text-danger">Erro ao carregar. Você precisa estar autenticado.</Typography>}

      {data && (
        <div className="overflow-hidden rounded-container border border-border">
          {data.length === 0 && <div className="p-6"><Typography variant="small">Nenhum asset. Crie o primeiro.</Typography></div>}
          {data.map((a) => (
            <Link key={a.id} href={`/admin/assets/edit/${a.slug}`} className="flex items-center justify-between gap-3 border-b border-border bg-card px-4 py-3 transition-colors last:border-0 hover:bg-surface">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Typography variant="h6" className="truncate">{a.name}</Typography>
                  <Badge tone={a.status === 'draft' ? 'warning' : a.status === 'archived' ? 'default' : 'success'}>{ENUM_LABELS[a.status] ?? a.status}</Badge>
                </div>
                <Typography variant="caption" className="truncate">{a.slug}</Typography>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className={`text-sm font-semibold ${healthColor(a.healthScore)}`}>{a.healthScore}%</span>
                <Badge tone="default">{ENUM_LABELS[a.level] ?? a.level}</Badge>
                <Icon name="chevron" size={16} className="text-muted" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
