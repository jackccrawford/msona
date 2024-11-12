# Data Providers Documentation

## Overview
Providers implement the DataProvider interface for different data sources.

## Base Provider
```typescript
abstract class BaseProvider<T extends DataItem> {
  protected config: DataProviderConfig;
  protected baseUrl: string;
  
  abstract fetchItems(count?: number): Promise<T[]>;
  abstract transformResponse(data: unknown): T[];
  
  protected async fetchWithRetry(
    url: string, 
    options?: RequestInit,
    retries?: number
  ): Promise<Response>;
}
```

## Quote Provider
Implements quote fetching with fallback support.

### Features
- Multiple API endpoints
- CORS proxy support
- Local fallback data
- Automatic retries
- Response transformation
- Error handling

### Usage
```typescript
const provider = new QuoteProvider({
  baseUrl: 'https://api.quotable.io'
});

const quotes = await provider.fetchItems(10);
```

## Creating New Providers

1. Extend BaseProvider
2. Implement required methods
3. Add configuration
4. Handle errors
5. Add tests

Example:
```typescript
class CustomProvider extends BaseProvider<CustomItem> {
  async fetchItems(count = 10): Promise<CustomItem[]> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/items?limit=${count}`
    );
    const data = await response.json();
    return this.transformResponse(data);
  }

  transformResponse(data: unknown): CustomItem[] {
    // Transform response to CustomItem[]
  }
}
```