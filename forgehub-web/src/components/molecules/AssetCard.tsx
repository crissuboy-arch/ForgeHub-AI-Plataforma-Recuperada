// src/components/molecules/AssetCard.tsx
import React from 'react';
import Link from 'next/link';
import { Typography } from '../atoms/Typography';
import { Icon } from '../atoms/Icon';
import classNames from 'classnames';
import { Asset } from '../../types';

export interface AssetCardProps {
  asset: Asset;
  /** optional class for the card container */
  className?: string;
}

/**
 * A simple card that displays an asset thumbnail (or placeholder icon),
 * title and a short description. Clicking the card navigates to the asset
 * detail page (`/assets/[id]`).
 */
export const AssetCard: React.FC<AssetCardProps> = ({ asset, className }) => {
  const placeholder = (
    <Icon name="asset" className="text-gray-400" size={48} />
  );
  const thumbnail = asset.thumbnail_url ? (
    <img
      src={asset.thumbnail_url}
      alt={asset.title}
      className="w-full h-40 object-cover rounded-t-md"
    />
  ) : (
    placeholder
  );

  return (
    <Link href={`/assets/${asset.id}`} legacyBehavior>
      <a
        className={classNames(
          'bg-white rounded-md shadow-sm hover:shadow-md transition-shadow overflow-hidden',
          'flex flex-col h-full',
          className,
        )}
      >
        {thumbnail}
        <div className="p-3 flex-1 flex flex-col">
          <Typography variant="h5" className="mb-1 truncate" title={asset.title}>
            {asset.title}
          </Typography>
          {asset.description && (
            <Typography variant="small" className="text-gray-600 line-clamp-2" title={asset.description}>
              {asset.description}
            </Typography>
          )}
        </div>
      </a>
    </Link>
  );
};
