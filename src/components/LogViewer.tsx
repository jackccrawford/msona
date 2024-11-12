import React, { useState } from 'react';
import { Terminal, ChevronDown, ChevronUp, XCircle } from 'lucide-react';
import { logger, LogLevel, type LogEntry } from '../services/logService';
import type { Theme } from '../types/Theme';

interface LogViewerProps {
  theme: Theme;
  isDark: boolean;
}

export function LogViewer({ theme, isDark }: LogViewerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<LogLevel | 'ALL'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string | 'ALL'>('ALL');

  const logs = logger.getRecentLogs();
  const categories = Array.from(new Set(logs.map(log => log.category)));

  const filteredLogs = logs.filter(log => 
    (selectedLevel === 'ALL' || log.level === selectedLevel) &&
    (selectedCategory === 'ALL' || log.category === selectedCategory)
  );

  const getLevelColor = (level: LogLevel): string => {
    switch (level) {
      case LogLevel.DEBUG: return 'text-gray-400';
      case LogLevel.INFO: return 'text-blue-400';
      case LogLevel.WARN: return 'text-yellow-400';
      case LogLevel.ERROR: return 'text-red-400';
    }
  };

  if (!import.meta.env.DEV) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg
          transition-all duration-300
          ${isDark
            ? 'bg-gray-800 text-white hover:bg-gray-700'
            : 'bg-white text-gray-900 hover:bg-gray-50'
          }
        `}
      >
        <Terminal className="w-5 h-5" />
        <span className="font-medium">Logs</span>
        {isOpen ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronUp className="w-4 h-4" />
        )}
      </button>

      {isOpen && (
        <div className={`
          fixed inset-4 sm:inset-auto sm:right-4 sm:bottom-16 sm:w-[600px] sm:h-[500px]
          bg-white dark:bg-gray-800 rounded-lg shadow-xl
          flex flex-col
          animate-slideUp
        `}>
          <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
            <div className="flex items-center gap-4">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value as LogLevel | 'ALL')}
                className={`
                  rounded-md border-gray-300 dark:border-gray-600
                  ${isDark ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}
                `}
              >
                <option value="ALL">All Levels</option>
                {Object.values(LogLevel).map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`
                  rounded-md border-gray-300 dark:border-gray-600
                  ${isDark ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}
                `}
              >
                <option value="ALL">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className={`
                p-1 rounded-lg transition-colors
                ${isDark 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-auto p-4 font-mono text-sm space-y-2">
            {filteredLogs.map((log, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-start gap-2">
                  <span className="text-gray-400 flex-shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  <span className={`font-medium ${getLevelColor(log.level)}`}>
                    [{log.level}]
                  </span>
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                    {log.category}:
                  </span>
                  <span className={isDark ? 'text-white' : 'text-gray-900'}>
                    {log.message}
                  </span>
                </div>
                {log.data && (
                  <pre className={`
                    text-xs p-2 rounded
                    ${isDark ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-700'}
                  `}>
                    {JSON.stringify(log.data, null, 2)}
                  </pre>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}