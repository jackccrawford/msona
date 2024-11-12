import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api/transform': {
        target: 'https://api.x.ai/v1/chat/completions',
        changeOrigin: true,
        rewrite: () => '',
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            if (req.body) {
              const { prompt } = JSON.parse(req.body);
              const body = JSON.stringify({
                messages: [{
                  role: 'user',
                  content: prompt
                }],
                model: 'grok-beta',
                temperature: 0
              });
              proxyReq.setHeader('Content-Length', Buffer.byteLength(body));
              proxyReq.setHeader('Authorization', `Bearer ${process.env.GROK_API_KEY}`);
              proxyReq.setHeader('Content-Type', 'application/json');
              proxyReq.write(body);
            }
          });
        },
      },
      '/api/speech': {
        target: 'https://api.elevenlabs.io/v1/text-to-speech',
        changeOrigin: true,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            if (req.body) {
              const { text, voiceId } = JSON.parse(req.body);
              const body = JSON.stringify({
                text,
                model_id: 'eleven_monolingual_v1',
                voice_settings: {
                  stability: 0.5,
                  similarity_boost: 0.75
                }
              });
              proxyReq.setHeader('Content-Length', Buffer.byteLength(body));
              proxyReq.setHeader('xi-api-key', process.env.ELEVENLABS_API_KEY);
              proxyReq.setHeader('Content-Type', 'application/json');
              proxyReq.write(body);
            }
          });
        },
      },
    },
  },
});