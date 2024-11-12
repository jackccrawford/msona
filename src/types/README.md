# Types Documentation

This directory contains TypeScript type definitions for the application.

## Core Types

### Quote
\`\`\`typescript
interface Quote {
  id: string;        // Unique identifier
  title: string;     // Category or theme
  content: string;   // The quote text
  author: string;    // Quote author
}
\`\`\`

### Theme
\`\`\`typescript
interface Theme {
  id: string;        // Theme identifier
  name: string;      // Display name
  background: string; // Background gradient classes
  accent: string;    // Primary color class
  hover: string;     // Hover state class
  text: string;      // Text color class
  gradient: {        // Gradient configuration
    from: string;
    via: string;
    to: string;
  };
}
\`\`\`

### AI Types
\`\`\`typescript
type AIProvider = 'openai' | 'grok';

interface AIResponse {
  text: string;      // Generated text
  error?: string;    // Optional error message
}
\`\`\`

## Provider Types

### DataProvider
Generic interface for data providers:
\`\`\`typescript
interface DataProvider<T extends DataItem> {
  fetchItems(count?: number): Promise<T[]>;
  searchItems?(query: string): Promise<T[]>;
  getItem?(id: string): Promise<T>;
  transformResponse(data: unknown): T[];
}
\`\`\`

## Error Types

Custom error classes for better error handling:
\`\`\`typescript
class TransformationError extends Error
class APIError extends Error
class AudioError extends Error
class StorageError extends Error
\`\`\`

## Configuration Types

Types for various configuration objects:
\`\`\`typescript
interface PaginationConfig
interface AIConfig
interface AppConfig
\`\`\`