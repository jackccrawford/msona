import React from 'react';
import { Moon, Sun } from 'lucide-react';
import type { Theme } from '../types/Theme';

interface DarkModeToggleProps {
  isDark: boolean;
  onToggle: () => void;
  theme: Theme;
  isCompact?: boolean;
}

export function DarkModeToggle({ isDark, onToggle, theme }: DarkModeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={`
        p-2 rounded-lg transition-colors duration-300
        ${isDark 
          ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
          : `${theme.accent} hover:bg-gray-100`
        }
      `}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
}