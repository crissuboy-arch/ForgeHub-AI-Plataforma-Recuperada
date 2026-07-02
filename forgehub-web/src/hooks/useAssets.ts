// src/hooks/useAssets.ts
// Hooks React Query da camada de dados de Assets (Sprint 2).
// Ainda NÃO consumidos pela UI — serão ligados à ficha premium na Sprint 3.
// Requerem um QueryClientProvider na árvore (já provido por MainLayout/AuthLayout).
'use client';
import { useQuery } from '@tanstack/react-query';
import { listAssets, getAssetDetail, listCategories, listPlatforms } from '../data/assets';

export const assetKeys = {
  all: ['assets'] as const,
  list: () => [...assetKeys.all, 'list'] as const,
  detail: (slug: string) => [...assetKeys.all, 'detail', slug] as const,
  categories: ['categories'] as const,
  platforms: ['platforms'] as const,
};

export function useAssets() {
  return useQuery({
    queryKey: assetKeys.list(),
    queryFn: listAssets,
    staleTime: 60_000,
  });
}

export function useAssetDetail(slug: string) {
  return useQuery({
    queryKey: assetKeys.detail(slug),
    queryFn: () => getAssetDetail(slug),
    enabled: Boolean(slug),
    staleTime: 60_000,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: assetKeys.categories,
    queryFn: listCategories,
    staleTime: 5 * 60_000,
  });
}

export function usePlatforms() {
  return useQuery({
    queryKey: assetKeys.platforms,
    queryFn: listPlatforms,
    staleTime: 5 * 60_000,
  });
}
