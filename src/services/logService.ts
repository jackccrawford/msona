import { appConfig } from '../config/app';

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR'
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  category: string;
  message: string;
  data?: unknown;
}

class LogService {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;
  private listeners: ((entry: LogEntry) => void)[] = [];

  log(level: LogLevel, category: string, message: string, data?: unknown) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      data
    };

    this.logs.unshift(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }

    // Notify listeners
    this.listeners.forEach(listener => listener(entry));

    // Always console log errors
    if (level === LogLevel.ERROR) {
      console.error(`[${category}] ${message}`, data);
    }

    // Debug logging in development
    if (import.meta.env.DEV) {
      const color = this.getLevelColor(level);
      console.log(
        `%c[${level}] ${category}: ${message}`,
        `color: ${color}`,
        data
      );
    }
  }

  addListener(listener: (entry: LogEntry) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private getLevelColor(level: LogLevel): string {
    switch (level) {
      case LogLevel.DEBUG: return '#6b7280';
      case LogLevel.INFO: return '#2563eb';
      case LogLevel.WARN: return '#d97706';
      case LogLevel.ERROR: return '#dc2626';
    }
  }

  getRecentLogs(count = 50): LogEntry[] {
    return this.logs.slice(0, count);
  }

  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  getLogsByCategory(category: string): LogEntry[] {
    return this.logs.filter(log => log.category === category);
  }

  clearLogs() {
    this.logs = [];
    this.listeners.forEach(listener => 
      listener({
        timestamp: new Date().toISOString(),
        level: LogLevel.INFO,
        category: 'LogService',
        message: 'Logs cleared'
      })
    );
  }
}

export const logger = new LogService();