import { useState, useEffect } from 'react';

/**
 * Custom hook for managing state in localStorage with cookie consent awareness
 * @template T The type of the stored value
 * @param {string} key The localStorage key
 * @param {T} initialValue The initial value if no stored value exists
 * @returns {[T, (value: T) => void]} A tuple containing the current value and a setter function
 * @example
 * const [favorites, setFavorites] = useLocalStorage<string[]>('favorites', []);
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}