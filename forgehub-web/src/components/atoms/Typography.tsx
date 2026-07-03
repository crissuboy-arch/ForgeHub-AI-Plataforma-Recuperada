// src/components/atoms/Typography.tsx
import React from 'react';
import classNames from 'classnames';

type Variant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'p'
  | 'small'
  | 'caption';

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  /** HTML tag/visual style to render. Defaults to "p". */
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}

/**
 * Componente tipográfico ForgeHub (Bible 3.3).
 * Escala com fonte Inter e cores do Dark Slate (content / muted).
 * Pesos: Bold(700) display, SemiBold(600) títulos, Medium(500) rótulos.
 */
export const Typography: React.FC<TypographyProps> = ({
  variant = 'p',
  className,
  children,
  ...rest
}) => {
  const baseClasses = {
    h1: 'font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-content',
    h2: 'font-display text-3xl font-bold tracking-tight text-content',
    h3: 'font-display text-2xl font-bold tracking-tight text-content',
    h4: 'font-display text-xl font-bold tracking-tight text-content',
    h5: 'text-base font-semibold text-content',
    h6: 'text-sm font-medium text-content',
    p: 'text-base text-muted leading-relaxed',
    small: 'text-sm text-muted',
    caption: 'text-xs text-muted',
  } as const;

  const Component: React.ElementType = variant.startsWith('h')
    ? variant
    : variant === 'p'
      ? 'p'
      : 'span';
  const classes = classNames(baseClasses[variant], className);

  return (
    <Component className={classes} {...rest}>
      {children}
    </Component>
  );
};
