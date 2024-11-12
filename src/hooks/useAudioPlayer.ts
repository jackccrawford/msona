import { useState, useEffect, useRef } from 'react';
import { synthesizeSpeech } from '../services/speechService';
import { SpeechError } from '../types/errors';
import { elevenLabsConfig } from '../config/elevenlabs';
import { logger, LogLevel } from '../services/logService';

interface AudioPlayerState {
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
  play: () => Promise<void>;
  stop: () => void;
}

export function useAudioPlayer(text: string, voiceId: string): AudioPlayerState {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Reset audio when voice changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      URL.revokeObjectURL(audioRef.current.src);
      audioRef.current = null;
      setIsPlaying(false);
      setIsLoading(false);
      setError(null);
    }
  }, [voiceId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
        audioRef.current = null;
      }
    };
  }, []);

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const play = async () => {
    try {
      setError(null);

      // If already playing, stop
      if (isPlaying) {
        stop();
        return;
      }

      // Check if API key is configured
      if (!elevenLabsConfig.apiKey) {
        throw new SpeechError('Text-to-speech is not configured');
      }

      // Always generate new audio when play is clicked
      if (audioRef.current) {
        URL.revokeObjectURL(audioRef.current.src);
        audioRef.current = null;
      }

      setIsLoading(true);
      logger.log(LogLevel.INFO, 'AudioPlayer', 'Generating speech', { textLength: text.length });
      
      const audioUrl = await synthesizeSpeech(text, voiceId);
      
      // Create and set up new audio element
      const audio = new Audio();
      
      // Set up event listeners before loading the audio
      audio.addEventListener('canplaythrough', () => {
        audio.play().catch(error => {
          logger.log(LogLevel.ERROR, 'AudioPlayer', 'Playback failed', { error });
          setError('Failed to play audio. Please try again.');
          setIsPlaying(false);
        });
      }, { once: true });

      audio.addEventListener('error', () => {
        logger.log(LogLevel.ERROR, 'AudioPlayer', 'Audio loading failed');
        setError('Failed to load audio. Please try again.');
        setIsPlaying(false);
      }, { once: true });

      audio.addEventListener('ended', () => {
        setIsPlaying(false);
      }, { once: true });

      // Set the source and load the audio
      audio.src = audioUrl;
      audioRef.current = audio;
      setIsPlaying(true);

    } catch (error) {
      let errorMessage = 'Failed to generate speech. Please try again.';
      
      if (error instanceof SpeechError) {
        errorMessage = error.message;
      }
      
      logger.log(LogLevel.ERROR, 'AudioPlayer', errorMessage, { error });
      setError(errorMessage);
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  };

  return { isPlaying, isLoading, error, play, stop };
}