import { useState, useEffect, TouchEvent } from 'react';

/**
 * Configuration options for swipe gesture detection
 */
interface SwipeConfig {
  /** Minimum distance in pixels for a swipe to register */
  minSwipeDistance: number;
  /** Maximum time in milliseconds for a swipe to register */
  maxSwipeTime: number;
}

/**
 * Handlers for swipe gestures
 */
interface SwipeHandlers {
  /** Called when user swipes left */
  onSwipeLeft?: () => void;
  /** Called when user swipes right */
  onSwipeRight?: () => void;
}

const defaultConfig: SwipeConfig = {
  minSwipeDistance: 50,
  maxSwipeTime: 300
};

/**
 * Hook to handle touch swipe gestures on mobile devices
 * @param elementRef - Reference to the DOM element to attach swipe handlers
 * @param handlers - Object containing swipe event handlers
 * @param config - Optional configuration for swipe detection
 * @example
 * ```tsx
 * const containerRef = useRef<HTMLDivElement>(null);
 * useSwipeGestures(containerRef, {
 *   onSwipeLeft: () => console.log('Swiped left'),
 *   onSwipeRight: () => console.log('Swiped right')
 * });
 * ```
 */
export function useSwipeGestures(
  elementRef: React.RefObject<HTMLElement>,
  handlers: SwipeHandlers,
  config: SwipeConfig = defaultConfig
) {
  const [touchStart, setTouchStart] = useState<{ x: number; time: number } | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      setTouchStart({
        x: e.touches[0].clientX,
        time: Date.now()
      });
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStart) return;

      const touchEndX = e.changedTouches[0].clientX;
      const touchEndTime = Date.now();
      const distance = touchEndX - touchStart.x;
      const time = touchEndTime - touchStart.time;

      if (time <= config.maxSwipeTime) {
        if (Math.abs(distance) >= config.minSwipeDistance) {
          if (distance > 0 && handlers.onSwipeRight) {
            handlers.onSwipeRight();
          } else if (distance < 0 && handlers.onSwipeLeft) {
            handlers.onSwipeLeft();
          }
        }
      }

      setTouchStart(null);
    };

    element.addEventListener('touchstart', handleTouchStart as any);
    element.addEventListener('touchend', handleTouchEnd as any);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart as any);
      element.removeEventListener('touchend', handleTouchEnd as any);
    };
  }, [elementRef, handlers, config, touchStart]);
}