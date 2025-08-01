export * from './auth.types';
export * from './dashboard.types';
export * from './transaction.types';
export type PaginationResponse<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
};
