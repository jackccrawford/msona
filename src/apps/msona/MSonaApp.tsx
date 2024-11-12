import React, { useState } from 'react';
import { useDarkMode } from '../../hooks/useDarkMode';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { themes } from '../../types/Theme';
import { MSonaHeader } from './components/MSonaHeader';
import { MusicFeed } from './components/MusicFeed';
import { Footer } from '../../components/Footer';
import { FeedbackButton } from '../../components/FeedbackButton';
import { BetaBadge } from '../../components/BetaBadge';
import { LogViewer } from '../../components/LogViewer';
import { AudioProvider } from './context/AudioContext';
import { logger, LogLevel } from '../../services/logService';
import type { AppMode } from '../../config/app';
import type { SpotifyTrack } from '../../types/spotify';

interface MSonaAppProps {
  onAppChange: (app: AppMode) => void;
}

export function MSonaApp({ onAppChange }: MSonaAppProps) {
  const [isDark, setIsDark] = useDarkMode();
  const [currentTheme, setCurrentTheme] = useState(themes[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [favoriteTracks, setFavoriteTracks] = useLocalStorage<SpotifyTrack[]>('musicFavorites', []);

  // Filter out invalid favorites
  const validFavorites = favoriteTracks.filter(track => 
    track && track.id && track.name && track.artists && track.album
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setShowFavorites(false);
  };

  const toggleFavorite = (track: SpotifyTrack) => {
    try {
      // Ensure we have all required track data
      if (!track.id || !track.name || !track.artists || !track.album) {
        logger.log(LogLevel.ERROR, 'MSonaApp', 'Invalid track data for favorite', { track });
        return;
      }

      setFavoriteTracks(prev => {
        const isFavorite = prev.some(t => t.id === track.id);
        if (isFavorite) {
          logger.log(LogLevel.INFO, 'MSonaApp', 'Removing track from favorites', { trackId: track.id });
          return prev.filter(t => t.id !== track.id);
        } else {
          logger.log(LogLevel.INFO, 'MSonaApp', 'Adding track to favorites', { trackId: track.id });
          // Add new favorite to the beginning of the array
          return [{
            id: track.id,
            name: track.name,
            artists: track.artists,
            album: track.album,
            duration_ms: track.duration_ms,
            preview_url: track.preview_url,
            external_urls: track.external_urls,
            popularity: track.popularity
          }, ...prev];
        }
      });
    } catch (error) {
      logger.log(LogLevel.ERROR, 'MSonaApp', 'Failed to toggle favorite', { 
        error, 
        trackId: track.id 
      });
    }
  };

  return (
    <AudioProvider>
      <div className={`min-h-screen bg-gradient-to-br ${currentTheme.background}`}>
        <MSonaHeader 
          theme={currentTheme}
          onThemeChange={setCurrentTheme}
          isDark={isDark}
          onDarkModeToggle={() => setIsDark(!isDark)}
          onSearch={handleSearch}
          searchQuery={searchQuery}
          showFavorites={showFavorites}
          onToggleFavorites={() => setShowFavorites(!showFavorites)}
          favoriteCount={validFavorites.length}
          currentApp="msona"
          onAppChange={onAppChange}
        />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-2 mb-6">
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {showFavorites ? 'Your Favorites' : 'Discover Music'}
            </h1>
            <BetaBadge theme={currentTheme} isDark={isDark} />
          </div>
          <MusicFeed 
            theme={currentTheme}
            isDark={isDark}
            searchQuery={searchQuery}
            showFavorites={showFavorites}
            favoriteTracks={validFavorites}
            onToggleFavorite={toggleFavorite}
            onSearch={handleSearch}
          />
        </main>
        <Footer 
          theme={currentTheme}
          isDark={isDark}
        />
        <FeedbackButton
          theme={currentTheme}
          isDark={isDark}
        />
        <LogViewer
          theme={currentTheme}
          isDark={isDark}
        />
      </div>
    </AudioProvider>
  );
}