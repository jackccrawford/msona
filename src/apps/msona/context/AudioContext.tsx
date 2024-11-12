import React, { createContext, useContext, useCallback, useRef, useState } from 'react';

interface AudioContextType {
  currentlyPlaying: string | null;
  play: (trackId: string, url: string) => void;
  stop: () => void;
  volume: number;
  setVolume: (volume: number) => void;
  isBuffering: boolean;
}

const AudioContext = createContext<AudioContextType>({
  currentlyPlaying: null,
  play: () => {},
  stop: () => {},
  volume: 1,
  setVolume: () => {},
  isBuffering: false
});

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [volume, setVolume] = useState(1);
  const [isBuffering, setIsBuffering] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setCurrentlyPlaying(null);
    setIsBuffering(false);
  }, []);

  const play = useCallback((trackId: string, url: string) => {
    // Stop current audio if playing
    if (audioRef.current) {
      audioRef.current.pause();
    }

    // If clicking the same track that's playing, just stop
    if (currentlyPlaying === trackId) {
      stop();
      return;
    }

    setIsBuffering(true);

    // Play new track
    audioRef.current = new Audio(url);
    audioRef.current.volume = volume;

    audioRef.current.addEventListener('canplaythrough', () => {
      setIsBuffering(false);
      audioRef.current?.play();
    }, { once: true });

    audioRef.current.addEventListener('ended', stop, { once: true });
    audioRef.current.addEventListener('error', () => {
      setIsBuffering(false);
      stop();
    }, { once: true });

    audioRef.current.load();
    setCurrentlyPlaying(trackId);
  }, [currentlyPlaying, stop, volume]);

  // Update volume for current audio
  React.useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <AudioContext.Provider value={{ 
      currentlyPlaying,
      play,
      stop,
      volume,
      setVolume,
      isBuffering
    }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudioContext() {
  return useContext(AudioContext);
}