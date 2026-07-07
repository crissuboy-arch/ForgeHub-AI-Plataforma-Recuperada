// src/components/atoms/Badge.tsx
import React from 'react';
import classNames from 'classnames';

type BadgeTone = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'gold';

type BadgeProps = {
  tone?: BadgeTone;
  className?: string;
  children: React.ReactNode;
};

/** Badge de categoria/status (Bible 4.2). Raio 12px, cores do Dark Slate. */
export const Badge: React.FC<BadgeProps> = ({ tone = 'default', className, children }) => {
  const tones: Record<BadgeTone, string> = {
    default: 'bg-surface text-muted border border-border',
    primary: 'bg-primary/15 text-primary-hover border border-primary/30',
    success: 'bg-success/15 text-success border border-success/30',
    warning: 'bg-warning/15 text-warning border border-warning/30',
    danger: 'bg-danger/15 text-danger border border-danger/30',
    gold: 'bg-gold/15 text-gold-light border border-gold/30',
  };
  return (
    <span
      className={classNames(
        'inline-flex items-center gap-1 rounded-interactive px-2.5 py-0.5 text-xs font-medium',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
};
