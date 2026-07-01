// src/components/atoms/Icon.tsx
import React from 'react';
import classNames from 'classnames';

// Outline icons
import {
  MenuIcon,
  XMarkIcon,
  HomeIcon,
  SquaresPlusIcon,
  HeartIcon,
  ClockIcon,
  PhotoIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
// Solid icons
import { UserIcon } from '@heroicons/react/24/solid';

type IconProps = {
  name: string; // name of the SVG icon
  className?: string;
  size?: number; // size in pixels
};

export const Icon: React.FC<IconProps> = ({ name, className, size = 20 }) => {
  const icons: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
    menu: MenuIcon,
    x: XMarkIcon,
    user: UserIcon,
    logout: ArrowRightOnRectangleIcon,
    home: HomeIcon,
    collection: SquaresPlusIcon,
    favorite: HeartIcon,
    recent: ClockIcon,
    asset: PhotoIcon,
  };
  const IconComponent = icons[name] || icons['home'];
  return <IconComponent className={classNames('inline-block', className)} width={size} height={size} />;
};
