import { useState, useEffect } from 'react';

/**
 * Hook to handle responsive design breakpoints
 * @param {string} query The media query to match against
 * @returns {boolean} Whether the media query matches
 * @example
 * const isMobile = useMediaQuery('(max-width: 639px)');
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}