// src/components/molecules/PageHeader.tsx
import React from 'react';
import { Typography } from '../atoms/Typography';

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
};

/** Cabeçalho de tela padrão (título + subtítulo + ação opcional). */
export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, action }) => (
  <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
    <div>
      <Typography variant="h3" className="mb-1">
        {title}
      </Typography>
      {subtitle && <Typography variant="small">{subtitle}</Typography>}
    </div>
    {action}
  </div>
);
