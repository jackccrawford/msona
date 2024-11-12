import React from 'react';
import { Music2 } from 'lucide-react';
import type { Theme } from '../../../types/Theme';

interface LoginScreenProps {
  onLogin: () => void;
  error: string | null;
  theme: Theme;
  isDark: boolean;
}

export function LoginScreen({ onLogin, error, theme, isDark }: LoginScreenProps) {
  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.background} flex items-center justify-center p-4`}>
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Music2 className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-white' : theme.accent}`} />
          <h1 className={`text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            mSona
          </h1>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Your Personal Music Discovery Journey
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-300 rounded-lg text-center">
            {error}
          </div>
        )}

        <button
          onClick={onLogin}
          className={`
            w-full py-3 px-4 rounded-lg font-medium text-white
            bg-gradient-to-r ${theme.gradient.from} ${theme.gradient.via} ${theme.gradient.to}
            hover:opacity-90 transition-opacity duration-300
            flex items-center justify-center gap-2
          `}
        >
          <span>Connect with Spotify</span>
        </button>
      </div>
    </div>
  );
}