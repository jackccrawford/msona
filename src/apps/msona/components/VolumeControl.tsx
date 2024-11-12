import React from 'react';
import { Volume1, Volume2, VolumeX } from 'lucide-react';
import { useAudioContext } from '../context/AudioContext';
import type { Theme } from '../../../types/Theme';

interface VolumeControlProps {
  theme: Theme;
  isDark: boolean;
}

export function VolumeControl({ theme, isDark }: VolumeControlProps) {
  const { volume, setVolume } = useAudioContext();

  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setVolume(volume === 0 ? 1 : 0)}
        className={`
          p-2 rounded-lg transition-colors duration-300
          ${isDark 
            ? 'text-gray-400 hover:text-white hover:bg-white/20' 
            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
          }
        `}
        title={volume === 0 ? 'Unmute' : 'Mute'}
      >
        <VolumeIcon className="w-5 h-5" />
      </button>
      
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={volume}
        onChange={(e) => setVolume(parseFloat(e.target.value))}
        className={`
          w-24 h-2 rounded-full appearance-none cursor-pointer
          bg-gray-200 dark:bg-gray-700
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-4
          [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-gradient-to-r
          [&::-webkit-slider-thumb]:${theme.gradient.from}
          [&::-webkit-slider-thumb]:${theme.gradient.via}
          [&::-webkit-slider-thumb]:${theme.gradient.to}
        `}
        title={`Volume: ${Math.round(volume * 100)}%`}
      />
    </div>
  );
}