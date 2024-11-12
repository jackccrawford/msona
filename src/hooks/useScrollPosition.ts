import { useState, useEffect } from 'react';

/**
 * Hook to track scroll position and determine if page has been scrolled past threshold
 * @returns {{ isScrolled: boolean }} Object containing scroll state
 * @example
 * const { isScrolled } = useScrollPosition();
 */
export function useScrollPosition() {
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollThreshold = 100; // Pixels to scroll before triggering

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > scrollThreshold);
    };

    // Add passive listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { isScrolled };
}