'use client';
// src/app/settings/page.tsx
import React, { useState } from 'react';
import { PageHeader } from '../../components/molecules/PageHeader';
import { FormField } from '../../components/molecules/FormField';
import { Button } from '../../components/atoms/Button';
import { Typography } from '../../components/atoms/Typography';

export default function SettingsPage() {
  const [fullName, setFullName] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <PageHeader title="Configurações" subtitle="Gerencie seu perfil e preferências." />

      {saved && (
        <div className="mb-6 rounded-interactive border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
          Alterações salvas com sucesso.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Perfil */}
        <section className="rounded-container border border-border bg-card p-6">
          <Typography variant="h5" className="mb-4">
            Perfil
          </Typography>
          <div className="space-y-4">
            <FormField
              id="fullName"
              label="Nome completo"
              placeholder="Seu nome"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
        </section>

        {/* Aparência */}
        <section className="rounded-container border border-border bg-card p-6">
          <Typography variant="h5" className="mb-4">
            Aparência
          </Typography>
          <div className="flex items-center justify-between rounded-interactive border border-border bg-surface px-4 py-3">
            <div>
              <Typography variant="h6">Tema Dark Slate</Typography>
              <Typography variant="caption">O tema padrão da ForgeHub AI.</Typography>
            </div>
            <span className="rounded-md bg-primary/15 px-2.5 py-1 text-xs font-medium text-primary-hover">
              Ativo
            </span>
          </div>
        </section>

        <div className="flex justify-end">
          <Button type="submit" variant="primary">
            Salvar alterações
          </Button>
        </div>
      </form>
    </div>
  );
}
