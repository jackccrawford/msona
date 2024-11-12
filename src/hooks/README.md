# Custom Hooks Documentation

## Core Hooks

### useLocalStorage
\`\`\`typescript
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void]
\`\`\`
Persists state in localStorage with cookie consent awareness.

### useDarkMode
\`\`\`typescript
function useDarkMode(): [boolean, (value: boolean) => void]
\`\`\`
Manages dark mode state with system preference detection.

### useScrollPosition
\`\`\`typescript
function useScrollPosition(): { isScrolled: boolean }
\`\`\`
Tracks scroll position for header/footer animations.

### useSwipeGestures
\`\`\`typescript
function useSwipeGestures(
  elementRef: React.RefObject<HTMLElement>,
  handlers: SwipeHandlers,
  config?: SwipeConfig
): void
\`\`\`
Handles mobile swipe gestures.

### useInfiniteScroll
\`\`\`typescript
function useInfiniteScroll({
  onLoadMore: () => void,
  isLoading: boolean,
  hasMore: boolean,
  threshold?: number
}): void
\`\`\`
Implements infinite scroll functionality.

### useAudioPlayer
\`\`\`typescript
function useAudioPlayer(text: string, voiceId: string): AudioPlayerState
\`\`\`
Manages text-to-speech playback.

## Usage Examples

\`\`\`typescript
// Dark Mode
const [isDark, setIsDark] = useDarkMode();

// Local Storage
const [favorites, setFavorites] = useLocalStorage('favorites', []);

// Infinite Scroll
useInfiniteScroll({
  onLoadMore: loadMoreQuotes,
  isLoading: loading,
  hasMore: hasMoreQuotes
});
\`\`\`