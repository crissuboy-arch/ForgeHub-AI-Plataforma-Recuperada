// src/components/molecules/EmptyState.tsx
import React from 'react';
import { Icon } from '../atoms/Icon';
import { Typography } from '../atoms/Typography';

type EmptyStateProps = {
  iconName?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
};

/**
 * Estado vazio (Bible 2.3 — "Zero Tela Branca").
 * Nunca deixamos uma lista/painel em branco: sempre há orientação + ação.
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  iconName = 'asset',
  title,
  description,
  action,
}) => (
  <div className="flex flex-col items-center justify-center rounded-container border border-dashed border-border bg-surface/40 px-6 py-16 text-center">
    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-container bg-card">
      <Icon name={iconName} size={28} className="text-muted" />
    </div>
    <Typography variant="h5" className="mb-1">
      {title}
    </Typography>
    {description && (
      <Typography variant="small" className="max-w-sm">
        {description}
      </Typography>
    )}
    {action && <div className="mt-6">{action}</div>}
  </div>
);
