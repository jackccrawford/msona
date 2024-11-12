import React from 'react';
import { Volume2, Pause, AlertCircle, Loader2 } from 'lucide-react';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { logger, LogLevel } from '../services/logService';
import type { Theme } from '../types/Theme';

interface AudioButtonProps {
  text: string;
  voiceId: string;
  theme: Theme;
  isDark: boolean;
}

export function AudioButton({ text, voiceId, theme, isDark }: AudioButtonProps) {
  const { isPlaying, isLoading, error, play } = useAudioPlayer(text, voiceId);

  const handleClick = async () => {
    try {
      await play();
    } catch (error) {
      logger.log(LogLevel.ERROR, 'AudioButton', 'Playback failed', { error });
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`
        group relative p-2 rounded-xl transition-all duration-300
        ${error
          ? 'bg-red-50 text-red-600 dark:bg-red-900/50 dark:text-red-400'
          : isPlaying
          ? `${theme.accent} dark:bg-white/20 dark:text-white`
          : 'hover:bg-gray-100 dark:hover:bg-white/20 text-gray-500 dark:text-gray-400'
        }
        ${isLoading ? 'cursor-wait' : error ? 'cursor-not-allowed' : 'cursor-pointer'}
      `}
      title={error || (isPlaying ? 'Stop' : 'Listen')}
      disabled={Boolean(error) || isLoading}
      aria-label={isPlaying ? 'Stop playback' : 'Listen to quote'}
    >
      {error ? (
        <>
          <AlertCircle className="w-5 h-5" />
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-red-500 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {error}
          </span>
        </>
      ) : isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : isPlaying ? (
        <Pause className="w-5 h-5" />
      ) : (
        <Volume2 className="w-5 h-5" />
      )}
    </button>
  );
}