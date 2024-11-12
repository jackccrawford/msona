export type PaginationPosition = 'top' | 'bottom' | 'both' | 'none';

export interface PaginationSettings {
  enabled: boolean;
  defaultItemsPerPage: number;
  position: PaginationPosition;
  showItemsPerPage: boolean;
}

export const paginationConfig: PaginationSettings = {
  enabled: true,
  defaultItemsPerPage: 10,
  position: 'bottom',
  showItemsPerPage: true
};