'use client';
// src/app/admin/assets/edit/[slug]/page.tsx
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { AssetForm } from '../../../../../components/organisms/AssetForm';
import { getAssetForEdit } from '../../../../../data/adminAssets';
import { Skeleton } from '../../../../../components/atoms/Skeleton';
import { Typography } from '../../../../../components/atoms/Typography';
import { Icon } from '../../../../../components/atoms/Icon';

export default function EditAssetPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? '';
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-edit', slug],
    queryFn: () => getAssetForEdit(slug),
    enabled: Boolean(slug),
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-8">
        <Skeleton className="mb-6 h-16 w-full" />
        <Skeleton className="mb-4 h-64 w-full rounded-container" />
        <Skeleton className="h-64 w-full rounded-container" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <Typography variant="h3" className="mb-2">Asset não encontrado</Typography>
        <Typography variant="p" className="mb-8">
          Verifique se você está autenticado (a edição exige login) e se o slug existe.
        </Typography>
        <Link href="/admin/assets" className="inline-flex h-11 items-center gap-2 rounded-interactive bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover">
          <Icon name="back" size={16} /> Voltar ao Studio
        </Link>
      </div>
    );
  }

  return <AssetForm mode="edit" assetId={data.id} initialValues={data.values} />;
}
