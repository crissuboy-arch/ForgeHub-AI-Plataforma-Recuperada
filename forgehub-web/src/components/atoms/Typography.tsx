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
  /**
   * HTML tag/visual style to render. Defaults to "p".
   */
  variant?: Variant;
  /** Additional Tailwind classes */
  className?: string;
  /** Children content */
  children: React.ReactNode;
}

/**
 * Simple typographic component that maps a variant to a HTML element with sensible defaults.
 * Uses Tailwind CSS utilities for font family (Inter) and color (gray-900 / gray-600).
 */
export const Typography: React.FC<TypographyProps> = ({
  variant = 'p',
  className,
  children,
  ...rest
}) => {
  const baseClasses = {
    h1: 'text-4xl font-bold tracking-tight text-gray-900',
    h2: 'text-3xl font-semibold tracking-tight text-gray-900',
    h3: 'text-2xl font-semibold text-gray-900',
    h4: 'text-xl font-medium text-gray-900',
    h5: 'text-lg font-medium text-gray-800',
    h6: 'text-base font-medium text-gray-800',
    p: 'text-base text-gray-700',
    small: 'text-sm text-gray-600',
    caption: 'text-xs text-gray-500',
  } as const;

  const Component = variant as keyof JSX.IntrinsicElements;
  const classes = classNames(baseClasses[variant], className);

  return (
    <Component className={classes} {...rest}>
      {children}
    </Component>
  );
};
