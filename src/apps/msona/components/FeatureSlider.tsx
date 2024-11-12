import React from 'react';
import type { Theme } from '../../../types/Theme';

interface FeatureSliderProps {
  label: string;
  value: number;
  color: string;
  theme: Theme;
  isDark: boolean;
}

export function FeatureSlider({ label, value, color, theme, isDark }: FeatureSliderProps) {
  const percentage = Math.round(value * 100);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {label}
        </span>
        <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
          {percentage}%
        </span>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={`h-full bg-${color}-500 transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}