# Deployment Guide

## Prerequisites
- Node.js 18.x or later
- npm 9.x or later
- Git (for version control)
- Netlify account

## Local Development Setup

1. Clone repository:
   ```bash
   git clone <repository-url>
   cd project-name
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment:
   ```bash
   cp .env.example .env
   ```
   Add your API keys to `.env`

4. Start development server:
   ```bash
   npm run dev
   ```

## Netlify Deployment

### First-Time Setup

1. Push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <repository-url>
   git push -u origin main
   ```

2. Connect to Netlify:
   - Log in to Netlify Dashboard
   - Click "New site from Git"
   - Select repository
   - Configure build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
     - Node version: 18.x

3. Environment Variables:
   - Go to Site settings > Environment variables
   - Add all variables from `.env`
   - Save changes

4. Enable Functions:
   - Functions directory is pre-configured
   - No additional setup needed
   - Serverless functions handle API calls

### Continuous Deployment

- Push changes to main branch
- Netlify automatically builds and deploys
- Environment variables persist across deploys
- Functions update automatically

## Security Notes

1. API Keys:
   - Never commit `.env`
   - Use Netlify environment variables
   - Rotate keys periodically
   - Monitor usage

2. Functions:
   - Handle all API calls
   - Include rate limiting
   - Error handling
   - Request validation

3. Monitoring:
   - Check deploy logs
   - Monitor function usage
   - Track error rates
   - Review security alerts