import type { DataProvider, DataItem, DataProviderConfig } from '../types/DataProvider';

export abstract class BaseProvider<T extends DataItem> implements DataProvider<T> {
  protected config: DataProviderConfig;
  protected baseUrl: string;

  constructor(config: DataProviderConfig) {
    this.config = config;
    this.baseUrl = config.baseUrl || '';
  }

  abstract fetchItems(count?: number): Promise<T[]>;
  abstract transformResponse(data: unknown): T[];

  protected async fetchWithRetry(
    url: string,
    options: RequestInit = {},
    retries = 3
  ): Promise<Response> {
    let lastError: Error | null = null;

    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache',
            ...(options.headers || {}),
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        if (i === retries - 1) break;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    throw lastError;
  }
}