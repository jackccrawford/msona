import React, { useState, useEffect } from 'react';
import { Search, Moon, Sun, Pause, ArrowRightCircle, X, Heart } from 'lucide-react';
import { ThemeSelector } from '../../../components/ThemeSelector';
import { AppSwitcher } from '../../../components/AppSwitcher';
import { useAudioContext } from '../context/AudioContext';
import { useScrollPosition } from '../../../hooks/useScrollPosition';
import { useMediaQuery } from '../../../hooks/useMediaQuery';
import type { Theme } from '../../../types/Theme';
import type { AppMode } from '../../../config/app';

interface MSonaHeaderProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  isDark: boolean;
  onDarkModeToggle: () => void;
  onSearch: (query: string) => void;
  searchQuery: string;
  showFavorites?: boolean;
  onToggleFavorites?: () => void;
  favoriteCount?: number;
  currentApp: AppMode;
  onAppChange: (app: AppMode) => void;
}

export function MSonaHeader({ 
  theme, 
  onThemeChange, 
  isDark, 
  onDarkModeToggle,
  onSearch,
  searchQuery,
  showFavorites,
  onToggleFavorites,
  favoriteCount = 0,
  currentApp,
  onAppChange
}: MSonaHeaderProps) {
  const { currentlyPlaying, stop } = useAudioContext();
  const [inputValue, setInputValue] = useState(searchQuery);
  const { isScrolled } = useScrollPosition();
  const isMobile = useMediaQuery('(max-width: 639px)');
  const isMonochrome = theme.id === 'monochrome';

  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSearch(inputValue);
    }
  };

  const handleClear = () => {
    setInputValue('');
    onSearch('');
  };

  return (
    <div className="sticky top-0 z-50 flex justify-center px-4">
      <div className={`
        w-full max-w-7xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-2xl shadow-lg
        transition-all duration-300
        ${isScrolled ? 'p-3' : 'p-6'}
      `}>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <AppSwitcher
              currentApp={currentApp}
              onAppChange={onAppChange}
              theme={theme}
              isDark={isDark}
              isScrolled={isScrolled}
            />

            <div className="flex items-center gap-3">
              {currentlyPlaying && (
                <button
                  onClick={stop}
                  className={`
                    p-2 rounded-lg transition-all duration-300
                    ${isDark
                      ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                    }
                  `}
                  title="Stop playing track"
                >
                  <Pause className="w-5 h-5" />
                </button>
              )}

              {onToggleFavorites && (
                <button
                  onClick={onToggleFavorites}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300
                    ${isDark 
                      ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                      : showFavorites
                        ? `${isMonochrome ? 'bg-gray-100 text-gray-600' : 'bg-red-50 text-red-600'} hover:bg-gray-100`
                        : `${theme.accent} hover:bg-white hover:shadow-md`
                    }
                  `}
                  title={`${showFavorites ? 'Hide' : 'Show'} favorites (${favoriteCount})`}
                >
                  <Heart 
                    className={`w-4 h-4 ${
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
              )}
            </div>
          </div>

          {(!isScrolled || !isMobile) && (
            <div className="flex items-center gap-4">
              <form 
                onSubmit={handleSubmit} 
                className="flex-1 flex items-center max-w-2xl"
              >
                <div className="relative flex-1">
                  <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                  <div className="relative flex">
                    <input
                      type="text"
                      placeholder="Search for artists, songs, or albums..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className={`
                        w-full pl-10 pr-20 py-2 rounded-lg
                        transition-colors duration-300
                        ${isDark 
                          ? 'bg-gray-800 text-white placeholder-gray-400 focus:bg-gray-700' 
                          : 'bg-gray-100 text-gray-900 placeholder-gray-500 focus:bg-white'
                        }
                        border border-transparent focus:outline-none focus:ring-2
                        ${isDark ? 'focus:ring-white/20' : `focus:ring-${theme.accent}/20`}
                      `}
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      {inputValue && (
                        <>
                          <button
                            type="button"
                            onClick={handleClear}
                            className={`
                              group p-2 rounded-full
                              transition-all duration-300
                              ${isDark 
                                ? 'hover:bg-gray-700' 
                                : 'hover:bg-gray-200'
                              }
                            `}
                            title="Clear search"
                          >
                            <X className={`
                              w-4 h-4
                              transition-colors duration-300
                              ${isDark 
                                ? 'text-gray-400 group-hover:text-white' 
                                : 'text-gray-400 group-hover:text-gray-600'
                              }
                            `} />
                          </button>
                          <button
                            type="submit"
                            className={`
                              group p-2 rounded-full
                              transition-all duration-300
                              ${isDark 
                                ? 'hover:bg-gray-700' 
                                : 'hover:bg-gray-200'
                              }
                            `}
                            title="Search music"
                          >
                            <ArrowRightCircle className={`
                              w-4 h-4
                              transition-colors duration-300
                              ${isDark 
                                ? 'text-gray-400 group-hover:text-white' 
                                : 'text-gray-400 group-hover:text-gray-600'
                              }
                            `} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </form>

              <div className="flex items-center gap-2">
                <ThemeSelector
                  currentTheme={theme}
                  onThemeChange={onThemeChange}
                  isDark={isDark}
                  isCompact={isScrolled}
                />
                
                <button
                  onClick={onDarkModeToggle}
                  className={`
                    p-2 rounded-lg transition-colors duration-300
                    ${isDark 
                      ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                      : `${theme.accent} hover:bg-gray-100`
                    }
                  `}
                  title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {isDark ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}