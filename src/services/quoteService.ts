import type { Quote } from '../types/Quote';
import { QuoteProvider } from '../providers/QuoteProvider';
import { logger, LogLevel } from './logService';

const quoteProvider = new QuoteProvider();

export async function fetchQuotes(count: number = 5): Promise<Quote[]> {
  logger.log(LogLevel.INFO, 'QuoteService', `Fetching ${count} quotes`);

  try {
    const startTime = performance.now();
    const quotes = await quoteProvider.fetchItems(count);
    const duration = Math.round(performance.now() - startTime);
    
    if (!Array.isArray(quotes) || quotes.length === 0) {
      logger.log(LogLevel.ERROR, 'QuoteService', 'No quotes received', { quotes });
      throw new Error('No quotes received');
    }

    logger.log(LogLevel.INFO, 'QuoteService', 'Successfully fetched quotes', {
      count: quotes.length,
      duration: `${duration}ms`,
      firstQuote: quotes[0]
    });

    return quotes;
  } catch (error) {
    logger.log(LogLevel.ERROR, 'QuoteService', 'Failed to fetch quotes', {
      error: error instanceof Error ? error.message : 'Unknown error',
      count
    });
    throw error;
  }
}