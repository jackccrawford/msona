import { appConfig } from './app';

export interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  metadata?: Record<string, unknown>;
}

export interface AnalyticsConfig {
  enabled: boolean;
  anonymizeIp: boolean;
  sessionTimeout: number;
  debug: boolean;
}

export const analyticsConfig: AnalyticsConfig = {
  enabled: import.meta.env.PROD,
  anonymizeIp: true,
  sessionTimeout: 30, // minutes
  debug: import.meta.env.DEV
};

export function trackEvent(event: AnalyticsEvent): void {
  if (!analyticsConfig.enabled) return;

  // Send to your analytics service of choice
  console.log('[Analytics]', event);

  // Example implementation with Google Analytics
  if (typeof window.gtag === 'function') {
    window.gtag('event', event.action, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
      ...event.metadata
    });
  }
}