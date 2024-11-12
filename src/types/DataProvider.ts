/**
 * Represents a generic data item with required base properties
 */
export interface DataItem {
  /** Unique identifier for the item */
  id: string;
  /** Title or heading of the item */
  title: string;
  /** Main content or body text */
  content: string;
  /** Author or creator of the item */
  author: string;
  /** Optional categorization tags */
  tags?: string[];
  /** Additional metadata as key-value pairs */
  metadata?: Record<string, unknown>;
}

/**
 * Generic data provider interface for fetching and managing items
 * @template T - Type of items managed by the provider, must extend DataItem
 */
export interface DataProvider<T extends DataItem = DataItem> {
  /** Fetch a specified number of items */
  fetchItems(count?: number): Promise<T[]>;
  /** Optional method to search items by query */
  searchItems?(query: string): Promise<T[]>;
  /** Optional method to get a single item by ID */
  getItem?(id: string): Promise<T>;
  /** Transform raw data into the expected item format */
  transformResponse(data: unknown): T[];
}

/**
 * Configuration options for data providers
 */
export interface DataProviderConfig {
  /** Optional API key for authentication */
  apiKey?: string;
  /** Base URL for API requests */
  baseUrl?: string;
  /** Additional provider-specific options */
  options?: Record<string, unknown>;
}