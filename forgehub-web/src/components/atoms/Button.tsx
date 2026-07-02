// src/components/atoms/Button.tsx
import React from 'react';
import classNames from 'classnames';
import { Spinner } from './Spinner';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'link';
  size?: 'sm' | 'md';
  loading?: boolean;
  className?: string;
  children: React.ReactNode;
};

/**
 * Botão padrão ForgeHub (Design System Bible 4.1).
 * Altura 48px (md), raio 12px, transição de 200ms, estado de loading.
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  children,
  disabled,
  ...rest
}) => {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-interactive ' +
    'transition-colors duration-200 focus:outline-none focus-visible:ring-2 ' +
    'focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas ' +
    'disabled:opacity-50 disabled:pointer-events-none';

  const sizes: Record<string, string> = {
    md: 'h-12 px-5 text-sm',
    sm: 'h-9 px-3.5 text-sm',
  };

  const variants: Record<string, string> = {
    primary: 'bg-primary text-white hover:bg-primary-hover',
    secondary:
      'border border-border bg-transparent text-content hover:bg-surface',
    danger: 'bg-danger text-white hover:bg-danger/90',
    ghost: 'bg-transparent text-muted hover:bg-surface hover:text-content',
    link: 'bg-transparent text-primary hover:text-primary-hover hover:underline px-0 h-auto',
  };

  return (
    <button
      className={classNames(base, sizes[size], variants[variant], className)}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && <Spinner size={16} />}
      {children}
    </button>
  );
};
