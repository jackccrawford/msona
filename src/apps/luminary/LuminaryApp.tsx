import React, { useState, useRef, useEffect } from 'react';
import { Header } from '../../components/Header';
import { QuoteCard } from '../../components/QuoteCard';
import { LoadingQuotes } from '../../components/LoadingQuotes';
import { Footer } from '../../components/Footer';
import { CookieConsent } from '../../components/CookieConsent';
import { FeedbackButton } from '../../components/FeedbackButton';
import { BetaBadge } from '../../components/BetaBadge';
import { LogViewer } from '../../components/LogViewer';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useCookieConsent } from '../../hooks/useCookieConsent';
import { useDarkMode } from '../../hooks/useDarkMode';
import { useSwipeGestures } from '../../hooks/useSwipeGestures';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { fetchQuotes } from '../../services/quoteService';
import { themes } from '../../types/Theme';
import { elevenLabsConfig } from '../../config/elevenlabs';
import { logger, LogLevel } from '../../services/logService';
import type { Quote } from '../../types/Quote';
import type { Theme } from '../../types/Theme';
import type { AppMode } from '../../config/app';

interface LuminaryAppProps {
  onAppChange: (app: AppMode) => void;
}

export function LuminaryApp({ onAppChange }: LuminaryAppProps) {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [favoriteQuotes, setFavoriteQuotes] = useLocalStorage<Quote[]>('favorites', []);
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(elevenLabsConfig.defaultVoiceId);
  const [currentTheme, setCurrentTheme] = useState(themes[0]);
  const [isDark, setIsDark] = useDarkMode();
  const { cookieConsent, acceptCookies, declineCookies } = useCookieConsent();
  const containerRef = useRef<HTMLDivElement>(null);
  const [transformedQuotes, setTransformedQuotes] = useState<Record<string, string>>({});

  const handleRefresh = async () => {
    if (loading || showFavorites) return;
    
    logger.log(LogLevel.INFO, 'LuminaryApp', 'Refreshing quotes');
    setLoading(true);
    setError(null);
    
    try {
      const newQuotes = await fetchQuotes(10);
      setQuotes(newQuotes);
      logger.log(LogLevel.INFO, 'LuminaryApp', 'Successfully refreshed quotes', {
        count: newQuotes.length
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch quotes';
      logger.log(LogLevel.ERROR, 'LuminaryApp', 'Failed to refresh quotes', { error: message });
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleTransformSuccess = (quoteId: string, text: string) => {
    setTransformedQuotes(prev => ({
      ...prev,
      [quoteId]: text
    }));
  };

  const toggleFavorite = (quoteId: string) => {
    const quote = quotes.find(q => q.id === quoteId);
    if (!quote) return;

    setFavoriteQuotes(prev => {
      const isFavorite = prev.some(q => q.id === quoteId);
      if (isFavorite) {
        return prev.filter(q => q.id !== quoteId);
      } else {
        return [...prev, quote];
      }
    });
  };

  // Load initial quotes
  useEffect(() => {
    if (quotes.length === 0 && !loading && !error) {
      handleRefresh();
    }
  }, []);

  useSwipeGestures(containerRef, {
    onSwipeLeft: handleRefresh,
    onSwipeRight: () => window.scrollTo({ top: 0, behavior: 'smooth' })
  });

  useInfiniteScroll({
    onLoadMore: handleRefresh,
    isLoading: loading,
    hasMore: !showFavorites
  });

  return (
    <div 
      ref={containerRef}
      className={`min-h-screen bg-gradient-to-br ${currentTheme.background}`}
    >
      <Header
        onRefresh={handleRefresh}
        isLoading={loading}
        quoteCount={quotes.length}
        favoriteCount={favoriteQuotes.length}
        showFavorites={showFavorites}
        onToggleFavorites={() => setShowFavorites(!showFavorites)}
        selectedVoice={selectedVoice}
        onVoiceChange={setSelectedVoice}
        currentTheme={currentTheme}
        onThemeChange={setCurrentTheme}
        isDark={isDark}
        onDarkModeToggle={() => setIsDark(!isDark)}
        favoriteQuotes={favoriteQuotes}
        currentApp="luminary"
        onAppChange={onAppChange}
      />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {showFavorites ? 'Your Favorites' : 'Discover Wisdom'}
          </h1>
          <BetaBadge theme={currentTheme} isDark={isDark} />
        </div>

        <div className="space-y-6">
          {error && (
            <div className={`text-center py-12 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
              {error}
            </div>
          )}

          {loading && quotes.length === 0 && <LoadingQuotes />}

          {!error && (showFavorites ? favoriteQuotes : quotes).map((quote, index) => (
            <QuoteCard
              key={`${quote.id}-${index}`}
              quote={quote}
              isLiked={favoriteQuotes.some(q => q.id === quote.id)}
              onToggleLike={toggleFavorite}
              isNew={!showFavorites && index === 0 && quotes.length > 1}
              selectedVoice={selectedVoice}
              theme={currentTheme}
              isDark={isDark}
              transformedQuotes={transformedQuotes}
              onTransformSuccess={handleTransformSuccess}
            />
          ))}

          {!loading && !error && showFavorites && favoriteQuotes.length === 0 && (
            <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              No favorite quotes yet. Like some quotes to see them here!
            </div>
          )}
        </div>
      </main>

      <Footer 
        theme={currentTheme}
        isDark={isDark}
      />

      {cookieConsent === null && (
        <CookieConsent
          onAccept={acceptCookies}
          onDecline={declineCookies}
          theme={currentTheme}
          isDark={isDark}
        />
      )}

      <FeedbackButton
        theme={currentTheme}
        isDark={isDark}
      />

      <LogViewer
        theme={currentTheme}
        isDark={isDark}
      />
    </div>
  );
}