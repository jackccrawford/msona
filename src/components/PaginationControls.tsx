import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import type { Theme } from '../types/Theme';
import type { PageSize } from '../types/Pagination';
import { paginationConfig } from '../config/pagination';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (size: PageSize) => void;
  theme: Theme;
  isDark: boolean;
  position: 'top' | 'bottom';
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  theme,
  isDark,
  position
}: PaginationControlsProps) {
  if (!paginationConfig.enabled || totalPages <= 1) return null;

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  
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

  const visiblePages = getVisiblePages(currentPage, totalPages);

  return (
    <div className={`
      flex flex-col sm:flex-row items-center justify-between gap-4
      ${position === 'top' ? 'mb-8' : 'mt-8'}
    `}>
      {paginationConfig.showItemsPerPage && (
        <div className="flex items-center gap-2">
          <label 
            htmlFor={`itemsPerPage-${position}`}
            className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-800'}`}
          >
            Items per page:
          </label>
          <select
            id={`itemsPerPage-${position}`}
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value) as PageSize)}
            className={`
              rounded-md border border-gray-300 dark:border-gray-600
              ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}
              text-sm font-medium
              py-1 px-2
              focus:ring-2 focus:ring-offset-2
              ${isDark ? 'focus:ring-white/20' : `focus:ring-${theme.accent}/20`}
              cursor-pointer
            `}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={`
            p-2 rounded-lg transition-all duration-300
            ${isDark 
              ? 'text-gray-400 hover:text-white hover:bg-gray-800 disabled:text-gray-600' 
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100 disabled:text-gray-300'
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
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100 disabled:text-gray-300'
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
                      : 'bg-gray-800 text-white'
                    : isDark
                      ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
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
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100 disabled:text-gray-300'
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
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100 disabled:text-gray-300'
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