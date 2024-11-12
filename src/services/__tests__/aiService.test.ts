import { describe, it, expect, vi } from 'vitest';
import { generateAIResponse } from '../aiService';

describe('aiService', () => {
  it('generates AI response successfully', async () => {
    const response = await generateAIResponse('Test prompt');
    
    expect(response).toMatchObject({
      text: expect.any(String)
    });
    expect(response.error).toBeUndefined();
  });

  it('handles API errors gracefully', async () => {
    // Override fetch to simulate failure
    const originalFetch = global.fetch;
    global.fetch = vi.fn().mockRejectedValue(new Error('API Error'));

    const response = await generateAIResponse('Test prompt');
    
    expect(response).toMatchObject({
      text: '',
      error: expect.any(String)
    });

    // Restore fetch
    global.fetch = originalFetch;
  });
});