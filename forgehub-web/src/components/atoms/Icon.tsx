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
  CheckIcon,
  ArrowDownTrayIcon,
  ShareIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  TagIcon,
  CodeBracketIcon,
  ArrowTopRightOnSquareIcon,
  LanguageIcon,
  CurrencyDollarIcon,
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
  CubeIcon,
  ChartBarIcon,
  ClipboardDocumentIcon,
  RocketLaunchIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
} from '@heroicons/react/24/outline';
// Solid icons
import { UserIcon, StarIcon, HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

type IconProps = {
  name: string; // name of the SVG icon
  className?: string;
  size?: number; // size in pixels
  style?: React.CSSProperties;
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
  check: CheckIcon,
  download: ArrowDownTrayIcon,
  share: ShareIcon,
  docs: DocumentTextIcon,
  globe: GlobeAltIcon,
  tag: TagIcon,
  code: CodeBracketIcon,
  external: ArrowTopRightOnSquareIcon,
  language: LanguageIcon,
  money: CurrencyDollarIcon,
  eye: EyeIcon,
  'eye-off': EyeSlashIcon,
  lock: LockClosedIcon,
  sun: SunIcon,
  moon: MoonIcon,
  system: ComputerDesktopIcon,
  cube: CubeIcon,
  chart: ChartBarIcon,
  clipboard: ClipboardDocumentIcon,
  rocket: RocketLaunchIcon,
  'favorite-solid': HeartSolidIcon,
};

export const Icon: React.FC<IconProps> = ({ name, className, size = 20, style }) => {
  const IconComponent = icons[name] || icons['asset'];
  return (
    <IconComponent
      className={classNames('inline-block shrink-0', className)}
      width={size}
      height={size}
      style={style}
      aria-hidden="true"
    />
  );
};
