'use client';
// src/components/organisms/AssetGrid.tsx
// Consome os dados reais do Supabase (useAssets) com os três estados de UX:
// carregando (skeletons) → conteúdo (cards) → vazio/erro.
import React from 'react';
import { AssetCard } from '../molecules/AssetCard';
import { EmptyState } from '../molecules/EmptyState';
import { Skeleton } from '../atoms/Skeleton';
import { useAssets } from '../../hooks/useAssets';
import type { AssetSummary } from '../../types';

const gridClass = 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

function CardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-container border border-border bg-card">
      <Skeleton className="h-32 rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    </div>
  );
}

export const AssetGrid: React.FC<{ assets?: AssetSummary[] }> = ({ assets: provided }) => {
  const { data, isLoading: fetching, isError: fetchError } = useAssets();
  const isLoading = provided ? false : fetching;
  const isError = provided ? false : fetchError;

  if (isLoading) {
    return (
      <div className={gridClass}>
        {Array.from({ length: 8 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        iconName="bolt"
        title="Não foi possível carregar os assets"
        description="Houve um erro ao consultar a biblioteca. Tente recarregar a página."
      />
    );
  }

  const assets = provided ?? data ?? [];
  if (assets.length === 0) {
    return (
      <EmptyState
        iconName="stack"
        title="Nenhum asset por aqui ainda"
        description="Assim que novos ativos forem publicados, eles aparecem aqui."
      />
    );
  }

  return (
    <div className={gridClass}>
      {assets.map((asset, i) => (
        <div key={asset.id} className="animate-in" style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}>
          <AssetCard asset={asset} />
        </div>
      ))}
    </div>
  );
};
