import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import type { Theme } from '../types/Theme';
import type { PageSize } from '../types/Pagination';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (size: PageSize) => void;
  theme: Theme;
  isDark: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  theme,
  isDark
}: PaginationProps) {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visiblePages = getVisiblePages(currentPage, totalPages);

  function getVisiblePages(current: number, total: number) {
    if (total <= 7) return pageNumbers;
    
    if (current <= 4) {
      return [...pageNumbers.slice(0, 5), -1, total];
    }
    
    if (current >= total - 3) {
      return [1, -1, ...pageNumbers.slice(total - 5)];
    }
    
    return [1, -1, current - 1, current, current + 1, -1, total];
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 mb-4">
      <div className="flex items-center gap-2">
        <label 
          htmlFor="itemsPerPage" 
          className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
        >
          Items per page:
        </label>
        <select
          id="itemsPerPage"
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value) as PageSize)}
          className={`
            rounded-md border-gray-300 dark:border-gray-600 
            bg-white dark:bg-gray-800 
            text-sm font-medium
            ${isDark ? 'text-white' : 'text-gray-900'}
            focus:ring-2 focus:ring-offset-2
            ${isDark ? 'focus:ring-white/20' : `focus:ring-${theme.accent}`}
          `}
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={`
            p-2 rounded-lg transition-all duration-300
            ${isDark 
              ? 'text-gray-400 hover:text-white hover:bg-gray-800 disabled:text-gray-600'
              : `text-gray-500 hover:${theme.accent} hover:bg-gray-100 disabled:text-gray-300`
            }
            disabled:cursor-not-allowed
          `}
          aria-label="First page"
        >
          <ChevronsLeft className="w-5 h-5" />
        </button>
        
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`
            p-2 rounded-lg transition-all duration-300
            ${isDark 
              ? 'text-gray-400 hover:text-white hover:bg-gray-800 disabled:text-gray-600'
              : `text-gray-500 hover:${theme.accent} hover:bg-gray-100 disabled:text-gray-300`
            }
            disabled:cursor-not-allowed
          `}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1">
          {visiblePages.map((pageNum, idx) => (
            pageNum === -1 ? (
              <span 
                key={`ellipsis-${idx}`}
                className={`px-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
              >
                ...
              </span>
            ) : (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`
                  w-8 h-8 rounded-lg text-sm font-medium transition-all duration-300
                  ${pageNum === currentPage
                    ? isDark
                      ? 'bg-white/10 text-white'
                      : `${theme.accent} text-white`
                    : isDark
                      ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                      : `text-gray-600 hover:${theme.accent} hover:bg-gray-100`
                  }
                `}
                aria-label={`Page ${pageNum}`}
                aria-current={pageNum === currentPage ? 'page' : undefined}
              >
                {pageNum}
              </button>
            )
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`
            p-2 rounded-lg transition-all duration-300
            ${isDark 
              ? 'text-gray-400 hover:text-white hover:bg-gray-800 disabled:text-gray-600'
              : `text-gray-500 hover:${theme.accent} hover:bg-gray-100 disabled:text-gray-300`
            }
            disabled:cursor-not-allowed
          `}
          aria-label="Next page"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={`
            p-2 rounded-lg transition-all duration-300
            ${isDark 
              ? 'text-gray-400 hover:text-white hover:bg-gray-800 disabled:text-gray-600'
              : `text-gray-500 hover:${theme.accent} hover:bg-gray-100 disabled:text-gray-300`
            }
            disabled:cursor-not-allowed
          `}
          aria-label="Last page"
        >
          <ChevronsRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}