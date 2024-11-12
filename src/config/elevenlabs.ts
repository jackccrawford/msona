export const elevenLabsConfig = {
  apiKey: import.meta.env.VITE_ELEVENLABS_API_KEY || '',
  defaultVoiceId: 'pNInz6obpgDQGcFmaJgB',
  apiUrl: 'https://api.elevenlabs.io/v1',
  voices: [
    { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam', description: 'Deep and well-rounded male voice' },
    { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel', description: 'Calm and professional female voice' },
    { id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi', description: 'Clear and energetic female voice' },
    { id: 'yoZ06aMxZJJ28mfd3POQ', name: 'Sam', description: 'Reliable and trustworthy male voice' },
    { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Elli', description: 'Gentle and friendly female voice' },
    { id: 'MF3mGyEYCl7XYWbV9V6O', name: 'Josh', description: 'Confident and engaging male voice' }
  ]
};