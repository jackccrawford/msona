import { describe, it, expect, vi } from 'vitest';
import { fetchQuotes } from '../quoteService';

describe('quoteService', () => {
  it('fetches quotes successfully', async () => {
    const quotes = await fetchQuotes(1);
    
    expect(quotes).toHaveLength(1);
    expect(quotes[0]).toMatchObject({
      id: expect.any(String),
      title: expect.any(String),
      content: expect.any(String),
      author: expect.any(String)
    });
  });

  it('returns fallback quotes when API fails', async () => {
    // Override fetch to simulate failure
    const originalFetch = global.fetch;
    global.fetch = vi.fn().mockRejectedValue(new Error('API Error'));

    const quotes = await fetchQuotes(1);
    
    expect(quotes).toHaveLength(1);
    expect(quotes[0]).toMatchObject({
      id: expect.any(String),
      title: expect.any(String),
      content: expect.any(String),
      author: expect.any(String)
    });

    // Restore fetch
    global.fetch = originalFetch;
  });
});