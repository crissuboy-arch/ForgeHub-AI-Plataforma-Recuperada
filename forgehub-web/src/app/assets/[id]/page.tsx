// src/app/assets/[id]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { mockAssets } from '../../../data/mockAssets';
import { Typography } from '../../../components/atoms/Typography';
import { Button } from '../../../components/atoms/Button';
import { Badge } from '../../../components/atoms/Badge';
import { Icon } from '../../../components/atoms/Icon';

export default async function AssetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const asset = mockAssets.find((a) => a.id === id);
  if (!asset) return notFound();

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <Link
        href="/assets"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-content"
      >
        <Icon name="back" size={16} /> Voltar para Assets
      </Link>

      {/* Capa */}
      <div className="mb-6 flex h-48 items-center justify-center rounded-container bg-brand-glow">
        <Icon name="asset" size={56} className="text-white/70" />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Coluna principal */}
        <div className="lg:col-span-2">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge tone="primary">{asset.category}</Badge>
            <Badge tone="success">Ativo</Badge>
            <Typography variant="caption">{asset.version}</Typography>
          </div>
          <Typography variant="h2" className="mb-3">
            {asset.name}
          </Typography>
          <Typography variant="p" className="mb-8">
            {asset.shortDescription}
          </Typography>

          <div className="flex flex-wrap gap-3">
            <Button variant="primary">
              <Icon name="bolt" size={16} />
              Abrir
            </Button>
            <Button variant="secondary">
              <Icon name="remix" size={16} />
              Remixar
            </Button>
            <Button variant="ghost">
              <Icon name="favorite" size={16} />
              Favoritar
            </Button>
          </div>
        </div>

        {/* Painel lateral de metadados */}
        <aside className="rounded-container border border-border bg-card p-6">
          <Typography variant="h5" className="mb-4">
            Detalhes
          </Typography>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Categoria</dt>
              <dd className="text-content">{asset.category}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Versão</dt>
              <dd className="text-content">{asset.version}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Atualizado</dt>
              <dd className="text-content">{asset.updatedAt}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Licença</dt>
              <dd className="text-content">Revenda permitida</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}
