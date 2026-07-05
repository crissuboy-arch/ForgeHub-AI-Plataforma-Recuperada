'use client';
// src/components/molecules/SmartImageUpload.tsx
// Upload Inteligente: 1 imagem → gera Thumbnail (1:1), Card (4:3), Hero (16:9) e
// Preview (1200×630) automaticamente (cover-crop + WebP) e envia todas ao Storage.
import React, { useState } from 'react';
import { Icon } from '../atoms/Icon';
import { uploadMedia } from '../../data/storage';
import { generateVariants, IMAGE_PRESETS, type PresetKey } from '../../lib/image';
import { useLanguage } from '../../lib/i18n/LanguageProvider';
import { useToast } from '../organisms/Toast';

// preset → campo do formulário
const FIELD: Record<PresetKey, 'thumbnailUrl' | 'coverUrl' | 'bannerUrl' | 'previewUrl'> = {
  thumbnail: 'thumbnailUrl',
  card: 'coverUrl',
  hero: 'bannerUrl',
  preview: 'previewUrl',
};

type MediaField = 'thumbnailUrl' | 'coverUrl' | 'bannerUrl' | 'previewUrl';

export const SmartImageUpload: React.FC<{ onDone: (field: MediaField, url: string) => void }> = ({ onDone }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState<PresetKey[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [previews, setPreviews] = useState<Partial<Record<PresetKey, string>>>({});

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setBusy(true); setErr(null); setDone([]); setPct(0); setPreviews({});
    try {
      const variants = await generateVariants(f);
      const keys = Object.keys(variants) as PresetKey[];
      let i = 0;
      for (const key of keys) {
        const url = await uploadMedia(variants[key], undefined, `-${key}`);
        onDone(FIELD[key], url);
        setPreviews((p) => ({ ...p, [key]: url }));
        setDone((d) => [...d, key]);
        i += 1;
        setPct(Math.round((i / keys.length) * 100));
      }
      toast(t('toast.uploadDone'), 'success');
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : String(ex));
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  };

  return (
    <div className="rounded-container border border-dashed border-primary/40 bg-primary/5 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Icon name="sparkles" size={16} className="text-primary-hover" />
          <span className="text-sm font-semibold text-content">Upload Inteligente</span>
        </div>
        <label className="cursor-pointer rounded-interactive bg-brand-glow px-3 py-1.5 text-sm font-semibold text-white transition-shadow hover:shadow-[var(--shadow-glow-blue)]">
          {busy ? `Processando… ${pct}%` : 'Enviar 1 imagem'}
          <input type="file" accept="image/*" className="hidden" onChange={onFile} disabled={busy} />
        </label>
      </div>
      <p className="mb-3 text-xs text-muted">
        Envie <strong>uma</strong> imagem — geramos Thumbnail (1:1), Card (4:3), Hero (16:9) e Preview (1200×630),
        cortadas proporcionalmente e otimizadas em WebP.
      </p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {(Object.keys(IMAGE_PRESETS) as PresetKey[]).map((key) => (
          <div key={key} className="overflow-hidden rounded-interactive border border-border bg-surface">
            <div className="flex h-16 items-center justify-center bg-canvas">
              {previews[key] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previews[key]} alt="" className="h-full w-full object-cover" />
              ) : (
                <Icon name={done.includes(key) ? 'check' : 'asset'} size={16} className={done.includes(key) ? 'text-success' : 'text-muted'} />
              )}
            </div>
            <div className="px-2 py-1 text-center text-[10px] font-medium text-muted">
              {IMAGE_PRESETS[key].label} · {IMAGE_PRESETS[key].ratio}
            </div>
          </div>
        ))}
      </div>
      {err && <p className="mt-2 text-xs text-danger">{err}</p>}
    </div>
  );
};
