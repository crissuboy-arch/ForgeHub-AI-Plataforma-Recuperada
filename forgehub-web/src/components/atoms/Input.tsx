// src/components/atoms/Input.tsx
import React from 'react';
import classNames from 'classnames';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
  invalid?: boolean;
};

/**
 * Campo de texto filled (Design System Bible 4.3).
 * Altura 48px, raio 12px, fundo surface, foco azul, placeholder muted.
 */
export const Input: React.FC<InputProps> = ({ className, invalid, ...rest }) => {
  const base =
    'w-full h-12 px-4 rounded-interactive bg-surface text-content ' +
    'placeholder:text-muted border transition-colors duration-200 ' +
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ' +
    'focus-visible:border-primary';
  const border = invalid ? 'border-danger' : 'border-border';
  return <input className={classNames(base, border, className)} {...rest} />;
};
