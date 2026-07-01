// src/app/assets/[id]/page.tsx
import { notFound } from 'next/navigation';
import { mockAssets } from '../../../data/mockAssets';
import { MainLayout } from '../../../components/templates/MainLayout';
import { Typography } from '../../../components/atoms/Typography';
import { Button } from '../../../components/atoms/Button';
import { Icon } from '../../../components/atoms/Icon';

export default function AssetDetailPage({ params }: { params: { id: string } }) {
  const asset = mockAssets.find((a) => a.id === params.id);
  if (!asset) return notFound();

  return (
    <MainLayout>
      <section className="p-4 max-w-3xl mx-auto">
        <div className="flex flex-col gap-4">
          <Typography variant="h4" className="mb-2">
            {asset.title}
          </Typography>
          {asset.thumbnail_url && (
            <img src={asset.thumbnail_url} alt={asset.title} className="w-full h-auto rounded" />
          )}
          <Typography variant="p" className="mb-4">
            {asset.description}
          </Typography>
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" className="flex items-center">
              <Icon name="asset" size={16} className="mr-1" />
              Abrir
            </Button>
            <Button variant="secondary" className="flex items-center">
              <Icon name="asset" size={16} className="mr-1" />
              Remix
            </Button>
            <Button variant="secondary" className="flex items-center">
              <Icon name="favorite" size={16} className="mr-1" />
              Favoritar
            </Button>
            <Button variant="link" className="flex items-center" onClick={() => history.back()}>
              <Icon name="x" size={16} className="mr-1" />
              Voltar
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
