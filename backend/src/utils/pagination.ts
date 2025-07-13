import { AppError } from '@/errors/app-error.error';

export const DEFAULT_PAGE = '0';
export const DEFAULT_PAGE_SIZE = '10';
export const MAX_PAGE_SIZE = 30;

export const validatePageAndSize = (page: number, size: number) => {
  if (page < 0) {
    throw new AppError('Invalid page number', 400);
  }

  if (size < 0) {
    throw new AppError('Invalid page size', 400);
  }

  if (size > MAX_PAGE_SIZE) {
    throw new AppError('Page size too large', 400);
  }
};
