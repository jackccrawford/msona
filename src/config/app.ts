export type AppMode = 'luminary' | 'msona';

export interface AppConfig {
  mode: AppMode;
  name: string;
  description: string;
  features: {
    darkMode: boolean;
    themes: boolean;
    audio: boolean;
    favorites: boolean;
    sharing: boolean;
    ai: boolean;
  };
}

export const appConfig: AppConfig = {
  mode: 'luminary',
  name: 'Luminary',
  description: 'Finding light in words of wisdom',
  features: {
    darkMode: true,
    themes: true,
    audio: true,
    favorites: true,
    sharing: true,
    ai: true
  }
};

export function isLuminary(): boolean {
  return appConfig.mode === 'luminary';
}

export function isMSona(): boolean {
  return appConfig.mode === 'msona';
}