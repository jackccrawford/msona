import React, { useState, useRef, useEffect } from 'react';
import { Volume2, ChevronDown, ChevronUp } from 'lucide-react';
import { elevenLabsConfig } from '../config/elevenlabs';
import { useOnClickOutside } from '../hooks/useOnClickOutside';
import type { Theme } from '../types/Theme';

interface VoiceSelectorProps {
  selectedVoice: string;
  onVoiceChange: (voiceId: string) => void;
  isDark: boolean;
  theme: Theme;
  isCompact?: boolean;
}

export function VoiceSelector({ selectedVoice, onVoiceChange, isDark, theme, isCompact }: VoiceSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuId = 'voice-selector-menu';

  useOnClickOutside(menuRef, () => setIsOpen(false));

  useEffect(() => {
    if (isOpen && menuRef.current && buttonRef.current) {
      const menuRect = menuRef.current.getBoundingClientRect();
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

      // If menu would overflow right side of viewport
      if (buttonRect.left + menuRect.width > viewportWidth) {
        const overflow = buttonRect.left + menuRect.width - viewportWidth;
        menuRef.current.style.left = `${-overflow - 16}px`; // 16px for padding
      } else {
        menuRef.current.style.left = '0';
      }
    }
  }, [isOpen]);

  const selectedVoiceData = elevenLabsConfig.voices.find(v => v.id === selectedVoice);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 transition-all duration-300 border border-transparent
          ${isCompact ? 'px-3 py-1.5' : 'px-4 py-2'}
          rounded-full
          ${isDark 
            ? 'text-gray-300 hover:text-white hover:bg-gray-800 hover:border-white/75' 
            : `${theme.accent} hover:bg-white hover:shadow-md hover:border-gray-200`
          }
        `}
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-haspopup="listbox"
      >
        <Volume2 className={`transition-all duration-300 ${isCompact ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />
        <span className={`text-sm font-medium hidden sm:inline transition-all duration-300 ${isCompact ? 'text-xs' : 'text-sm'}`}>
          {selectedVoiceData?.name}
        </span>
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          id={menuId}
          role="listbox"
          aria-label="Select voice"
          className={`
            absolute mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-50
            transition-all duration-300
          `}
          style={{ right: 0 }}
        >
          {elevenLabsConfig.voices.map((voice) => (
            <button
              key={voice.id}
              role="option"
              aria-selected={voice.id === selectedVoice}
              onClick={() => {
                onVoiceChange(voice.id);
                setIsOpen(false);
              }}
              className={`
                w-full text-left px-4 py-2 text-sm
                ${voice.id === selectedVoice
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }
              `}
            >
              <div className="font-medium">{voice.name}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {voice.description}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}