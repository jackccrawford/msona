import { spotifyConfig, spotifyApiBaseUrl } from '../config/spotify';
import type { SpotifyArtist, SpotifyTrack, SpotifyAlbum } from '../types/spotify';
import { logger, LogLevel } from './logService';

class SpotifyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SpotifyError';
  }
}

let accessToken: string | null = null;
let tokenExpirationTime: number | null = null;

const INITIAL_RETRY_DELAY = 1000; // Start with 1 second
const MAX_RETRY_DELAY = 16000;    // Max 16 seconds
const MAX_RETRIES = 3;

async function getAccessToken(): Promise<string> {
  try {
    if (accessToken && tokenExpirationTime && Date.now() < tokenExpirationTime) {
      return accessToken;
    }

    const credentials = btoa(`${spotifyConfig.clientId}:${spotifyConfig.clientSecret}`);

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${credentials}`,
        'Accept': 'application/json'
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials'
      }).toString()
    });

    if (!response.ok) {
      const error = await response.json();
      logger.log(LogLevel.ERROR, 'SpotifyService', 'Token request failed', { 
        status: response.status,
        error 
      });
      throw new SpotifyError(`Authentication failed: ${error.error_description || error.error}`);
    }

    const data = await response.json();
    accessToken = data.access_token;
    tokenExpirationTime = Date.now() + ((data.expires_in - 60) * 1000); // Expire 1 minute early

    logger.log(LogLevel.INFO, 'SpotifyService', 'New access token obtained', {
      expiresIn: data.expires_in
    });

    return accessToken;
  } catch (error) {
    logger.log(LogLevel.ERROR, 'SpotifyService', 'Failed to get access token', { 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    throw error;
  }
}

async function fetchWithRetry<T>(
  endpoint: string,
  attempt: number = 1,
  delay: number = INITIAL_RETRY_DELAY,
  forceNewToken: boolean = false
): Promise<T> {
  try {
    // Force token refresh if requested
    if (forceNewToken) {
      accessToken = null;
      tokenExpirationTime = null;
    }

    const token = await getAccessToken();
    const response = await fetch(`${spotifyApiBaseUrl}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    // Handle rate limiting with exponential backoff
    if (response.status === 429) {
      const retryAfter = parseInt(response.headers.get('Retry-After') || '1');
      const nextDelay = Math.min(delay * 2, MAX_RETRY_DELAY);
      
      logger.log(LogLevel.WARN, 'SpotifyService', 'Rate limited, retrying', { 
        attempt,
        retryAfter,
        nextDelay,
        endpoint 
      });

      if (attempt <= MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
        return fetchWithRetry(endpoint, attempt + 1, nextDelay);
      }
    }

    // Handle token expiration
    if (response.status === 401 && !forceNewToken) {
      logger.log(LogLevel.INFO, 'SpotifyService', 'Token expired, refreshing');
      return fetchWithRetry(endpoint, attempt, delay, true);
    }

    if (!response.ok) {
      const error = await response.json();
      logger.log(LogLevel.ERROR, 'SpotifyService', 'API request failed', {
        status: response.status,
        endpoint,
        error
      });
      throw new SpotifyError(error.error?.message || 'Failed to fetch from Spotify');
    }

    return response.json();
  } catch (error) {
    if (error instanceof SpotifyError) {
      throw error;
    }

    logger.log(LogLevel.ERROR, 'SpotifyService', 'Request failed', {
      endpoint,
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    // If we haven't tried with a new token yet, try one more time
    if (!forceNewToken) {
      logger.log(LogLevel.INFO, 'SpotifyService', 'Retrying with new token');
      return fetchWithRetry(endpoint, attempt, delay, true);
    }

    throw error;
  }
}

export async function searchTracks(query: string): Promise<SpotifyTrack[]> {
  try {
    const searchQuery = query.trim();
    if (!searchQuery) return [];

    logger.log(LogLevel.INFO, 'SpotifyService', 'Searching tracks', { query: searchQuery });

    const searchParams = new URLSearchParams({
      type: 'track',
      q: searchQuery,
      market: 'US',
      limit: '50'
    });

    const data = await fetchWithRetry<{tracks: {items: SpotifyTrack[]}}>
      (`/search?${searchParams}`);

    const tracks = data.tracks.items
      .filter(track => track.preview_url)
      .sort((a, b) => b.popularity - a.popularity);

    logger.log(LogLevel.INFO, 'SpotifyService', 'Search completed', { 
      resultCount: tracks.length 
    });

    return tracks;
  } catch (error) {
    logger.log(LogLevel.ERROR, 'SpotifyService', 'Search failed', { 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    throw error;
  }
}

export async function getTrackFeatures(trackId: string) {
  return fetchWithRetry<{
    danceability: number;
    energy: number;
    key: number;
    mode: number;
    tempo: number;
    time_signature: number;
    valence: number;
    acousticness: number;
  }>(`/audio-features/${trackId}`);
}

export async function getArtist(id: string): Promise<SpotifyArtist> {
  return fetchWithRetry<SpotifyArtist>(`/artists/${id}`);
}

export async function getAlbum(id: string): Promise<SpotifyAlbum> {
  return fetchWithRetry<SpotifyAlbum>(`/albums/${id}`);
}

export async function getArtistTopTracks(id: string): Promise<SpotifyTrack[]> {
  const data = await fetchWithRetry<{tracks: SpotifyTrack[]}>
    (`/artists/${id}/top-tracks?market=US`);
  return data.tracks;
}

export async function getRecommendations(
  seedTracks: string[],
  seedArtists: string[] = [],
  seedGenres: string[] = []
): Promise<SpotifyTrack[]> {
  const params = new URLSearchParams({
    seed_tracks: seedTracks.join(','),
    seed_artists: seedArtists.join(','),
    seed_genres: seedGenres.join(','),
    limit: '20'
  });

  const data = await fetchWithRetry<{tracks: SpotifyTrack[]}>
    (`/recommendations?${params}`);
  return data.tracks;
}