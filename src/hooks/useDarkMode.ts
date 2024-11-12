import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

/**
 * Custom hook for managing dark mode state
 * Syncs with system preferences and persists user choice
 * @returns {[boolean, (value: boolean) => void]} A tuple containing the dark mode state and a setter function
 * @example
 * const [isDark, setIsDark] = useDarkMode();
 */
export function useDarkMode() {
  const [isDark, setIsDark] = useLocalStorage('darkMode', false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return [isDark, setIsDark] as const;
}