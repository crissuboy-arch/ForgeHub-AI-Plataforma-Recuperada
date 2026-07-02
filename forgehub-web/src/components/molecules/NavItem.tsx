// src/components/molecules/NavItem.tsx
import React from 'react';
import Link from 'next/link';
import { Icon } from '../atoms/Icon';
import classNames from 'classnames';

export interface NavItemProps {
  href: string;
  iconName: string;
  label: string;
  active?: boolean;
  /** Marca itens ainda não implementados (fora do escopo desta Sprint). */
  soon?: boolean;
}

/**
 * Item de navegação da Sidebar. Estado ativo destacado com a cor primária.
 */
export const NavItem: React.FC<NavItemProps> = ({
  href,
  iconName,
  label,
  active = false,
  soon = false,
}) => {
  const base =
    'flex items-center gap-3 rounded-interactive px-3 h-10 text-sm font-medium transition-colors duration-200';
  const state = active
    ? 'bg-primary/15 text-primary-hover'
    : 'text-muted hover:bg-surface hover:text-content';

  const content = (
    <>
      <Icon name={iconName} size={18} />
      <span className="flex-1 truncate">{label}</span>
      {soon && (
        <span className="rounded-md bg-border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted">
          em breve
        </span>
      )}
    </>
  );

  if (soon) {
    return (
      <span
        className={classNames(base, 'cursor-not-allowed text-muted/60')}
        aria-disabled="true"
      >
        {content}
      </span>
    );
  }

  return (
    <Link href={href} className={classNames(base, state)}>
      {content}
    </Link>
  );
};
