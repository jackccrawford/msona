# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0-beta] - 2024-03-11

### Added
- Improved Spotify API integration
  - Smart rate limiting with exponential backoff
  - Automatic token refresh mechanism
  - Request retry logic with configurable attempts
  - Better error handling and recovery
- Lazy loading for track features
  - Load details on demand when expanding tracks
  - Reduced initial API calls
  - Better mobile performance
- Enhanced error handling
  - Graceful degradation on API limits
  - User-friendly error messages
  - Debug logging improvements

### Changed
- Music card UI improvements
  - Cleaner expand/collapse interaction
  - Better mobile touch targets
  - Improved feature visualization
- API integration refactoring
  - More efficient request handling
  - Better token management
  - Improved error recovery
- Performance optimizations
  - Reduced initial load time
  - Better handling of API rate limits
  - Smoother mobile experience

### Fixed
- Rate limiting issues with Spotify API
- Token expiration handling
- Card expansion interaction
- Mobile layout issues
- API error handling

## [0.1.0-beta] - 2024-03-09

### Added
- Initial beta release
- Luminary: Quote discovery app
  - AI-powered quote transformations
  - Text-to-speech with ElevenLabs
  - Multiple voice options
  - Quote favorites system
  - PDF export functionality
- mSona: Music discovery app
  - Spotify integration
  - Track search and preview
  - Audio visualization
  - Artist details
- Shared Features
  - Dynamic theme system
  - Dark mode support
  - Responsive design
  - Error handling
  - Loading states
  - Analytics tracking
  - User feedback system

### Known Issues
- Audio playback may be delayed on some mobile devices
- Theme changes occasionally require page refresh
- PDF export limited to basic styling