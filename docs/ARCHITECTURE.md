# mVara Suite Architecture

## Overview
The mVara Suite consists of two main applications - Luminary (quote discovery) and mSona (music discovery), following a modular, component-based architecture with dynamic app switching.

## Directory Structure
```
src/
├── apps/              # Application-specific code
│   ├── luminary/     # Quote discovery app
│   └── msona/        # Music discovery app
├── components/        # Shared React components
├── config/           # Configuration files
├── hooks/            # Custom React hooks
├── providers/        # Data providers
├── services/         # Business logic and API calls
├── types/            # TypeScript definitions
└── utils/            # Helper functions
```

## Key Concepts

### API Integration
- Smart rate limiting with exponential backoff
- Token management and refresh
- Request retry logic
- Error recovery
- Lazy loading of details
- Direct Spotify track linking
- Audio preview handling

### State Management
- React hooks for local state
- Context for shared state
- Lazy loading patterns
- Error boundaries
- Audio playback state

### Performance Optimization
- On-demand data loading
- Smart API request handling
- Rate limit management
- Mobile optimization
- Audio buffering
- Image optimization

### Error Handling
- Comprehensive error types
- Retry logic
- Rate limit handling
- User feedback
- Logging system
- Playback error recovery

### Mobile Experience
- Touch-friendly interactions
- Responsive layouts
- Performance optimization
- Offline support
- Direct action buttons
- Vertical controls

## Data Flow

### API Requests
```
Component
  → Service Layer (spotifyService)
    → Rate Limit Check
    → Token Management
    → Request with Retry
    → Error Handling
  ← Processed Response
```

### Feature Loading
```
MusicCard
  → Expand Event
  → Load Features Request
    → Rate Limit Check
    → API Request
    → Error Handling
  ← Update UI
```

### Error Recovery
```
API Request
  → Rate Limit/Error
    → Exponential Backoff
    → Retry Logic
    → Token Refresh
  → Success/Fail
```

## Components

### MusicCard
- Lazy loading of features
- Expandable details
- Touch-friendly controls
- Error handling
- Direct Spotify access
- Audio preview
- Feature visualization

### MusicFeed
- Search functionality
- Result management
- Feature loading
- Error boundaries
- Track filtering
- Audio context

### Shared Components
- Error boundaries
- Loading states
- Toast notifications
- Modal dialogs
- Audio controls

## Services

### spotifyService
- Token management
- Rate limiting
- Request retry
- Error handling
- Track analysis
- Audio preview

### logService
- Error logging
- Debug information
- Performance metrics
- User actions
- Playback events

## Testing Strategy

### Unit Tests
- Component rendering
- Service functions
- Hook behavior
- Error handling
- Audio playback

### Integration Tests
- API interactions
- Error scenarios
- Rate limiting
- Token refresh
- Track playback

### E2E Tests
- User flows
- Error recovery
- Mobile interactions
- Performance
- Audio controls

## Performance Considerations

### API Usage
- Lazy loading of details
- Rate limit management
- Request batching
- Cache management
- Audio buffering

### Mobile Optimization
- Touch interactions
- Network handling
- Error recovery
- Offline support
- Direct actions

### Error Management
- Graceful degradation
- User feedback
- Recovery strategies
- Logging
- Playback fallbacks

## Future Improvements

### Planned Features
- Offline mode
- Request caching
- Performance monitoring
- Analytics integration
- Enhanced audio features

### Optimizations
- Request batching
- Cache strategies
- Bundle optimization
- Mobile enhancements
- Audio streaming