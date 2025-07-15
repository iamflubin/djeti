export * from './transaction.model';

export interface PaginatedResponse<T> {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  content: T[];
}
