import React from 'react';
import { Cookie } from 'lucide-react';
import type { Theme } from '../types/Theme';

interface CookieConsentProps {
  onAccept: () => void;
  onDecline: () => void;
  theme: Theme;
  isDark: boolean;
}

export function CookieConsent({ onAccept, onDecline, theme, isDark }: CookieConsentProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Modal */}
      <div className={`
        relative w-full max-w-lg rounded-2xl shadow-lg
        ${isDark ? 'bg-slate-900' : 'bg-white'}
        p-6
      `}>
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <Cookie className={`w-6 h-6 ${isDark ? 'text-white' : theme.accent}`} />
            <div>
              <h2 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Cookie Preferences
              </h2>
              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                We use cookies to enhance your experience by remembering your preferences. 
                By accepting, you allow us to store your preferences. If you decline, 
                no data will be stored and you'll be asked again on your next visit.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
            <button
              onClick={onDecline}
              className={`
                px-4 py-2 rounded-full text-sm font-medium
                transition-all duration-300
                ${isDark 
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              Decline
            </button>
            <button
              onClick={onAccept}
              className={`
                px-4 py-2 rounded-full text-sm font-medium
                transition-all duration-300
                ${isDark
                  ? 'bg-white text-gray-900 hover:bg-gray-100'
                  : `bg-gray-900 text-white hover:bg-gray-800`
                }
              `}
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}