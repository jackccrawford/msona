import { useEffect, RefObject } from 'react';

/**
 * Hook to handle clicks outside of a specified element
 * Useful for closing dropdowns, modals, etc. when clicking outside
 * @param ref - Reference to the element to monitor
 * @param handler - Callback function when click outside occurs
 * @example
 * ```tsx
 * const menuRef = useRef<HTMLDivElement>(null);
 * useOnClickOutside(menuRef, () => setIsOpen(false));
 * ```
 */
export function useOnClickOutside(
  ref: RefObject<HTMLElement>,
  handler: (event: MouseEvent | TouchEvent) => void
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}