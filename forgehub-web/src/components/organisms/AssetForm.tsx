'use client';
// src/components/organisms/AssetForm.tsx
// Admin Asset Studio — formulário CRUD completo (React Hook Form + Zod + Supabase).
import React, { useState } from 'react';
import { useForm, useFieldArray, Controller, useWatch, type Control, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Typography } from '../atoms/Typography';
import { Icon } from '../atoms/Icon';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import {
  assetFormSchema, emptyFormValues, computeHealth, ENUM_LABELS,
  LEVELS, STATUSES, LICENSES, REVENUE_MODELS, DELIVERY_BUNDLES,
  LINK_FIELDS, CHECKLIST_ITEMS, COUNTRIES, LANGUAGES, type AssetFormValues,
} from '../../lib/assetSchema';
import { listCategories, listPlatforms, listAiTools, listTags, listNiches, saveAsset, deleteAsset, duplicateAsset } from '../../data/adminAssets';
import { uploadMedia } from '../../data/storage';
import { SmartImageUpload } from '../molecules/SmartImageUpload';
import { healthColor } from '../molecules/AssetCard';
import { useLanguage } from '../../lib/i18n/LanguageProvider';

type MediaKey =
  | 'coverUrl' | 'bannerUrl' | 'logoUrl' | 'thumbnailUrl' | 'previewUrl' | 'mockupUrl';

// Upload real no Supabase Storage: preview imediato, barra de progresso, substituir/remover.
function MediaUpload({ label, name, control, setValue, register }: {
  label: string; name: MediaKey; control: Control<AssetFormValues>;
  setValue: (n: MediaKey, v: string, o?: object) => void;
  register: ReturnType<typeof useForm<AssetFormValues>>['register'];
}) {
  const { t } = useLanguage();
  const url = useWatch({ control, name }) as string;
  const [pct, setPct] = useState<number | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setErr(null); setPct(0);
    try {
      const publicUrl = await uploadMedia(f, setPct);
      setValue(name, publicUrl, { shouldValidate: true });
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : String(ex));
    } finally {
      setPct(null);
      e.target.value = '';
    }
  };
  return (
    <Field label={label}>
      <div className="flex items-center gap-3">
        <div className="flex h-16 w-24 shrink-0 items-center justify-center overflow-hidden rounded-interactive border border-border bg-surface">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="" className="h-full w-full object-cover" />
          ) : (
            <Icon name="asset" size={20} className="text-muted" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap gap-2">
            <label className="cursor-pointer rounded-interactive border border-border bg-surface px-3 py-1.5 text-sm text-content transition-colors hover:bg-card">
              <Icon name="download" size={13} className="mr-1 inline rotate-180" /> {url ? t('studio.replace') : t('studio.upload')}
              <input type="file" accept="image/*" className="hidden" onChange={onFile} />
            </label>
            {url && (
              <button type="button" onClick={() => setValue(name, '', { shouldValidate: true })}
                className="rounded-interactive border border-border px-3 py-1.5 text-sm text-danger transition-colors hover:bg-danger/10">
                <Icon name="x" size={13} className="mr-1 inline" /> {t('studio.remove')}
              </button>
            )}
          </div>
          {pct != null && (
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border">
              <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
            </div>
          )}
          {err && <span className="mt-1 block text-xs text-danger">{err}</span>}
        </div>
      </div>
      <input className={`${inputClass} mt-2`} placeholder={t('studio.urlPlaceholder')} {...register(name)} />
    </Field>
  );
}

// ------------------------------------------------------------- Campos base
const inputClass =
  'w-full h-11 px-3 rounded-interactive bg-surface text-content placeholder:text-muted border border-border focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-colors';

function Field({ label, error, children, hint }: { label: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-2 text-sm font-medium text-content">{label}</span>
      {children}
      {hint && !error && <span className="mt-1 block text-xs text-muted">{hint}</span>}
      {error && <span className="mt-1 block text-xs text-danger">{error}</span>}
    </label>
  );
}

