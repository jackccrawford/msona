import React, { useState, useEffect } from 'react';
import { searchTracks, getTrackFeatures } from '../../../services/spotifyService';
import { MusicCard } from './MusicCard';
import { LoadingCards } from './LoadingCards';
import { QuickPicks } from './QuickPicks';
import { logger, LogLevel } from '../../../services/logService';
import type { Theme } from '../../../types/Theme';
import type { SpotifyTrack } from '../../../types/spotify';

interface MusicFeedProps {
  theme: Theme;
  isDark: boolean;
  searchQuery?: string;
  showFavorites?: boolean;
  favoriteTracks: SpotifyTrack[];
  onToggleFavorite: (track: SpotifyTrack) => void;
  onSearch: (query: string) => void;
}

export function MusicFeed({ 
  theme, 
  isDark, 
  searchQuery, 
  showFavorites = false,
  favoriteTracks,
  onToggleFavorite,
  onSearch 
}: MusicFeedProps) {
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trackFeatures, setTrackFeatures] = useState<Record<string, any>>({});
  const [loadingFeatures, setLoadingFeatures] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function loadTracks() {
      if (!searchQuery?.trim()) return;

      try {
        setLoading(true);
        setError(null);
        logger.log(LogLevel.INFO, 'MusicFeed', 'Searching tracks', { query: searchQuery });
        
        const results = await searchTracks(searchQuery);
        setTracks(results);
        
        logger.log(LogLevel.INFO, 'MusicFeed', 'Search completed', { 
          resultCount: results.length
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load tracks';
        logger.log(LogLevel.ERROR, 'MusicFeed', 'Search failed', { error: message });
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    loadTracks();
  }, [searchQuery]);

  const handleLoadFeatures = async (trackId: string) => {
    // Skip if already loading or we already have features
    if (loadingFeatures[trackId] || trackFeatures[trackId]) return;

    try {
      setLoadingFeatures(prev => ({ ...prev, [trackId]: true }));
      
      const data = await getTrackFeatures(trackId);
      setTrackFeatures(prev => ({
        ...prev,
        [trackId]: {
          energy: data.energy,
          danceability: data.danceability,
          valence: data.valence,
          acousticness: data.acousticness,
          key: getKeyName(data.key, data.mode),
          tempo: Math.round(data.tempo),
          timeSignature: `${data.time_signature}/4`
        }
      }));
    } catch (error) {
      logger.log(LogLevel.ERROR, 'MusicFeed', 'Failed to fetch track features', { 
        trackId, 
        error 
      });
    } finally {
      setLoadingFeatures(prev => ({ ...prev, [trackId]: false }));
    }
  };

  if (loading) {
    return <LoadingCards />;
  }

  if (error) {
    return (
      <div className={`text-center py-12 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
        {error}
      </div>
    );
  }

  // Filter out any favorite tracks that might be missing required data
  const validFavorites = favoriteTracks.filter(track => 
    track && track.id && track.name && track.artists && track.album
  );

  const displayedTracks = showFavorites ? validFavorites : tracks;

  // Show quick picks only when there's no search and not showing favorites
  if (!searchQuery?.trim() && !showFavorites) {
    return (
      <QuickPicks 
        theme={theme} 
        isDark={isDark}
        onSelect={onSearch}
      />
    );
  }

  if (displayedTracks.length === 0) {
    return (
      <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        {showFavorites ? 'No favorite tracks yet' : 'No tracks found. Please try a different search.'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {displayedTracks.map(track => (
        <MusicCard
          key={track.id}
          track={track}
          theme={theme}
          isDark={isDark}
          isFavorite={favoriteTracks.some(t => t.id === track.id)}
          onToggleFavorite={onToggleFavorite}
          features={trackFeatures[track.id]}
          onExpand={() => handleLoadFeatures(track.id)}
        />
      ))}
    </div>
  );
}

// Helper function to convert key number to name
function getKeyName(key: number, mode: number): string {
  const keys = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
  return `${keys[key]} ${mode ? 'Major' : 'Minor'}`;
}