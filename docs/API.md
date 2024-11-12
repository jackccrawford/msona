# API Documentation

## Overview
All API interactions are handled through Netlify Functions for security.

## Endpoints

### Transform Text (Grok)
```typescript
POST /api/transform

// Request
{
  "prompt": string  // Text to transform
}

// Response
{
  "choices": [{
    "message": {
      "content": string,
      "refusal": null | string
    }
  }]
}
```

### Text-to-Speech (ElevenLabs)
```typescript
POST /api/speech

// Request
{
  "text": string,     // Text to synthesize
  "voiceId": string   // ElevenLabs voice ID
}

// Response
Binary audio/mpeg data
```

### Music Search (Spotify)
Direct integration with Spotify Web API:
- Authentication handled client-side
- Preview URLs for audio playback
- Track analysis and features
- Direct links to Spotify

## Error Handling

### Response Codes
- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 429: Rate Limited
- 500: Server Error

### Error Response
```typescript
{
  "error": string  // Error message
}
```

## Rate Limiting
- Exponential backoff
- Maximum retry attempts: 3
- Initial delay: 1 second
- Maximum delay: 16 seconds

## Security
- API keys stored securely
- Request validation
- Error logging
- Usage monitoring