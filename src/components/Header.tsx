import React from 'react';
import { Orbit, Heart, Book } from 'lucide-react';
import { ThemeSelector } from './ThemeSelector';
import { VoiceSelector } from './VoiceSelector';
import { DarkModeToggle } from './DarkModeToggle';
import { InspirationGuide } from './InspirationGuide';
import { AppSwitcher } from './AppSwitcher';
import { useScrollPosition } from '../hooks/useScrollPosition';
import { useMediaQuery } from '../hooks/useMediaQuery';
import type { Theme } from '../types/Theme';
import type { Quote } from '../types/Quote';
import type { AppMode } from '../config/app';

interface HeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
  quoteCount: number;
  favoriteCount: number;
  showFavorites: boolean;
  onToggleFavorites: () => void;
  selectedVoice: string;
  onVoiceChange: (voiceId: string) => void;
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
  isDark: boolean;
  onDarkModeToggle: () => void;
  favoriteQuotes: Quote[];
  currentApp: AppMode;
  onAppChange: (app: AppMode) => void;
}

export function Header({ 
  onRefresh, 
  isLoading, 
  quoteCount, 
  favoriteCount,
  showFavorites,
  onToggleFavorites,
  selectedVoice,
  onVoiceChange,
  currentTheme,
  onThemeChange,
  isDark,
  onDarkModeToggle,
  favoriteQuotes,
  currentApp,
  onAppChange
}: HeaderProps) {
  const { isScrolled } = useScrollPosition();
  const isMobile = useMediaQuery('(max-width: 639px)');
  const isMonochrome = currentTheme.id === 'monochrome';

  return (
    <div className="sticky top-0 z-50 flex justify-center px-4">
      <div className={`
        w-full max-w-4xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-2xl shadow-lg
        transition-all duration-300
        ${isScrolled ? 'p-3' : 'p-6'}
      `}>
        <div className="flex items-center justify-between">
          <AppSwitcher
            currentApp={currentApp}
            onAppChange={onAppChange}
            theme={currentTheme}
            isDark={isDark}
            isScrolled={isScrolled}
          />

          <div className="flex items-center gap-3">
            {favoriteQuotes.length > 0 && (
              <InspirationGuide 
                quotes={favoriteQuotes}
                theme={currentTheme}
                isDark={isDark}
              />
            )}

            <div className="flex flex-col gap-2">
              <button
                onClick={onToggleFavorites}
                className={`
                  inline-flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300
                  ${isDark 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                    : showFavorites
                      ? `${isMonochrome ? 'bg-gray-100 text-gray-600' : 'bg-red-50 text-red-600'} hover:bg-gray-100`
                      : `${currentTheme.accent} hover:bg-white hover:shadow-md`
                  }
                `}
                title={`${showFavorites ? 'Hide' : 'Show'} favorites (${favoriteCount})`}
              >
                <Heart 
                  className={`w-4 h-4 flex-shrink-0 ${
                    showFavorites 
                      ? isDark
                        ? isMonochrome
                          ? 'fill-white text-white'
                          : 'fill-red-400 text-red-400'
                        : isMonochrome
                          ? 'fill-gray-600 text-gray-600'
                          : 'fill-red-500 text-red-500'
                      : ''
                  }`} 
                />
                <span className="font-medium">
                  {favoriteCount}
                </span>
              </button>

              <button
                onClick={onRefresh}
                disabled={isLoading || showFavorites}
                className={`
                  p-3 rounded-xl transition-all duration-300
                  ${isDark 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                    : `${currentTheme.accent} hover:bg-white hover:shadow-md`
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                  group
                `}
                title="Discover new wisdom"
              >
                <Orbit 
                  className={`
                    w-6 h-6 transition-transform duration-500
                    ${isLoading ? 'animate-spin' : !showFavorites && 'group-hover:rotate-180'}
                  `} 
                />
              </button>
            </div>
          </div>
        </div>

        {(!isScrolled || !isMobile) && (
          <div className="flex items-center gap-2 mt-4">
            <VoiceSelector
              selectedVoice={selectedVoice}
              onVoiceChange={onVoiceChange}
              isDark={isDark}
              theme={currentTheme}
              isCompact={isScrolled}
            />

            <ThemeSelector
              currentTheme={currentTheme}
              onThemeChange={onThemeChange}
              isDark={isDark}
              isCompact={isScrolled}
            />

            <DarkModeToggle
              isDark={isDark}
              onToggle={onDarkModeToggle}
              theme={currentTheme}
              isCompact={isScrolled}
            />
          </div>
        )}
      </div>
    </div>
  );
}