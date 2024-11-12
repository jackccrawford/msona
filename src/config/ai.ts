import type { AIProvider } from '../types/AIProvider';

export interface AIStyle {
  id: string;
  name: string;
  prompt: string;
}

export interface AIConfig {
  provider: AIProvider;
  openai: {
    apiKey: string;
    model: string;
    temperature: number;
    maxTokens: number;
  };
  grok: {
    apiKey: string;
    model: string;
    temperature: number;
  };
  defaultPrompt: string;
  defaultStyles: AIStyle[];
}

export const aiConfig: AIConfig = {
  provider: 'grok',
  openai: {
    apiKey: '',
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 150,
  },
  grok: {
    apiKey: import.meta.env.VITE_GROK_API_KEY || '',
    model: 'grok-beta',
    temperature: 0,
  },
  defaultPrompt: 'Transform this quote in the style of Shakespeare',
  defaultStyles: [
    {
      id: 'shakespeare',
      name: 'Shakespeare',
      prompt: 'Transform this quote as if written by Shakespeare'
    },
    {
      id: 'yoda',
      name: 'Yoda',
      prompt: 'Transform this quote in Yoda\'s speaking style'
    },
    {
      id: 'pirate',
      name: 'Pirate',
      prompt: 'Transform this quote as a pirate would say it'
    },
    {
      id: 'haiku',
      name: 'Haiku',
      prompt: 'Transform this quote into a haiku'
    },
    {
      id: 'proverb',
      name: 'Ancient Proverb',
      prompt: 'Transform this quote into an ancient proverb style'
    }
  ]
};