import React from 'react';
import { Terminal } from 'lucide-react';

export interface LogEntry {
  timestamp: string;
  type: 'request' | 'response' | 'error';
  message: string;
  details?: unknown;
}

interface ApiLogProps {
  logs: LogEntry[];
}

export function ApiLog({ logs }: ApiLogProps) {
  if (logs.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-gray-900 text-gray-100 p-4 rounded-lg shadow-lg max-h-[300px] overflow-y-auto">
      <div className="flex items-center gap-2 mb-2">
        <Terminal className="w-5 h-5" />
        <h3 className="font-mono font-bold">API Log</h3>
      </div>
      <div className="space-y-2 font-mono text-sm">
        {logs.map((log, index) => (
          <div
            key={index}
            className={`p-2 rounded ${
              log.type === 'error'
                ? 'bg-red-900/50'
                : log.type === 'response'
                ? 'bg-green-900/50'
                : 'bg-gray-800/50'
            }`}
          >
            <div className="flex gap-2">
              <span className="text-gray-400">{log.timestamp}</span>
              <span className="text-gray-300">[{log.type.toUpperCase()}]</span>
              <span>{log.message}</span>
            </div>
            {log.details && (
              <pre className="mt-1 text-xs overflow-x-auto">
                {JSON.stringify(log.details, null, 2)}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}