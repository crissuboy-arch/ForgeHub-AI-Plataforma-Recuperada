'use client';
// src/components/molecules/AssetCard.tsx
import React from 'react';
import Link from 'next/link';
import { Typography } from '../atoms/Typography';
import { Icon } from '../atoms/Icon';
import { CategoryBadge, categoryColor, categoryIcon } from '../atoms/CategoryBadge';
import { TierBadge } from '../atoms/TierBadge';
import classNames from 'classnames';
import { useLanguage } from '../../lib/i18n/LanguageProvider';
import { AssetSummary, AssetStatus } from '../../types';

export interface AssetCardProps {
  asset: AssetSummary;
  className?: string;
}

const statusStyle: Record<AssetStatus, string> = {
  active: 'bg-success/12 text-success',
  updated: 'bg-primary/15 text-primary-hover',
  draft: 'bg-warning/12 text-warning',
  archived: 'bg-surface-2 text-muted',
};
const MESES_PT = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
export function relativeDate(iso: string): string {
  const [, month, day] = iso.slice(0, 10).split('-');
  return `${day} de ${MESES_PT[Number(month) - 1] ?? ''}`;
}

export function healthColor(score: number): string {
  if (score >= 80) return 'text-success';
  if (score >= 40) return 'text-warning';
  return 'text-danger';
}

const hexA = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

/**
 * Card de Asset premium (ForgeHub Design System).
 * Capa com gradiente por categoria + tier + completude; hover com glow azul.
 */
export const AssetCard: React.FC<AssetCardProps> = ({ asset, className }) => {
  const { t } = useLanguage();
  const color = categoryColor(asset.category);
  return (
    <Link
      href={`/assets/${asset.slug}`}
      className={classNames(
        'group card-premium lift glow-blue-hover ring-hairline flex h-full flex-col overflow-hidden rounded-container',
        'hover:border-primary/50',
        className,
      )}
    >
      {/* Capa por categoria */}
      <div
        className="relative flex h-28 items-center justify-center overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${hexA(color, 0.28)} 0%, ${hexA(color, 0.06)} 100%)` }}
      >
        {asset.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={asset.coverUrl} alt={asset.name} loading="lazy" decoding="async" className="h-full w-full object-cover" />
        ) : (
          <Icon name={categoryIcon(asset.category)} size={34} className="transition-transform duration-300 group-hover:scale-110" style={{ color }} />
        )}
        <div className="absolute left-3 top-3">
          <TierBadge level={asset.level} />
        </div>
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-md bg-deep/50 px-2 py-0.5 backdrop-blur">
          <Icon name="check" size={12} className={healthColor(asset.healthScore)} />
          <span className={classNames('text-[11px] font-bold', healthColor(asset.healthScore))}>{asset.healthScore}%</span>
        </div>
        {/* Selo de conclusão (item 6) */}
        {asset.healthScore >= 100 && (
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1.5 bg-gradient-to-t from-deep/85 to-transparent px-2 pb-1 pt-4">
            <span className="text-[10px] leading-none tracking-[0.2em] text-gold">★★★★★</span>
            <span className="text-[10px] font-bold uppercase tracking-wide text-gold-light">{t('card.complete')}</span>
          </div>
        )}
      </div>

      {/* Corpo */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center gap-1.5">
          <CategoryBadge category={asset.category} />
          {asset.language && (
            <span className="inline-flex items-center rounded-full border border-border bg-surface/60 px-2 py-0.5 text-[10px] font-semibold uppercase text-muted">
              {asset.language === 'pt-BR' ? 'PT' : asset.language.toUpperCase()}
            </span>
          )}
          {typeof asset.filesCount === 'number' && asset.filesCount > 0 && (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-dim">
              <Icon name="docs" size={10} /> {asset.filesCount}
            </span>
          )}
        </div>
        <Typography variant="h5" className="mb-1 truncate transition-colors group-hover:text-primary-hover" title={asset.name}>
          {asset.name}
        </Typography>
        {asset.shortDescription && (
          <Typography variant="small" className="line-clamp-2">{asset.shortDescription}</Typography>
        )}

        {/* Rodapé */}
        <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
          <div className="flex items-center gap-2">
            <span className={classNames('rounded-full px-2 py-0.5 text-[11px] font-medium', statusStyle[asset.status])}>
              {t(`status.${asset.status}`)}
            </span>
            {asset.version && <span className="text-xs text-dim">{asset.version}</span>}
          </div>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-transform group-hover:translate-x-0.5">
            {t('common.open')} <Icon name="chevron" size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
};
