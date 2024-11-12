import { useEffect, useCallback } from 'react';

/**
 * Props for infinite scroll functionality
 */
interface UseInfiniteScrollProps {
  /** Callback function to load more items */
  onLoadMore: () => void;
  /** Whether items are currently being loaded */
  isLoading: boolean;
  /** Whether there are more items to load */
  hasMore: boolean;
  /** Distance from bottom in pixels to trigger load more (default: 200) */
  threshold?: number;
}

/**
 * Hook to implement infinite scroll functionality
 * Automatically triggers loading of more content when user scrolls near the bottom
 * @param props - Configuration options
 * @example
 * ```tsx
 * useInfiniteScroll({
 *   onLoadMore: fetchMoreQuotes,
 *   isLoading: loading,
 *   hasMore: hasMorePages,
 *   threshold: 300
 * });
 * ```
 */
export function useInfiniteScroll({
  onLoadMore,
  isLoading,
  hasMore,
  threshold = 200
}: UseInfiniteScrollProps) {
  const handleScroll = useCallback(() => {
    if (isLoading || !hasMore) return;

    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;
    const clientHeight = window.innerHeight;

    if (scrollHeight - scrollTop - clientHeight < threshold) {
      onLoadMore();
    }
  }, [onLoadMore, isLoading, hasMore, threshold]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);
}