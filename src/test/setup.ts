import '@testing-library/jest-dom';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { HttpResponse, http } from 'msw';

// Mock APIs
const handlers = [
  http.get('https://api.quotable.io/quotes/random', () => {
    return HttpResponse.json([{
      _id: 'test-1',
      content: 'Test quote content',
      author: 'Test Author',
      tags: ['wisdom']
    }])
  }),

  http.post('https://api.x.ai/v1/chat/completions', () => {
    return HttpResponse.json({
      choices: [{
        message: {
          content: 'Transformed test quote'
        }
      }]
    })
  }),

  http.post('https://api.elevenlabs.io/v1/text-to-speech/*', () => {
    return new HttpResponse(
      new Blob(['audio-data'], { type: 'audio/mpeg' }),
      { status: 200 }
    )
  })
];

const server = setupServer(...handlers);

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Clean up after each test
afterEach(() => {
  cleanup();
  server.resetHandlers();
});

// Clean up after all tests
afterAll(() => server.close());