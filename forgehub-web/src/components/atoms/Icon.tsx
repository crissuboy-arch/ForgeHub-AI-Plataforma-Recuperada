// src/components/atoms/Icon.tsx
import React from 'react';
import classNames from 'classnames';

// Outline icons
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  SquaresPlusIcon,
  HeartIcon,
  ClockIcon,
  PhotoIcon,
  ArrowRightOnRectangleIcon,
  MagnifyingGlassIcon,
  Cog6ToothIcon,
  SparklesIcon,
  ArrowsRightLeftIcon,
  PlusIcon,
  ChevronRightIcon,
  ChevronUpDownIcon,
  ArrowLeftIcon,
  BoltIcon,
  RectangleStackIcon,
  CommandLineIcon,
} from '@heroicons/react/24/outline';
// Solid icons
import { UserIcon, StarIcon } from '@heroicons/react/24/solid';

type IconProps = {
  name: string; // name of the SVG icon
  className?: string;
  size?: number; // size in pixels
};

const icons: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  menu: Bars3Icon,
  x: XMarkIcon,
  close: XMarkIcon,
  user: UserIcon,
  logout: ArrowRightOnRectangleIcon,
  home: HomeIcon,
  collection: SquaresPlusIcon,
  favorite: HeartIcon,
  star: StarIcon,
  recent: ClockIcon,
  asset: PhotoIcon,
  search: MagnifyingGlassIcon,
  settings: Cog6ToothIcon,
  sparkles: SparklesIcon,
  remix: ArrowsRightLeftIcon,
  plus: PlusIcon,
  chevron: ChevronRightIcon,
  'chevron-updown': ChevronUpDownIcon,
  back: ArrowLeftIcon,
  bolt: BoltIcon,
  stack: RectangleStackIcon,
  command: CommandLineIcon,
};

export const Icon: React.FC<IconProps> = ({ name, className, size = 20 }) => {
  const IconComponent = icons[name] || icons['asset'];
  return (
    <IconComponent
      className={classNames('inline-block shrink-0', className)}
      width={size}
      height={size}
      aria-hidden="true"
    />
  );
};
