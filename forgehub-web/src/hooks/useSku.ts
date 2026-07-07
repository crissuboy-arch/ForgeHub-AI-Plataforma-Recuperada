'use client';
// src/hooks/useSku.ts — acesso à biblioteca externa de Skills/Packs (SKU).
// URL configurável por NEXT_PUBLIC_SKU_LIBRARY_URL. Sem URL → toast informativo.
import { useLanguage } from '../lib/i18n/LanguageProvider';
import { useToast } from '../components/organisms/Toast';

export function useSku(): { url: string; configured: boolean; open: () => void } {
  const { t } = useLanguage();
  const { toast } = useToast();
  const url = process.env.NEXT_PUBLIC_SKU_LIBRARY_URL || '';
  const open = () => {
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
    else toast(t('sku.notConfigured'), 'info');
  };
  return { url, configured: Boolean(url), open };
}
