// src/app/assets/page.tsx
import React from 'react';
import { MainLayout } from '../../components/templates/MainLayout';
import { AssetCard } from '../../components/molecules/AssetCard';
import { mockAssets } from '../../data/mockAssets';
import { Typography } from '../../components/atoms/Typography';

export default function AssetsPage() {
  return (
    <MainLayout>
      <section className="p-4">
        <Typography variant="h4" className="mb-4">Assets</Typography>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {mockAssets.map((asset) => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>
      </section>
    </MainLayout>
  );
}
