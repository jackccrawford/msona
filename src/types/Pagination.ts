export interface PaginationConfig {
  itemsPerPage: number;
  currentPage: number;
  totalItems: number;
}

export const PAGE_SIZE_OPTIONS = [10, 25, 50] as const;
export type PageSize = typeof PAGE_SIZE_OPTIONS[number];