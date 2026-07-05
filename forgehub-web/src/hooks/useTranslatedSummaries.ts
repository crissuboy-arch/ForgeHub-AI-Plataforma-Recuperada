'use client';
// src/hooks/useTranslatedSummaries.ts
// Traduz nome/descrição dos Kits em listas/cards para o idioma ativo (item 2),
// com fallback para o conteúdo base. Uma única consulta por lista.
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import { useLanguage } from '../lib/i18n/LanguageProvider';
import type { AssetSummary } from '../types';

async function fetchMap(ids: string[], language: string): Promise<Record<string, { name?: string; short?: string }>> {
  if (!ids.length) return {};
  const { data } = await supabase
    .from('asset_translations')
    .select('asset_id, name, short_description')
    .in('asset_id', ids)
    .eq('language', language);
  const out: Record<string, { name?: string; short?: string }> = {};
  ((data ?? []) as Record<string, unknown>[]).forEach((r) => {
    out[r.asset_id as string] = { name: (r.name as string) || undefined, short: (r.short_description as string) || undefined };
  });
  return out;
}

export function useTranslatedSummaries(items?: AssetSummary[]): AssetSummary[] {
  const { lang } = useLanguage();
  const ids = useMemo(() => (items ?? []).map((i) => i.id), [items]);
  const key = ids.join(',');
  const { data: map } = useQuery({
    queryKey: ['tr-summaries', lang, key],
    queryFn: () => fetchMap(ids, lang),
    enabled: ids.length > 0,
  });
  return useMemo(
    () =>
      (items ?? []).map((it) => {
        const tr = map?.[it.id];
        return tr ? { ...it, name: tr.name || it.name, shortDescription: tr.short || it.shortDescription } : it;
      }),
    [items, map],
  );
}
