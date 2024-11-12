import React from 'react';

interface LoadingQuotesProps {
  count?: number;
}

export function LoadingQuotes({ count = 3 }: LoadingQuotesProps) {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, index) => (
        <div 
          key={index} 
          className="bg-white dark:bg-slate-800/90 rounded-lg shadow-md p-6 animate-pulse"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-shimmer"></div>
            <div className="flex gap-2">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-shimmer"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-shimmer"></div>
          </div>
          <div className="mt-4 h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 ml-auto animate-shimmer"></div>
        </div>
      ))}
    </div>
  );
}