function Section({ n, icon, title, children, aside }: { n: number; icon: string; title: string; children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <section className="rounded-container border border-border bg-card p-6 ring-hairline">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-interactive bg-primary/15 text-xs font-bold text-primary-hover">{n}</span>
          <Icon name={icon} size={18} className="text-muted" />
          <Typography variant="h5">{title}</Typography>
        </div>
        {aside}
      </div>
      {children}
    </section>
  );
}

function Select({ options, ...rest }: { options: readonly string[] } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={inputClass} {...rest}>
      {options.map((o) => <option key={o} value={o}>{ENUM_LABELS[o] ?? o}</option>)}
    </select>
  );
}

// Multi-toggle de chips (plataformas, IA, países, idiomas)
function ChipMulti({ control, name, options }: {
  control: Control<AssetFormValues>; name: 'platforms' | 'aiTools' | 'countries' | 'languages';
  options: { value: string; label: string }[];
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const val: string[] = field.value ?? [];
        const toggle = (v: string) =>
          field.onChange(val.includes(v) ? val.filter((x) => x !== v) : [...val, v]);
        return (
          <div className="flex flex-wrap gap-2">
            {options.map((o) => {
              const active = val.includes(o.value);
              return (
                <button
                  key={o.value} type="button" onClick={() => toggle(o.value)}
                  className={`lift rounded-interactive border px-3 py-1.5 text-sm transition-colors ${active ? 'border-primary bg-primary/15 text-primary-hover' : 'border-border bg-surface text-muted hover:text-content'}`}
                >
                  {active && <Icon name="check" size={12} className="mr-1 inline" />}{o.label}
                </button>
              );
            })}
          </div>
        );
      }}
    />
  );
}

// Autocomplete de Tags
function TagInput({ control, suggestions }: { control: Control<AssetFormValues>; suggestions: string[] }) {
  const { t: tr } = useLanguage();
  const [text, setText] = useState('');
  return (
    <Controller
      control={control}
      name="tags"
      render={({ field }) => {
        const tags: string[] = field.value ?? [];
        const add = (t: string) => {
          const v = t.trim();
          if (v && !tags.includes(v)) field.onChange([...tags, v]);
          setText('');
        };
        return (
          <div>
            <div className="mb-2 flex flex-wrap gap-2">
              {tags.map((t) => (
                <span key={t} className="inline-flex items-center gap-1 rounded-interactive bg-primary/15 px-2.5 py-1 text-sm text-primary-hover">
                  {t}
                  <button type="button" onClick={() => field.onChange(tags.filter((x) => x !== t))}><Icon name="x" size={12} /></button>
                </span>
              ))}
            </div>
            <input
              className={inputClass} value={text} list="tag-suggestions"
              placeholder={tr('studio.tagPlaceholder')}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(text); } }}
            />
            <datalist id="tag-suggestions">{suggestions.map((s) => <option key={s} value={s} />)}</datalist>
          </div>
        );
      }}
    />
  );
}

// ------------------------------------------------------------- Formulário
type Props = { mode: 'new' | 'edit'; assetId?: string; initialValues?: AssetFormValues };

