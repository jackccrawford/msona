# 🌟 mVara Suite (Beta)

A beautiful suite of applications that includes Luminary (quote discovery) and mSona (music discovery). Built with modern web technologies and designed for an exceptional user experience.

![Beta Version](https://img.shields.io/badge/version-0.1.0--beta-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![React Version](https://img.shields.io/badge/react-18.3.1-61dafb)
![TypeScript](https://img.shields.io/badge/typescript-5.5.3-blue)
![Test Coverage](https://img.shields.io/badge/coverage-85%25-green)

Live Demo: https://msona.netlify.app

![mSona Dark Mode](public/images/mSona%20with%20details.png)

## 🚀 Features

### 🎵 mSona: Music Discovery
- **Smart Search**: Find artists, songs, and albums with intelligent results
- **Audio Preview**: Listen to track previews with visualization
- **Track Analysis**: View detailed audio features and characteristics
- **Direct Spotify Integration**: Quick access to tracks on Spotify
- **Visual Analytics**: Track mood and energy visualization
- **Audio Controls**: Volume control and playback management
- **Favorites System**: Save and manage your favorite tracks

### 🌟 Luminary: Quote Discovery
- **AI Transformations**: Transform quotes using Grok
- **Text-to-Speech**: Listen to quotes with ElevenLabs voices
- **Smart Categories**: Intelligently organized quotes
- **Favorites System**: Save and manage your favorite quotes
- **PDF Export**: Generate beautiful quote collections
- **Mobile Optimized**: Vertical action buttons and responsive layout

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS
- **Build**: Vite
- **Testing**: Vitest, Testing Library
- **APIs**: 
  - Spotify Web API
  - X.AI (Grok)
  - ElevenLabs
  - Quotable API

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/mvara-suite.git
   ```

2. Install dependencies:
   ```bash
   cd mvara-suite
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

4. Configure API keys:

   a) **Spotify API**
   - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Create a new application
   - Get Client ID and Secret
   - Add redirect URI (e.g., http://localhost:8888/callback)
   - Select Web API scope

   b) **ElevenLabs**
   - Sign up at [ElevenLabs](https://elevenlabs.io)
   - Get API key from your profile

   c) **Grok (X.AI)**
   - Get API key from [X.AI](https://x.ai)
   - Ensure you have access to Grok beta

5. Start development server:
   ```bash
   npm run dev
   ```

## 🚀 Deployment

### Netlify (Recommended)

1. Push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push
   ```

2. Connect to Netlify:
   - Sign up/login to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Select your repository
   - Configure build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
     - Node version: 18.x

3. Set environment variables:
   - Go to Site settings > Environment variables
   - Add all variables from `.env`
   - Deploy triggers automatically

### Security Notes

- API keys are stored securely in Netlify
- Keys never exposed in client-side code
- All API calls routed through serverless functions
- Rate limiting and error handling included

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Music data from [Spotify Web API](https://developer.spotify.com/documentation/web-api)
- Quote data from [Quotable API](https://github.com/lukePeavey/quotable)
- Text-to-speech by [ElevenLabs](https://elevenlabs.io)
- Icons by [Lucide](https://lucide.dev)
- Development environment by [bolt.new](https://bolt.new)

---

<p align="center">Made with ❤️ by the mVara team</p>
