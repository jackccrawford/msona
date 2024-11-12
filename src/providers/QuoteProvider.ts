import { BaseProvider } from './BaseProvider';
import type { DataProviderConfig } from '../types/DataProvider';
import type { Quote, ApiQuote } from '../types/Quote';
import { QUOTES } from '../data/quotes';
import { logger, LogLevel } from '../services/logService';

export class QuoteProvider extends BaseProvider<Quote> {
  constructor(config: DataProviderConfig = { baseUrl: 'https://api.quotable.io' }) {
    super(config);
  }

  private getQuoteCategory(tags: string[]): string {
    const relevantTags = tags.filter(tag => tag.toLowerCase() !== 'famous quotes');
    
    if (relevantTags.length === 0) {
      const categories = [
        'Reflection', 'Wisdom', 'Life', 'Inspiration',
        'Growth', 'Journey', 'Purpose', 'Understanding'
      ];
      return categories[Math.floor(Math.random() * categories.length)];
    }

    const tag = relevantTags[0];
    return tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase();
  }

  async fetchItems(count = 5): Promise<Quote[]> {
    logger.log(LogLevel.INFO, 'QuoteProvider', `Fetching ${count} quotes`);

    try {
      // Try direct API first
      const response = await this.fetchWithRetry(
        `${this.baseUrl}/quotes/random?limit=${count}`
      );

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }

      const quotes: ApiQuote[] = await response.json();
      
      if (!Array.isArray(quotes) || quotes.length === 0) {
        throw new Error('Invalid API response: no quotes received');
      }

      logger.log(LogLevel.DEBUG, 'QuoteProvider', 'Successfully fetched quotes from API', {
        count: quotes.length,
        firstQuote: quotes[0]
      });

      const transformed = this.transformResponse(quotes);
      return transformed;

    } catch (error) {
      logger.log(LogLevel.WARN, 'QuoteProvider', 'API call failed, using fallback data', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      // Use fallback data
      const shuffled = [...QUOTES].sort(() => Math.random() - 0.5);
      const fallbackQuotes = shuffled.slice(0, count).map(quote => ({
        id: `fallback-${Date.now()}-${Math.random()}`,
        title: quote.title,
        content: quote.text,
        author: quote.author
      }));

      logger.log(LogLevel.INFO, 'QuoteProvider', 'Using fallback quotes', {
        count: fallbackQuotes.length
      });

      return fallbackQuotes;
    }
  }

  transformResponse(data: unknown): Quote[] {
    try {
      if (!Array.isArray(data)) {
        logger.log(LogLevel.ERROR, 'QuoteProvider', 'Invalid response format', { data });
        throw new Error('Invalid response format');
      }

      const transformed = data.map(quote => {
        if ('_id' in quote && 'content' in quote && 'author' in quote) {
          return {
            id: quote._id as string,
            title: this.getQuoteCategory((quote as ApiQuote).tags || []),
            content: quote.content as string,
            author: quote.author as string
          };
        }
        logger.log(LogLevel.ERROR, 'QuoteProvider', 'Invalid quote format', { quote });
        throw new Error('Invalid quote format');
      });

      logger.log(LogLevel.DEBUG, 'QuoteProvider', 'Successfully transformed quotes', {
        count: transformed.length
      });

      return transformed;
    } catch (error) {
      logger.log(LogLevel.ERROR, 'QuoteProvider', 'Failed to transform quotes', {
        error: error instanceof Error ? error.message : 'Unknown error',
        data
      });
      throw error;
    }
  }
}