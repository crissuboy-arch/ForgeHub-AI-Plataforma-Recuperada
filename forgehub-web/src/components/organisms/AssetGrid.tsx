'use client';
// src/components/organisms/AssetGrid.tsx
import React, { useEffect, useState } from 'react';
import { AssetCard } from '../molecules/AssetCard';
import { EmptyState } from '../molecules/EmptyState';
import { Skeleton } from '../atoms/Skeleton';
import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';
import { AssetSummary } from '../../types';

type AssetGridProps = {
  assets: AssetSummary[];
};

const gridClass =
  'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

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

/**
 * Grade de assets com os três estados de UX (Bible 2.3):
 * carregando (skeletons) → conteúdo (cards) → vazio (EmptyState).
 * O "loading" simula a busca dos dados mock para demonstrar o skeleton.
 */
export const AssetGrid: React.FC<AssetGridProps> = ({ assets }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 650);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <div className={gridClass}>
        {Array.from({ length: 8 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <EmptyState
        iconName="stack"
        title="Nenhum asset por aqui ainda"
        description="Explore o catálogo e adicione seu primeiro ativo para começar a forjar."
        action={
          <Button variant="primary">
            <Icon name="plus" size={16} />
            Explorar catálogo
          </Button>
        }
      />
    );
  }

  return (
    <div className={gridClass}>
      {assets.map((asset) => (
        <AssetCard key={asset.id} asset={asset} />
      ))}
    </div>
  );
};
