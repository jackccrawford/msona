import { useState, useEffect } from 'react';
import { spotifyConfig, spotifyAuthEndpoint } from '../config/spotify';

interface SpotifyAuthState {
  accessToken: string | null;
  error: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function useSpotifyAuth() {
  const [authState, setAuthState] = useState<SpotifyAuthState>({
    accessToken: null,
    error: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const error = params.get('error');

    if (error) {
      setAuthState(current => ({
        ...current,
        error,
        isLoading: false
      }));
      return;
    }

    if (!code) {
      setAuthState(current => ({
        ...current,
        isLoading: false
      }));
      return;
    }

    // Exchange code for access token
    async function getAccessToken(code: string) {
      try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: spotifyConfig.redirectUri,
            client_id: spotifyConfig.clientId,
            client_secret: spotifyConfig.clientSecret,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to get access token');
        }

        const data = await response.json();
        
        setAuthState({
          accessToken: data.access_token,
          error: null,
          isAuthenticated: true,
          isLoading: false
        });

        // Remove code from URL without reloading the page
        window.history.replaceState({}, '', window.location.pathname);
      } catch (error) {
        setAuthState({
          accessToken: null,
          error: error instanceof Error ? error.message : 'Authentication failed',
          isAuthenticated: false,
          isLoading: false
        });
      }
    }

    if (code) {
      getAccessToken(code);
    }
  }, []);

  const login = () => {
    const params = new URLSearchParams({
      client_id: spotifyConfig.clientId,
      response_type: 'code',
      redirect_uri: spotifyConfig.redirectUri,
      scope: spotifyConfig.scopes,
      show_dialog: 'true'
    });

    window.location.href = `${spotifyAuthEndpoint}?${params}`;
  };

  const logout = () => {
    setAuthState({
      accessToken: null,
      error: null,
      isAuthenticated: false,
      isLoading: false
    });
  };

  return {
    ...authState,
    login,
    logout
  };
}