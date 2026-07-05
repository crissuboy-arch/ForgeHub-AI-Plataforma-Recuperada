'use client';
// src/components/molecules/SmartImageUpload.tsx
// Upload Inteligente (itens 3/4/14/15): 1 imagem → Thumbnail (1:1), Card (4:3),
// Hero (16:9) e Preview/Social (1200×630) — cover-crop + WebP. Preview imediato,
// progresso, tempo restante, cancelar, trocar e remover.
import React, { useRef, useState } from 'react';
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
  const [eta, setEta] = useState<number | null>(null);
  const [done, setDone] = useState<PresetKey[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [previews, setPreviews] = useState<Partial<Record<PresetKey, string>>>({});
  const [original, setOriginal] = useState<string | null>(null);
  const canceled = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setPreviews({});
    setDone([]);
    setPct(0);
    setEta(null);
    setErr(null);
    if (original) URL.revokeObjectURL(original);
    setOriginal(null);
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    canceled.current = false;
    reset();
    setBusy(true);
    setOriginal(URL.createObjectURL(f)); // preview imediato da imagem escolhida
    const startedAt = performance.now();
    try {
      const variants = await generateVariants(f);
      const keys = Object.keys(variants) as PresetKey[];
      let i = 0;
      for (const key of keys) {
        if (canceled.current) break;
        const url = await uploadMedia(variants[key], undefined, `-${key}`);
        onDone(FIELD[key], url);
        setPreviews((p) => ({ ...p, [key]: url }));
        setDone((d) => [...d, key]);
        i += 1;
        const frac = i / keys.length;
        setPct(Math.round(frac * 100));
        const elapsed = performance.now() - startedAt;
        setEta(i < keys.length ? (elapsed / i) * (keys.length - i) : 0);
      }
      if (canceled.current) {
        toast(t('smart.canceled'), 'info');
      } else {
        setEta(0);
        toast(t('toast.uploadDone'), 'success');
      }
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : String(ex));
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  };

  const onCancel = () => { canceled.current = true; };

  const onRemove = () => {
    (Object.keys(FIELD) as PresetKey[]).forEach((k) => onDone(FIELD[k], ''));
    reset();
  };

  return (
    <div className="rounded-container border border-dashed border-primary/40 bg-primary/5 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Icon name="sparkles" size={16} className="text-primary-hover" />
          <span className="text-sm font-semibold text-content">{t('smart.title')}</span>
        </div>
        <div className="flex items-center gap-2">
          {busy && (
            <button type="button" onClick={onCancel} className="rounded-interactive border border-border px-3 py-1.5 text-sm text-danger transition-colors hover:bg-danger/10">
              {t('smart.cancel')}
            </button>
          )}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="rounded-interactive bg-brand-glow px-3 py-1.5 text-sm font-semibold text-white transition-shadow hover:shadow-[var(--shadow-glow-blue)] disabled:opacity-60"
          >
            {busy ? `${t('smart.processing')}… ${pct}%` : original ? t('smart.replace') : t('smart.send')}
          </button>
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onFile} disabled={busy} />
        </div>
      </div>

      <p className="mb-3 text-xs text-muted">{t('smart.hint')}</p>

      {/* Preview da imagem original + progresso/ETA */}
      {original && (
        <div className="mb-3 flex items-center gap-3 rounded-interactive border border-border bg-surface p-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={original} alt="" className="h-14 w-14 shrink-0 rounded-md object-cover" />
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="truncate text-muted">{t('smart.original')}</span>
              {busy && eta != null && eta > 0 && (
                <span className="shrink-0 text-dim">~{Math.ceil(eta / 1000)}s {t('smart.timeLeft')}</span>
              )}
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
              <div className="h-full rounded-full bg-primary transition-all duration-200" style={{ width: `${pct}%` }} />
            </div>
          </div>
          {!busy && (
            <button type="button" onClick={onRemove} title={t('smart.remove')} className="shrink-0 rounded-interactive border border-border px-2 py-1.5 text-danger transition-colors hover:bg-danger/10">
              <Icon name="x" size={14} />
            </button>
          )}
        </div>
      )}

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
