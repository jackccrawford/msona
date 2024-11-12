import { Palette, CircleDashed, Moon } from 'lucide-react';

export interface Theme {
  id: string;
  name: string;
  background: string;
  accent: string;
  hover: string;
  text: string;
  gradient: {
    from: string;
    via: string;
    to: string;
  };
}

export const themes: Theme[] = [
  {
    id: 'ocean',
    name: 'Ocean Depths',
    background: 'from-blue-50 via-cyan-50 to-sky-50 dark:from-blue-950 dark:via-cyan-950 dark:to-sky-950',
    accent: 'text-blue-600',
    hover: 'hover:text-blue-800',
    text: 'text-blue-900',
    gradient: {
      from: 'from-blue-500',
      via: 'via-blue-400',
      to: 'to-cyan-400'
    }
  },
  {
    id: 'midnight',
    name: 'Midnight Galaxy',
    background: 'from-indigo-50 via-purple-50 to-blue-50 dark:from-indigo-950 dark:via-purple-950 dark:to-blue-950',
    accent: 'text-indigo-600',
    hover: 'hover:text-indigo-800',
    text: 'text-indigo-900',
    gradient: {
      from: 'from-indigo-500',
      via: 'via-purple-400',
      to: 'to-blue-400'
    }
  },
  {
    id: 'sunset',
    name: 'Sunset Glow',
    background: 'from-amber-50 via-orange-50 to-rose-50 dark:from-amber-950 dark:via-orange-950 dark:to-rose-950',
    accent: 'text-orange-600',
    hover: 'hover:text-orange-800',
    text: 'text-orange-900',
    gradient: {
      from: 'from-amber-500',
      via: 'via-orange-400',
      to: 'to-rose-400'
    }
  },
  {
    id: 'forest',
    name: 'Forest Depths',
    background: 'from-green-50 via-emerald-50 to-teal-50 dark:from-green-950 dark:via-emerald-950 dark:to-teal-950',
    accent: 'text-emerald-600',
    hover: 'hover:text-emerald-800',
    text: 'text-emerald-900',
    gradient: {
      from: 'from-green-500',
      via: 'via-emerald-400',
      to: 'to-teal-400'
    }
  },
  {
    id: 'lavender',
    name: 'Lavender Dreams',
    background: 'from-purple-50 via-fuchsia-50 to-pink-50 dark:from-purple-950 dark:via-fuchsia-950 dark:to-pink-950',
    accent: 'text-purple-600',
    hover: 'hover:text-purple-800',
    text: 'text-purple-900',
    gradient: {
      from: 'from-purple-500',
      via: 'via-fuchsia-400',
      to: 'to-pink-400'
    }
  },
  {
    id: 'monochrome',
    name: 'Monochrome',
    background: 'from-gray-50 via-gray-50 to-gray-50 dark:from-gray-950 dark:via-gray-950 dark:to-gray-950',
    accent: 'text-gray-600',
    hover: 'hover:text-gray-800',
    text: 'text-gray-900',
    gradient: {
      from: 'from-gray-500',
      via: 'via-gray-400',
      to: 'to-gray-300'
    }
  }
];