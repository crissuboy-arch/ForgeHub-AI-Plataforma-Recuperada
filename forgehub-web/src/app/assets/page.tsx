// src/app/assets/page.tsx
import { AssetGrid } from '../../components/organisms/AssetGrid';
import { PageHeader } from '../../components/molecules/PageHeader';
import { Badge } from '../../components/atoms/Badge';
import { Icon } from '../../components/atoms/Icon';
import { mockAssets } from '../../data/mockAssets';

const categories = ['Todos', 'MicroApp', 'AI Agent', 'Landing', 'Prompt', 'Copy'];

export default function AssetsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <PageHeader
        title="Assets"
        subtitle="Sua biblioteca de ativos digitais inteligentes."
      />

      {/* Busca + filtros (visuais) */}
      <div className="mb-6 flex flex-col gap-3">
        <div className="flex h-11 items-center gap-2 rounded-interactive border border-border bg-surface px-3 text-muted">
          <Icon name="search" size={18} />
          <span className="text-sm">Buscar por nome, categoria ou tag…</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((c, i) => (
            <Badge key={c} tone={i === 0 ? 'primary' : 'default'}>
              {c}
            </Badge>
          ))}
        </div>
      </div>

      <AssetGrid assets={mockAssets} />
    </div>
  );
}
