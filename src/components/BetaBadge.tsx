import React from 'react';
import { Sparkles } from 'lucide-react';
import type { Theme } from '../types/Theme';

interface BetaBadgeProps {
  theme: Theme;
  isDark: boolean;
}

export function BetaBadge({ theme, isDark }: BetaBadgeProps) {
  return (
    <div className={`
      inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
      ${isDark 
        ? 'bg-white/10 text-white' 
        : `bg-${theme.accent}/10 ${theme.accent}`}
    `}>
      <Sparkles className="w-3 h-3" />
      <span>Beta</span>
    </div>
  );
}