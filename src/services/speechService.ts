import { elevenLabsConfig } from '../config/elevenlabs';
import { SpeechError } from '../types/errors';
import { logger, LogLevel } from './logService';

const MAX_RETRIES = 2;
const RETRY_DELAY = 1000;

export async function synthesizeSpeech(text: string, voiceId?: string): Promise<string> {
  logger.log(LogLevel.INFO, 'SpeechService', 'Synthesizing speech', { 
    textLength: text.length, 
    voiceId 
  });

  if (!elevenLabsConfig.apiKey) {
    logger.log(LogLevel.ERROR, 'SpeechService', 'API key not configured');
    throw new SpeechError('Text-to-speech is not configured');
  }

  // Check if the browser supports audio playback
  const audio = new Audio();
  if (!audio.canPlayType('audio/mpeg')) {
    logger.log(LogLevel.ERROR, 'SpeechService', 'Browser does not support MP3 playback');
    throw new SpeechError('Your browser does not support MP3 audio playback.');
  }

  const selectedVoiceId = voiceId || elevenLabsConfig.defaultVoiceId;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      logger.log(LogLevel.DEBUG, 'SpeechService', `Attempt ${attempt + 1} of ${MAX_RETRIES}`);

      const response = await fetch(
        `${elevenLabsConfig.apiUrl}/text-to-speech/${selectedVoiceId}`,
        {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': elevenLabsConfig.apiKey,
          },
          body: JSON.stringify({
            text,
            model_id: 'eleven_monolingual_v1',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75,
              optimize_streaming_latency: 3,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        logger.log(LogLevel.ERROR, 'SpeechService', 'API request failed', {
          status: response.status,
          error: errorData
        });
        throw new SpeechError(
          errorData.error || 
          `Speech synthesis failed (${response.status}). Please try again.`
        );
      }

      const audioBlob = await response.blob();
      if (audioBlob.size === 0) {
        logger.log(LogLevel.ERROR, 'SpeechService', 'Received empty audio response');
        throw new SpeechError('Received empty audio response. Please try again.');
      }

      logger.log(LogLevel.INFO, 'SpeechService', 'Successfully synthesized speech', {
        blobSize: audioBlob.size
      });

      return URL.createObjectURL(audioBlob);

    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      logger.log(LogLevel.WARN, 'SpeechService', `Attempt ${attempt + 1} failed`, {
        error: lastError.message
      });
      
      if (attempt < MAX_RETRIES - 1) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (attempt + 1)));
      }
    }
  }

  logger.log(LogLevel.ERROR, 'SpeechService', 'All attempts failed');
  throw lastError || new SpeechError('Failed to generate speech after multiple attempts.');
}