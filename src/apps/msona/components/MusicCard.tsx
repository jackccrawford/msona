import React, { useState } from 'react';
import { Play, Pause, Heart, Share2, CheckCircle2, ChevronDown, ChevronUp, ExternalLink, Music4 } from 'lucide-react';
import { useAudioContext } from '../context/AudioContext';
import { logger, LogLevel } from '../../../services/logService';
import type { Theme } from '../../../types/Theme';
import type { SpotifyTrack } from '../../../types/spotify';

interface MusicCardProps {
  track: SpotifyTrack;
  theme: Theme;
  isDark: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: (track: SpotifyTrack) => void;
  onExpand: () => void;
  features?: {
    energy: number;
    danceability: number;
    valence: number;
    acousticness: number;
    key: string;
    tempo: number;
    timeSignature: string;
  };
}

export function MusicCard({ 
  track, 
  theme, 
  isDark, 
  isFavorite, 
  onToggleFavorite, 
  features,
  onExpand 
}: MusicCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const { currentlyPlaying, play, stop } = useAudioContext();
  const isPlaying = currentlyPlaying === track.id;
  const isMonochrome = theme.id === 'monochrome';

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!track.preview_url) return;
    
    if (isPlaying) {
      stop();
    } else {
      play(track.id, track.preview_url);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `${track.name} by ${track.artists.map(a => a.name).join(', ')}`;

    try {
      if (navigator.share && window.innerWidth <= 768) {
        await navigator.share({ text });
      } else {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (clipboardError) {
        console.error('Failed to copy to clipboard:', clipboardError);
      }
    }
  };

  const toggleExpand = () => {
    const newExpandedState = !isExpanded;
    
    logger.log(LogLevel.DEBUG, 'MusicCard', 'Toggle expand clicked', {
      trackId: track.id,
      currentExpanded: isExpanded,
      newExpandedState,
      hasFeatures: !!features
    });
    
    if (newExpandedState && !features) {
      onExpand();
    }
    
    setIsExpanded(newExpandedState);
  };

  return (
    <article className={`
      bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-2xl shadow-lg 
      transition-all duration-300 hover:shadow-xl
    `}>
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex gap-4">
            <div className="relative group">
              <img 
                src={track.album.images[1]?.url || track.album.images[0]?.url} 
                alt={track.album.name}
                className="w-24 h-24 rounded-lg shadow-md"
              />
              {track.preview_url && (
                <button
                  onClick={handlePlayPause}
                  className={`
                    absolute inset-0 flex items-center justify-center
                    bg-black/50 opacity-0 group-hover:opacity-100
                    transition-opacity duration-300 rounded-lg
                  `}
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8 text-white" />
                  ) : (
                    <Play className="w-8 h-8 text-white" />
                  )}
                </button>
              )}
            </div>

            <div className="flex flex-col gap-2">
              {onToggleFavorite && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(track);
                  }}
                  className={`
                    p-2 rounded-xl transition-all duration-300
                    ${isDark 
                      ? 'text-gray-400 hover:text-white hover:bg-white/20' 
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                    }
                  `}
                  title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Heart 
                    className={`w-5 h-5 transition-colors duration-300 ${
                      isFavorite 
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
                </button>
              )}

              <button
                onClick={handleShare}
                className={`
                  p-2 rounded-xl transition-all duration-300
                  ${isDark 
                    ? 'text-gray-400 hover:text-white hover:bg-white/20' 
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                  }
                `}
                title={copied ? 'Copied!' : 'Share'}
              >
                {copied ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <Share2 className="w-5 h-5" />
                )}
              </button>

              <button
                onClick={toggleExpand}
                className={`
                  p-2 rounded-xl transition-all duration-300
                  ${isDark 
                    ? 'text-gray-400 hover:text-white hover:bg-white/20' 
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                  }
                `}
                title={isExpanded ? 'Show less' : 'Show more'}
              >
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className={`text-lg font-semibold break-words ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {track.name}
                </h2>
                <p className={`text-sm break-words ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {track.artists.map(artist => artist.name).join(', ')}
                </p>
                <p className={`text-sm break-words ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {track.album.name}
                </p>
              </div>
              <a
                href={track.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm
                  transition-all duration-300 flex-shrink-0
                  ${isDark
                    ? 'bg-[#1DB954] text-black hover:bg-[#1ed760]'
                    : 'bg-[#1DB954] text-white hover:bg-[#1ed760]'
                  }
                `}
              >
                <Music4 className="w-4 h-4" />
                <span className="font-medium">Spotify</span>
              </a>
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-gray-100'}`}>
                <div className="text-sm text-gray-500 dark:text-gray-400">Popularity</div>
                <div className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {track.popularity}%
                </div>
              </div>
              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-gray-100'}`}>
                <div className="text-sm text-gray-500 dark:text-gray-400">Duration</div>
                <div className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {Math.floor(track.duration_ms / 60000)}:{String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0')}
                </div>
              </div>
              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-gray-100'}`}>
                <div className="text-sm text-gray-500 dark:text-gray-400">Preview</div>
                <div className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {track.preview_url ? 'Available' : 'Not Available'}
                </div>
              </div>
            </div>

            {features && (
              <div className="space-y-4">
                <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Track Features
                </h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Energy</span>
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{Math.round(features.energy * 100)}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-orange-500"
                        style={{ width: `${features.energy * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Groove</span>
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{Math.round(features.danceability * 100)}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-purple-500"
                        style={{ width: `${features.danceability * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Mood</span>
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{Math.round(features.valence * 100)}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500"
                        style={{ width: `${features.valence * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Raw</span>
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{Math.round(features.acousticness * 100)}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500"
                        style={{ width: `${features.acousticness * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                    <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-gray-100'}`}>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Key</div>
                      <div className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {features.key}
                      </div>
                    </div>

                    <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-gray-100'}`}>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Tempo</div>
                      <div className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {features.tempo} BPM
                      </div>
                    </div>

                    <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-gray-100'}`}>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Time Signature</div>
                      <div className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {features.timeSignature}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}