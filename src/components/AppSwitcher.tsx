import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, Sparkles, Music2 } from 'lucide-react';
import { useOnClickOutside } from '../hooks/useOnClickOutside';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Theme } from '../types/Theme';
import type { AppMode } from '../config/app';

interface AppSwitcherProps {
  currentApp: AppMode;
  onAppChange: (app: AppMode) => void;
  theme: Theme;
  isDark: boolean;
  isScrolled?: boolean;
}

export function AppSwitcher({ currentApp, onAppChange, theme, isDark, isScrolled }: AppSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuId = React.useId();
  const [lastUsedApp, setLastUsedApp] = useLocalStorage<AppMode>('lastUsedApp', 'luminary');

  useOnClickOutside(menuRef, () => setIsOpen(false));

  // Update last used app preference
  useEffect(() => {
    setLastUsedApp(currentApp);
  }, [currentApp, setLastUsedApp]);

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

  const apps = [
    {
      id: 'luminary' as AppMode,
      name: 'Luminary',
      description: 'Finding light in words of wisdom',
      icon: Sparkles
    },
    {
      id: 'msona' as AppMode,
      name: 'mSona',
      description: 'Your Personal Music Discovery Journey',
      icon: Music2
    }
  ];

  const currentAppInfo = apps.find(app => app.id === currentApp)!;
  const otherApp = apps.find(app => app.id !== currentApp)!;

  return (
    <div className="relative flex-1 flex items-center justify-between">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-3 group
          transition-all duration-300
          ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}
          rounded-xl px-3 py-2
        `}
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-haspopup="listbox"
      >
        <currentAppInfo.icon 
          className={`
            transition-all duration-300
            ${isScrolled ? 'w-10 h-10' : 'w-12 h-12'}
            ${isDark ? 'text-white' : theme.accent}
          `}
          strokeWidth={1}
        />
        <div>
          <h1 className={`
            font-bold bg-gradient-to-r ${isDark ? 'from-white to-gray-300' : `${theme.gradient.from} ${theme.gradient.via} ${theme.gradient.to}`} bg-clip-text text-transparent
            transition-all duration-300
            ${isScrolled ? 'text-2xl' : 'text-4xl'}
          `}>
            {currentAppInfo.name}
          </h1>
          {!isScrolled && (
            <p className={`text-sm ${isDark ? 'text-white/75' : `${theme.accent}/80`} font-medium mt-1 ml-0.5`}>
              {currentAppInfo.description}
            </p>
          )}
        </div>
        {isOpen ? (
          <ChevronUp className={`w-5 h-5 ${isDark ? 'text-white' : 'text-gray-600'}`} />
        ) : (
          <ChevronDown className={`w-5 h-5 ${isDark ? 'text-white' : 'text-gray-600'}`} />
        )}
      </button>

      {currentApp === 'luminary' && (
        <button
          onClick={() => onAppChange('msona')}
          className={`
            absolute right-0 transform
            text-sm font-medium px-3 py-1.5 rounded-full
            bg-gradient-to-r ${theme.gradient.from} ${theme.gradient.via} ${theme.gradient.to}
            text-white shadow-lg hover:opacity-90 transition-opacity
            flex items-center gap-2
            whitespace-nowrap
          `}
        >
          <span>New! Try mSona</span>
        </button>
      )}

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
            aria-label="Available apps"
          >
            {apps.map((app) => (
              <button
                key={app.id}
                onClick={() => {
                  onAppChange(app.id);
                  setIsOpen(false);
                }}
                className={`
                  w-full px-4 py-2 text-left text-sm flex items-center gap-2
                  ${app.id === currentApp 
                    ? 'bg-white dark:bg-gray-700' 
                    : 'hover:bg-white dark:hover:bg-gray-700'
                  }
                  ${isDark ? 'text-gray-200 hover:text-white' : 'text-gray-700 hover:text-gray-900'}
                `}
                role="option"
                aria-selected={app.id === currentApp}
              >
                <app.icon className="w-4 h-4" aria-hidden="true" />
                <span>{app.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}