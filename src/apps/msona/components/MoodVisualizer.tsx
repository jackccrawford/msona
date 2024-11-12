import React from 'react';
import type { Theme } from '../../../types/Theme';

interface MoodVisualizerProps {
  valence: number;
  energy: number;
  theme: Theme;
  isDark: boolean;
}

export function MoodVisualizer({ valence, energy, theme, isDark }: MoodVisualizerProps) {
  // Map valence (x) and energy (y) to coordinates in a 100x100 space
  const x = valence * 100;
  const y = (1 - energy) * 100; // Invert Y axis for visual representation

  // Get color based on position
  const getColor = () => {
    if (energy > 0.7) {
      return valence > 0.5 ? 'bg-yellow-500' : 'bg-red-500';
    } else if (energy > 0.3) {
      return valence > 0.5 ? 'bg-green-500' : 'bg-orange-500';
    } else {
      return valence > 0.5 ? 'bg-blue-500' : 'bg-purple-500';
    }
  };

  return (
    <div 
      className={`
        relative w-24 h-24 rounded-lg
        ${isDark ? 'bg-gray-800' : 'bg-gray-100'}
      `}
      role="img"
      aria-label={`Mood visualization: ${Math.round(valence * 100)}% positive, ${Math.round(energy * 100)}% energetic`}
    >
      {/* Grid lines */}
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-px">
        <div className={`${isDark ? 'border-gray-700' : 'border-gray-200'} border-r border-b`} />
        <div className={`${isDark ? 'border-gray-700' : 'border-gray-200'} border-b`} />
        <div className={`${isDark ? 'border-gray-700' : 'border-gray-200'} border-r`} />
        <div />
      </div>

      {/* Mood indicator */}
      <div
        className={`
          absolute w-4 h-4 rounded-full transform -translate-x-1/2 -translate-y-1/2
          ${getColor()}
          shadow-lg
          transition-all duration-300
        `}
        style={{
          left: `${x}%`,
          top: `${y}%`
        }}
      />

      {/* Labels */}
      <div className="absolute -left-6 top-1/2 -translate-y-1/2 text-xs">
        <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Calm</span>
      </div>
      <div className="absolute -right-8 top-1/2 -translate-y-1/2 text-xs">
        <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Energy</span>
      </div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-6 text-xs">
        <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Mood</span>
      </div>
    </div>
  );
}