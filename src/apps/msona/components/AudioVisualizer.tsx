import React from 'react';
import type { Theme } from '../../../types/Theme';

interface AudioVisualizerProps {
  theme: Theme;
  isDark: boolean;
}

export function AudioVisualizer({ theme, isDark }: AudioVisualizerProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-1 p-2">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={`
            w-1 rounded-full
            animate-wave
            ${isDark ? 'bg-white' : theme.accent}
          `}
          style={{
            height: `${8 + Math.random() * 8}px`,
            animationDelay: `${i * 0.15}s`
          }}
        />
      ))}
    </div>
  );
}