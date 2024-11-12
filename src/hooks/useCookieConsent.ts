import { useState, useEffect } from 'react';

/**
 * Hook to manage cookie consent state
 * Only stores preference if user accepts cookies
 */
export function useCookieConsent() {
  const [cookieConsent, setCookieConsent] = useState<boolean | null>(null);

  useEffect(() => {
    // Only check localStorage if it exists and is available
    try {
      const stored = localStorage.getItem('cookieConsent');
      if (stored === 'true') {
        setCookieConsent(true);
      } else {
        setCookieConsent(null);
      }
    } catch {
      setCookieConsent(null);
    }
  }, []);

  const acceptCookies = () => {
    setCookieConsent(true);
    try {
      localStorage.setItem('cookieConsent', 'true');
    } catch (error) {
      console.error('Failed to save cookie consent:', error);
    }
  };

  const declineCookies = () => {
    setCookieConsent(false);
    // Don't store the decline preference
    // Just close the banner for this session
  };

  return {
    cookieConsent,
    acceptCookies,
    declineCookies
  };
}