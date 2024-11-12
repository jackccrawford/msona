# Testing Guide

## Overview
mVara Luminary uses Vitest and React Testing Library for testing.

## Test Structure

### Unit Tests
```typescript
describe('Component', () => {
  it('renders correctly', () => {
    render(<Component />);
    expect(screen.getByText('...')).toBeInTheDocument();
  });
});
```

### Integration Tests
```typescript
describe('Feature', () => {
  it('works end-to-end', async () => {
    const { user } = render(<Feature />);
    await user.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(screen.getByText('Result')).toBeInTheDocument();
    });
  });
});
```

## Test Types

1. Component Tests
   - Rendering
   - User interactions
   - State changes
   - Props validation
   - Error states

2. Hook Tests
   - Initial state
   - State updates
   - Side effects
   - Cleanup

3. Service Tests
   - API calls
   - Error handling
   - Data transformation
   - Retry logic

4. Integration Tests
   - Feature workflows
   - Component interaction
   - Data flow
   - Error scenarios

## Best Practices

1. Test Setup
   - Use `beforeEach` for common setup
   - Clean up after tests
   - Mock external dependencies
   - Use test IDs sparingly

2. Writing Tests
   - Test behavior, not implementation
   - Use meaningful assertions
   - Cover edge cases
   - Test accessibility
   - Keep tests focused

3. Mocking
   - Mock API calls
   - Simulate user events
   - Provide test data
   - Mock browser APIs

4. Running Tests
   - Run before commits
   - Check coverage
   - Fix failing tests
   - Update snapshots

## Commands
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch

# Run UI tests
npm run test:ui
```

## Coverage Goals
- Components: 90%
- Hooks: 95%
- Services: 95%
- Utils: 100%

## Example Test
```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QuoteCard } from '../components/QuoteCard';

describe('QuoteCard', () => {
  const mockQuote = {
    id: '1',
    title: 'Test',
    content: 'Test quote',
    author: 'Author'
  };

  it('handles like interaction', async () => {
    const onLike = vi.fn();
    const { user } = render(
      <QuoteCard quote={mockQuote} onLike={onLike} />
    );

    await user.click(screen.getByRole('button', { name: /like/i }));
    expect(onLike).toHaveBeenCalledWith(mockQuote.id);
  });
});
```