import { BoltIcon, HomeIcon, UserIcon } from '@heroicons/react/24/outline';
import { NavigationItem, QuickAction } from '../types/dashboard';

export const navigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/', icon: HomeIcon, current: false },
  { name: 'Energy', href: '/energy', icon: BoltIcon, current: false },
  { name: 'Account', href: '#', icon: UserIcon, current: false },
];

export const quickActions: QuickAction[] = [
  { id: 1, name: 'Contact Support', href: '#', initial: 'S', current: false },
];
