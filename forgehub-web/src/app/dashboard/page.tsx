// src/app/dashboard/page.tsx
import { AssetGrid } from '../../components/organisms/AssetGrid';
import { PageHeader } from '../../components/molecules/PageHeader';
import { Typography } from '../../components/atoms/Typography';
import { Icon } from '../../components/atoms/Icon';
import { mockAssets } from '../../data/mockAssets';

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <PageHeader title="Olá 👋" subtitle="Aqui está o resumo do seu workspace hoje." />

      {/* Banner Brand Glow */}
      <div className="mb-8 overflow-hidden rounded-container bg-brand-glow p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="max-w-lg">
            <Typography variant="h4" className="mb-1 text-white">
              Personalize um Asset Pack em menos de 2 minutos
            </Typography>
            <p className="text-white/80">
              Use o Auto Setup para injetar sua marca, copies e documentos automaticamente.
            </p>
          </div>
          <button className="inline-flex h-11 items-center gap-2 rounded-interactive bg-white px-5 text-sm font-semibold text-canvas transition-opacity hover:opacity-90">
            <Icon name="sparkles" size={16} />
            Começar Auto Setup
          </button>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <Typography variant="h4">Seus assets</Typography>
      </div>
      <AssetGrid assets={mockAssets} />
    </div>
  );
}
