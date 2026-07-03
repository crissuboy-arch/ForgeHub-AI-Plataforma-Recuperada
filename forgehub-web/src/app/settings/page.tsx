'use client';
// src/app/settings/page.tsx — Configurações persistidas no Supabase (user_settings).
import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/molecules/PageHeader';
import { FormField } from '../../components/molecules/FormField';
import { Button } from '../../components/atoms/Button';
import { Typography } from '../../components/atoms/Typography';
import { getSettings, saveSettings } from '../../data/userData';

export default function SettingsPage() {
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [workspace, setWorkspace] = useState('');
  const [language, setLanguage] = useState('pt');
  const [theme, setTheme] = useState('dark');
  const [newsletter, setNewsletter] = useState(false);
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getSettings()
      .then((s) => {
        if (!s) return;
        setFullName(s.fullName ?? '');
        setAvatarUrl(s.avatarUrl ?? '');
        setWorkspace(s.workspace ?? '');
        setLanguage(s.language ?? 'pt');
        setTheme(s.theme ?? 'dark');
        setNewsletter(Boolean((s.preferences as { newsletter?: boolean })?.newsletter));
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      await saveSettings({ fullName, avatarUrl, workspace, language, theme, preferences: { newsletter } });
      setMsg({ kind: 'ok', text: 'Alterações salvas com sucesso.' });
    } catch (err) {
      setMsg({ kind: 'err', text: err instanceof Error ? err.message : String(err) });
    } finally {
      setBusy(false);
    }
  };

  const inputClass = 'w-full h-11 px-3 rounded-interactive bg-surface text-content border border-border focus:outline-none focus-visible:ring-2 focus-visible:ring-primary';

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <PageHeader title="Configurações" subtitle="Gerencie seu perfil e preferências." />

      {msg && (
        <div className={`mb-6 rounded-interactive border px-4 py-3 text-sm ${msg.kind === 'ok' ? 'border-success/30 bg-success/10 text-success' : 'border-danger/30 bg-danger/10 text-danger'}`}>
          {msg.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Perfil */}
        <section className="rounded-container border border-border bg-card p-6">
          <Typography variant="h5" className="mb-4">Perfil</Typography>
          <div className="space-y-4">
            <FormField id="fullName" label="Nome completo" placeholder="Seu nome" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            <FormField id="avatarUrl" label="Avatar (URL)" placeholder="https://…" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} />
            <FormField id="workspace" label="Workspace" placeholder="Nome do seu workspace" value={workspace} onChange={(e) => setWorkspace(e.target.value)} />
          </div>
        </section>

        {/* Preferências */}
        <section className="rounded-container border border-border bg-card p-6">
          <Typography variant="h5" className="mb-4">Preferências</Typography>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-content">Idioma</span>
              <select className={inputClass} value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option value="pt">Português</option>
                <option value="en">Inglês</option>
                <option value="es">Espanhol</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-content">Tema</span>
              <select className={inputClass} value={theme} onChange={(e) => setTheme(e.target.value)}>
                <option value="dark">Dark Slate</option>
                <option value="light">Claro</option>
              </select>
            </label>
          </div>
          <label className="mt-4 flex items-center gap-2 text-sm text-content">
            <input type="checkbox" className="h-4 w-4 accent-[var(--color-primary)]" checked={newsletter} onChange={(e) => setNewsletter(e.target.checked)} />
            Receber novidades e atualizações
          </label>
        </section>

        <div className="flex justify-end">
          <Button type="submit" variant="primary" loading={busy}>Salvar alterações</Button>
        </div>
      </form>
    </div>
  );
}
