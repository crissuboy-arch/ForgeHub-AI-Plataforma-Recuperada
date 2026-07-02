// src/components/molecules/AssetCard.tsx
import React from 'react';
import Link from 'next/link';
import { Typography } from '../atoms/Typography';
import { Icon } from '../atoms/Icon';
import { Badge } from '../atoms/Badge';
import classNames from 'classnames';
import { AssetSummary, AssetStatus } from '../../types';

export interface AssetCardProps {
  asset: AssetSummary;
  className?: string;
}

const statusTone: Record<AssetStatus, 'success' | 'primary' | 'warning' | 'default'> = {
  active: 'success',
  updated: 'primary',
  draft: 'warning',
  archived: 'default',
};

const statusLabel: Record<AssetStatus, string> = {
  active: 'Ativo',
  updated: 'Atualizado',
  draft: 'Rascunho',
  archived: 'Arquivado',
};

const MESES_PT = [
  'jan', 'fev', 'mar', 'abr', 'mai', 'jun',
  'jul', 'ago', 'set', 'out', 'nov', 'dez',
];

function relativeDate(iso: string): string {
  // Determinístico: formata direto da string YYYY-MM-DD, sem depender de
  // timezone/locale do runtime (evita divergência de hydration servidor↔cliente).
  const [, month, day] = iso.split('-');
  const mesIdx = Number(month) - 1;
  const mes = MESES_PT[mesIdx] ?? '';
  return `${day} de ${mes}`;
}

/**
 * Card de Asset — Padrão Unificado (Design System Bible 4.2).
 * Topo: thumbnail + favoritar/remix. Corpo: título + badge de categoria +
 * descrição (2 linhas). Rodapé: versão SemVer + status + CTA "Abrir".
 */
export const AssetCard: React.FC<AssetCardProps> = ({ asset, className }) => {
  return (
    <div
      className={classNames(
        'group flex h-full flex-col overflow-hidden rounded-container border border-border',
        'bg-card shadow-soft transition-all duration-200 hover:border-primary/50 hover:shadow-modal',
        className,
      )}
    >
      {/* Topo: capa + ações rápidas */}
      <div className="relative h-32 bg-brand-glow/90">
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon name="asset" size={40} className="text-white/70" />
        </div>
        <div className="absolute right-3 top-3 flex gap-1.5">
          <button
            type="button"
            aria-label="Favoritar"
            className="flex h-8 w-8 items-center justify-center rounded-interactive bg-canvas/40 text-white backdrop-blur transition-colors hover:bg-canvas/70"
          >
            <Icon name="favorite" size={16} />
          </button>
          <button
            type="button"
            aria-label="Remixar"
            className="flex h-8 w-8 items-center justify-center rounded-interactive bg-canvas/40 text-white backdrop-blur transition-colors hover:bg-canvas/70"
          >
            <Icon name="remix" size={16} />
          </button>
        </div>
      </div>

      {/* Corpo */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center gap-2">
          <Badge tone="primary">{asset.category}</Badge>
        </div>
        <Typography variant="h5" className="mb-1 truncate" title={asset.name}>
          {asset.name}
        </Typography>
        {asset.shortDescription && (
          <Typography variant="small" className="line-clamp-2">
            {asset.shortDescription}
          </Typography>
        )}

        {/* Rodapé */}
        <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
          <div className="flex items-center gap-2">
            <Badge tone={statusTone[asset.status]}>{statusLabel[asset.status]}</Badge>
            <Typography variant="caption">{asset.version}</Typography>
          </div>
          <Link
            href={`/assets/${asset.id}`}
            className="inline-flex items-center gap-1 rounded-interactive px-2.5 py-1 text-sm font-semibold text-primary transition-colors hover:bg-primary/10 hover:text-primary-hover"
          >
            Abrir
            <Icon name="chevron" size={14} />
          </Link>
        </div>
        <Typography variant="caption" className="mt-2">
          Atualizado em {relativeDate(asset.updatedAt)}
        </Typography>
      </div>
    </div>
  );
};
