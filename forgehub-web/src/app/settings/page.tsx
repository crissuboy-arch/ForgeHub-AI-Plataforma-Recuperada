// src/app/settings/page.tsx
import React, { useState } from 'react';
import { MainLayout } from '../../components/templates/MainLayout';
import { Input } from '../../components/atoms/Input';
import { Button } from '../../components/atoms/Button';
import { Typography } from '../../components/atoms/Typography';

export default function SettingsPage() {
  const [fullName, setFullName] = useState('');
  const [theme, setTheme] = useState('light');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now just log – persist later.
    console.log('Saved', { fullName, theme });
  };

  return (
    <MainLayout>
      <section className="p-4 max-w-md mx-auto">
        <Typography variant="h4" className="mb-4">
          Configurações
        </Typography>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Typography variant="small" className="block mb-1">
              Nome Completo
            </Typography>
            <Input
              type="text"
              placeholder="Seu nome"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div>
            <Typography variant="small" className="block mb-1">
              Tema
            </Typography>
            <select
              className="w-full rounded border px-3 py-2"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            >
              <option value="light">Claro</option>
              <option value="dark">Escuro</option>
            </select>
          </div>
          <Button type="submit" variant="primary" className="w-full">
            Salvar
          </Button>
        </form>
      </section>
    </MainLayout>
  );
}
