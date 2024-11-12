import { aiConfig } from '../config/ai';
import { TransformationError } from '../types/errors';
import type { AIResponse, OpenAIResponse, GrokResponse } from '../types/AI';
import { logger, LogLevel } from './logService';

const MAX_RETRIES = 2;

export async function generateAIResponse(prompt: string): Promise<AIResponse> {
  let lastError: Error | null = null;
  let attempts = 0;

  while (attempts < MAX_RETRIES) {
    try {
      if (!aiConfig.grok.apiKey) {
        throw new TransformationError('API key is not configured');
      }

      logger.log(LogLevel.INFO, 'AIService', 'Generating response', {
        promptLength: prompt.length
      });

      const response = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${aiConfig.grok.apiKey}`
        },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: prompt
          }],
          model: aiConfig.grok.model,
          temperature: aiConfig.grok.temperature
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        logger.log(LogLevel.ERROR, 'AIService', 'API error response', {
          status: response.status,
          error: errorData
        });
        throw new TransformationError(
          errorData.error || 
          `API request failed (${response.status}). Please try again.`
        );
      }

      const data = await response.json() as GrokResponse;
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new TransformationError('No content in AI response');
      }

      // Check for refusal
      if ('refusal' in data.choices[0].message && data.choices[0].message.refusal) {
        throw new TransformationError('AI refused to generate response');
      }

      logger.log(LogLevel.INFO, 'AIService', 'Successfully generated response', {
        contentLength: content.length
      });

      return { text: content.trim().replace(/^["']|["']$/g, '') };

    } catch (error) {
      logger.log(LogLevel.ERROR, 'AIService', `Attempt ${attempts + 1} failed`, {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      lastError = error instanceof Error ? error : new Error('Unknown error');
      attempts++;
      
      if (attempts < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
      }
    }
  }

  return {
    text: '',
    error: lastError?.message || 'Failed to generate AI response after multiple attempts'
  };
}