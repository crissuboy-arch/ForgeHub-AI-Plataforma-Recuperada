// src/components/molecules/NavItem.tsx
import React from 'react';
import Link from 'next/link';
import { Icon } from '../atoms/Icon';
import { Typography } from '../atoms/Typography';
import classNames from 'classnames';

export interface NavItemProps {
  href: string;
  iconName: string; // matches icon keys defined in Icon atom
  label: string;
  /** If true, the link is styled as active */
  active?: boolean;
}

/**
 * Simple navigation item used in Sidebar or Topbar.
 * Renders an icon and a label with hover/focus styles.
 */
export const NavItem: React.FC<NavItemProps> = ({ href, iconName, label, active = false }) => {
  const baseClasses =
    'flex items-center p-2 rounded-md transition-colors duration-200';
  const activeClasses = active
    ? 'bg-indigo-100 text-indigo-600'
    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900';

  return (
    <Link href={href} legacyBehavior>
      <a className={classNames(baseClasses, activeClasses)}>
        <Icon name={iconName} className="mr-2" size={20} />
        <Typography variant="small" className="font-medium">
          {label}
        </Typography>
      </a>
    </Link>
  );
};
