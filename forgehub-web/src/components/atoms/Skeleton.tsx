// src/components/atoms/Skeleton.tsx
import React from 'react';
import classNames from 'classnames';

type SkeletonProps = {
  className?: string;
};

/** Placeholder de carregamento animado (Bible 2.3 — Zero Tela Branca). */
export const Skeleton: React.FC<SkeletonProps> = ({ className }) => (
  <div
    className={classNames('animate-pulse rounded-interactive bg-border/60', className)}
    aria-hidden="true"
  />
);
