import React, { useState, useRef, useEffect } from 'react';
import { Palette, CircleDashed } from 'lucide-react';
import { themes } from '../types/Theme';
import type { Theme } from '../types/Theme';

interface ThemeSelectorProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
  isDark: boolean;
  isCompact?: boolean;
}

export function ThemeSelector({ currentTheme, onThemeChange, isDark, isCompact }: ThemeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuId = React.useId();

  useEffect(() => {
    if (isOpen && menuRef.current && buttonRef.current) {
      const menuRect = menuRef.current.getBoundingClientRect();
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

      if (buttonRect.left + menuRect.width > viewportWidth) {
        const overflow = buttonRect.left + menuRect.width - viewportWidth;
        menuRef.current.style.left = `${-overflow - 16}px`;
      } else {
        menuRef.current.style.left = '0';
      }
    }
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          p-2 rounded-lg transition-colors duration-300
          ${isDark 
            ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
            : `${currentTheme.accent} hover:bg-gray-100`
          }
        `}
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-haspopup="listbox"
        title="Change theme"
      >
        <Palette className="w-5 h-5" aria-hidden="true" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div 
            ref={menuRef}
            id={menuId}
            className={`
              absolute mt-2 w-48 bg-gray-50 dark:bg-slate-800 rounded-lg shadow-lg 
              overflow-hidden z-20 border border-gray-200 dark:border-gray-700
              transition-all duration-300
            `}
            style={{ right: 0 }}
            role="listbox"
            aria-label="Available themes"
          >
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => {
                  onThemeChange(theme);
                  setIsOpen(false);
                }}
                className={`
                  w-full px-4 py-2 text-left text-sm flex items-center gap-2
                  ${theme.id === currentTheme.id 
                    ? 'bg-white dark:bg-gray-700' 
                    : 'hover:bg-white dark:hover:bg-gray-700'
                  }
                  ${isDark ? 'text-gray-200 hover:text-white' : 'text-gray-700 hover:text-gray-900'}
                `}
                role="option"
                aria-selected={theme.id === currentTheme.id}
              >
                {theme.id === 'monochrome' ? (
                  <CircleDashed className="w-4 h-4" aria-hidden="true" />
                ) : (
                  <div 
                    className={`w-4 h-4 rounded-full bg-gradient-to-r ${theme.gradient.from} ${theme.gradient.via} ${theme.gradient.to}`}
                    aria-hidden="true"
                  />
                )}
                <span>{theme.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}