export function AssetForm({ mode, assetId, initialValues }: Props) {
  const router = useRouter();
  const { t } = useLanguage();
  const { register, handleSubmit, control, setValue, formState: { errors } } =
    useForm<AssetFormValues>({
      resolver: zodResolver(assetFormSchema) as unknown as Resolver<AssetFormValues>,
      defaultValues: initialValues ?? emptyFormValues(),
    });

  const categories = useQuery({ queryKey: ['adm-categories'], queryFn: listCategories });
  const niches = useQuery({ queryKey: ['adm-niches'], queryFn: listNiches });
  const platforms = useQuery({ queryKey: ['adm-platforms'], queryFn: listPlatforms });
  const aiTools = useQuery({ queryKey: ['adm-ai'], queryFn: listAiTools });
  const tags = useQuery({ queryKey: ['adm-tags'], queryFn: listTags });

  const filesFA = useFieldArray({ control, name: 'files' });
  const shotsFA = useFieldArray({ control, name: 'screenshots' });

  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const shots = useWatch({ control, name: 'screenshots' }) as AssetFormValues['screenshots'];
  const checklistVal = useWatch({ control, name: 'checklist' });
  const currentSlug = useWatch({ control, name: 'slug' });
  const nameVal = useWatch({ control, name: 'name' });
  const health = computeHealth(checklistVal);

  const run = async (label: string, fn: () => Promise<void>) => {
    setBusy(label); setMsg(null);
    try { await fn(); } catch (e) {
      setMsg({ kind: 'err', text: e instanceof Error ? e.message : String(e) });
    } finally { setBusy(null); }
  };

  const doSave = (publish: boolean) => handleSubmit(
    (values) => run(publish ? 'publish' : 'save', async () => {
      const res = await saveAsset(values, { id: assetId, publish });
      setMsg({ kind: 'ok', text: publish ? t('studio.published') : t('studio.saved') });
      if (mode === 'new') router.push(`/admin/assets/edit/${res.slug}`);
    }),
    () => setMsg({ kind: 'err', text: t('studio.fixFields') }),
  );

  const onDuplicate = () => run('dup', async () => {
    const res = await duplicateAsset(currentSlug);
    if (res) router.push(`/admin/assets/edit/${res.slug}`);
  });
  const onDelete = () => {
    if (!assetId || !window.confirm(t('studio.confirmDelete'))) return;
    run('del', async () => { await deleteAsset(assetId); router.push('/admin/assets'); });
  };

  // Slugify ao vivo: aceita MAIÚSCULAS, minúsculas e espaços; converte tudo em
  // slug válido. Mantém hífen final durante a digitação (para digitar espaços
  // naturalmente); a finalização (blur/gerar) remove o hífen sobrando.
  const liveSlug = (s: string) =>
    s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+/, '');
  const finalizeSlug = (s: string) => liveSlug(s).replace(/-+$/, '');
  const slugFromName = () => setValue('slug', finalizeSlug(nameVal || ''), { shouldValidate: true });

  return (
    <form className="mx-auto max-w-5xl px-6 py-8">
      {/* Cabeçalho + ações */}
      <div className="glass sticky top-0 z-10 -mx-6 mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-4">
        <div>
          <Typography variant="h4">{mode === 'new' ? t('studio.newAsset') : t('studio.editAsset')}</Typography>
          <Typography variant="caption">{currentSlug || t('studio.noSlug')}</Typography>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" size="sm" onClick={() => currentSlug && window.open(`/assets/${currentSlug}`, '_blank')} disabled={mode === 'new'}>
            <Icon name="eye" size={15} /> {t('studio.preview')}
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={onDuplicate} loading={busy === 'dup'} disabled={mode === 'new'}>
            <Icon name="stack" size={15} /> {t('studio.duplicate')}
          </Button>
          <Button type="button" variant="danger" size="sm" onClick={onDelete} loading={busy === 'del'} disabled={mode === 'new'}>
            <Icon name="x" size={15} /> {t('studio.delete')}
          </Button>
          <Button type="button" variant="secondary" size="sm" onClick={doSave(false)} loading={busy === 'save'}>{t('studio.save')}</Button>
          <Button type="button" variant="primary" size="sm" onClick={doSave(true)} loading={busy === 'publish'}>
            <Icon name="rocket" size={15} /> {t('studio.savePublish')}
          </Button>
        </div>
      </div>

      {msg && (
        <div className={`mb-6 rounded-interactive border px-4 py-3 text-sm ${msg.kind === 'ok' ? 'border-success/30 bg-success/10 text-success' : 'border-danger/30 bg-danger/10 text-danger'}`}>
          {msg.text}
        </div>
      )}

      <div className="space-y-6">
        {/* 1. Dados básicos */}
        <Section n={1} icon="docs" title={t('studio.sec1')} aside={
          <span className={`flex items-center gap-1 text-sm font-semibold ${healthColor(health)}`}>
            <Icon name="check" size={14} /> Health {health}%
          </span>
        }>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t('studio.f.name')} error={errors.name?.message}><input className={inputClass} {...register('name')} /></Field>
            <Field label={t('studio.f.slug')} error={errors.slug?.message} hint={t('studio.f.slugHint')}>
              <div className="flex gap-2">
                <input
                  className={inputClass}
                  {...register('slug')}
                  onChange={(e) => setValue('slug', liveSlug(e.target.value), { shouldValidate: false })}
                  onBlur={(e) => setValue('slug', finalizeSlug(e.target.value), { shouldValidate: true })}
                />
                <Button type="button" variant="secondary" size="sm" onClick={slugFromName}>{t('studio.gen')}</Button>
              </div>
            </Field>
            <Field label={t('studio.f.category')} error={errors.category?.message}>
              <select className={inputClass} {...register('category')}>
                <option value="">{t('studio.select')}</option>
                {(categories.data ?? []).map((c) => <option key={c.slug} value={c.slug}>{c.label}</option>)}
              </select>
            </Field>
            <Field label={t('studio.f.language')}>
              <select className={inputClass} {...register('language')}>
                <option value="pt-BR">Português (PT-BR)</option>
                <option value="es">Español (ES)</option>
                <option value="en">English (EN)</option>
              </select>
            </Field>
            <Field label={t('studio.f.niche')}>
              <select className={inputClass} {...register('niche')}>
                <option value="">{t('studio.select')}</option>
                {(niches.data ?? []).map((n) => <option key={n.slug} value={n.slug}>{n.label}</option>)}
              </select>
            </Field>
            <Field label={t('studio.f.level')}><Select options={LEVELS} {...register('level')} /></Field>
            <Field label={t('studio.f.status')}><Select options={STATUSES} {...register('status')} /></Field>
            <Field label={t('studio.f.license')}><Select options={LICENSES} {...register('license')} /></Field>
            <Field label={t('studio.f.revenue')}><Select options={REVENUE_MODELS} {...register('revenueModel')} /></Field>
            <Field label={t('studio.f.bundle')}><Select options={DELIVERY_BUNDLES} {...register('deliveryBundle')} /></Field>
            <Field label={t('studio.f.setupTime')}><input type="number" className={inputClass} {...register('setupTimeMinutes')} /></Field>
            <Field label={t('studio.f.publishTime')}><input type="number" className={inputClass} {...register('timeToPublishMinutes')} /></Field>
            <Field label={t('studio.f.price')}><input type="number" step="0.01" className={inputClass} {...register('suggestedPrice')} /></Field>
            <Field label={t('studio.f.healthRO')}>
              <div className={`flex h-11 items-center rounded-interactive border border-border bg-surface px-3 font-semibold ${healthColor(health)}`}>{health}%</div>
            </Field>
          </div>
          <div className="mt-4 grid gap-4">
            <Field label={t('studio.f.shortDesc')} error={errors.shortDescription?.message}><input className={inputClass} {...register('shortDescription')} /></Field>
            <Field label={t('studio.f.fullDesc')}>
              <textarea className={`${inputClass} h-32 py-2`} {...register('fullDescription')} />
            </Field>
          </div>
        </Section>

        {/* 2. Mídia */}
        <Section n={2} icon="asset" title={t('studio.sec2')}>
          <div className="mb-4">
            <SmartImageUpload onDone={(field, url) => setValue(field, url, { shouldValidate: true })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <MediaUpload label={t('studio.m.cover')} name="coverUrl" control={control} setValue={setValue} register={register} />
            <MediaUpload label={t('studio.m.banner')} name="bannerUrl" control={control} setValue={setValue} register={register} />
            <MediaUpload label={t('studio.m.logo')} name="logoUrl" control={control} setValue={setValue} register={register} />
            <MediaUpload label={t('studio.m.thumbnail')} name="thumbnailUrl" control={control} setValue={setValue} register={register} />
            <MediaUpload label={t('studio.m.preview')} name="previewUrl" control={control} setValue={setValue} register={register} />
            <MediaUpload label={t('studio.m.mockup')} name="mockupUrl" control={control} setValue={setValue} register={register} />
            <Field label={t('studio.f.ytVideo')} error={errors.videoYoutubeUrl?.message}><input className={inputClass} placeholder="https://youtube.com/…" {...register('videoYoutubeUrl')} /></Field>
            <Field label={t('studio.f.loomVideo')} error={errors.videoLoomUrl?.message}><input className={inputClass} placeholder="https://loom.com/…" {...register('videoLoomUrl')} /></Field>
          </div>
          <Typography variant="caption" className="mt-3 block">{t('studio.mediaNote')}</Typography>

          {/* Conteúdo do Prompt (copiável na ficha) */}
          <div className="mt-5 grid gap-4">
            <Field label={t('studio.f.promptFormat')}>
              <select className={inputClass} {...register('promptFormat')}>
                <option value="markdown">Markdown</option>
                <option value="text">Texto (TXT)</option>
                <option value="json">JSON</option>
                <option value="prompt">Prompt</option>
              </select>
            </Field>
            <Field label={t('studio.f.promptContent')}>
              <textarea className={`${inputClass} h-40 py-2 font-mono text-xs`} placeholder={t('studio.promptPlaceholder')} {...register('promptContent')} />
            </Field>
          </div>
        </Section>

        {/* 3. Links */}
        <Section n={3} icon="external" title={t('studio.sec3')}>
          <div className="grid gap-4 sm:grid-cols-2">
            {LINK_FIELDS.map((l) => (
              <Field key={l.key} label={l.label} error={errors.links?.[l.key]?.message}>
                <input className={inputClass} placeholder="https://…" {...register(`links.${l.key}` as const)} />
              </Field>
            ))}
          </div>
        </Section>

        {/* 4. Plataformas */}
        <Section n={4} icon="cube" title={t('studio.sec4')}>
          <ChipMulti control={control} name="platforms" options={(platforms.data ?? []).map((p) => ({ value: p.slug, label: p.label }))} />
        </Section>

        {/* 5. IA utilizadas */}
        <Section n={5} icon="sparkles" title={t('studio.sec5')}>
          <ChipMulti control={control} name="aiTools" options={(aiTools.data ?? []).map((a) => ({ value: a.slug, label: a.label }))} />
        </Section>

        {/* 6. Países */}
        <Section n={6} icon="globe" title={t('studio.sec6')}>
          <ChipMulti control={control} name="countries" options={COUNTRIES.map((c) => ({ value: c.code, label: `${c.code} · ${c.name}` }))} />
        </Section>

        {/* 7. Idiomas */}
        <Section n={7} icon="language" title={t('studio.sec7')}>
          <ChipMulti control={control} name="languages" options={LANGUAGES.map((l) => ({ value: l.code, label: `${l.code} · ${l.name}` }))} />
        </Section>

        {/* 8. Tags */}
        <Section n={8} icon="tag" title={t('studio.sec8')}>
          <TagInput control={control} suggestions={(tags.data ?? []).map((t) => t.label)} />
        </Section>

        {/* 9. Arquivos */}
        <Section n={9} icon="download" title={t('studio.sec9')} aside={
          <Button type="button" variant="secondary" size="sm" onClick={() => filesFA.append({ name: '', kind: '', sizeBytes: null, url: '', driveFolder: '' })}>
            <Icon name="plus" size={14} /> {t('studio.add')}
          </Button>
        }>
          {filesFA.fields.length === 0 && <Typography variant="small">{t('studio.filesEmpty')}</Typography>}
          <div className="space-y-3">
            {filesFA.fields.map((f, i) => (
              <div key={f.id} className="grid items-end gap-2 rounded-interactive border border-border bg-surface p-3 sm:grid-cols-[1.4fr_1fr_0.8fr_1.6fr_auto]">
                <Field label={t('studio.f.fileName')}><input className={inputClass} {...register(`files.${i}.name` as const)} /></Field>
                <Field label={t('studio.f.fileType')}><input className={inputClass} placeholder="pdf, xlsx…" {...register(`files.${i}.kind` as const)} /></Field>
                <Field label={t('studio.f.fileSize')}><input type="number" className={inputClass} {...register(`files.${i}.sizeBytes` as const)} /></Field>
                <Field label={t('studio.f.fileLink')}><input className={inputClass} placeholder="https://drive…" {...register(`files.${i}.url` as const)} /></Field>
                <Button type="button" variant="ghost" size="sm" onClick={() => filesFA.remove(i)}><Icon name="x" size={15} /></Button>
              </div>
            ))}
          </div>
        </Section>

        {/* 10. Screenshots */}
        <Section n={10} icon="asset" title={t('studio.sec10')} aside={
          <Button type="button" variant="secondary" size="sm" onClick={() => shotsFA.append({ url: '', caption: '', position: shotsFA.fields.length })}>
            <Icon name="plus" size={14} /> {t('studio.add')}
          </Button>
        }>
          {shotsFA.fields.length === 0 && <Typography variant="small">{t('studio.shotsEmpty')}</Typography>}
          <div className="space-y-2">
            {shotsFA.fields.map((f, i) => (
              <div
                key={f.id}
                draggable
                onDragStart={() => setDragIdx(i)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => { if (dragIdx != null && dragIdx !== i) shotsFA.move(dragIdx, i); setDragIdx(null); }}
                className={`flex items-center gap-2 rounded-interactive border bg-surface p-2 ${dragIdx === i ? 'border-primary' : 'border-border'}`}
              >
                <span className="cursor-grab px-1 text-muted" title={t('studio.dragReorder')}><Icon name="menu" size={16} /></span>
                <span className="flex h-12 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-canvas">
                  {shots?.[i]?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={shots[i].url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <Icon name="asset" size={16} className="text-muted" />
                  )}
                </span>
                <input className={inputClass} placeholder={t('studio.shotUrl')} {...register(`screenshots.${i}.url` as const)} />
                <input className={inputClass} placeholder={t('studio.caption')} {...register(`screenshots.${i}.caption` as const)} />
                <input type="hidden" {...register(`screenshots.${i}.position` as const, { valueAsNumber: true })} />
                <div className="flex shrink-0 gap-1">
                  <button type="button" disabled={i === 0} onClick={() => shotsFA.move(i, i - 1)} className="rounded-md border border-border p-1.5 text-muted transition-colors hover:text-content disabled:opacity-30"><Icon name="chevron" size={14} className="-rotate-90" /></button>
                  <button type="button" disabled={i === shotsFA.fields.length - 1} onClick={() => shotsFA.move(i, i + 1)} className="rounded-md border border-border p-1.5 text-muted transition-colors hover:text-content disabled:opacity-30"><Icon name="chevron" size={14} className="rotate-90" /></button>
                  <button type="button" onClick={() => shotsFA.remove(i)} className="rounded-md border border-border p-1.5 text-danger transition-colors hover:bg-danger/10"><Icon name="x" size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* 11. Checklist */}
        <Section n={11} icon="check" title={t('studio.sec11')} aside={<span className={`text-sm font-semibold ${healthColor(health)}`}>Health {health}%</span>}>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {CHECKLIST_ITEMS.map((c) => (
              <label key={c.key} className="flex items-center gap-2 rounded-interactive border border-border bg-surface px-3 py-2 text-sm text-content">
                <input type="checkbox" className="h-4 w-4 accent-[var(--color-primary)]" {...register(`checklist.${c.key}` as const)} />
                {c.label}
              </label>
            ))}
          </div>
          <Typography variant="caption" className="mt-3 block">{t('studio.checklistNote')}</Typography>
        </Section>

        {/* 12. Analytics (somente leitura) */}
        <Section n={12} icon="chart" title={t('studio.sec12')}>
          {mode === 'new' ? (
            <Typography variant="small">{t('studio.analyticsNew')}</Typography>
          ) : (
            <div className="flex flex-wrap gap-2">
              {[t('stat.views'), t('stat.downloads'), t('stat.opens'), t('stat.favorites'), t('stat.remixes'), t('stat.shares')].map((m) => (
                <Badge key={m} tone="default">{m}</Badge>
              ))}
              <Typography variant="caption" className="mt-2 block w-full">
                {t('studio.analyticsNote')}
              </Typography>
            </div>
          )}
        </Section>
      </div>
    </form>
  );
}
