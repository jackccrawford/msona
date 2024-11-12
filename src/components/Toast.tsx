import React from 'react';
import { CheckCircle } from 'lucide-react';
import type { Theme } from '../types/Theme';

interface ToastProps {
  message: string;
  theme: Theme;
  isDark: boolean;
}

export function Toast({ message, theme, isDark }: ToastProps) {
  return (
    <div className={`
      fixed bottom-4 left-1/2 -translate-x-1/2 
      flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg
      animate-slideUp
      ${isDark 
        ? 'bg-gray-800 text-white' 
        : 'bg-white text-gray-900'
      }
    `}>
      <CheckCircle className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-500'}`} />
      <span className="font-medium">{message}</span>
    </div>
  );
}