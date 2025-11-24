export type TransactionType = 'INCOME' | 'EXPENSE';

export type ExpenseCategory = 'NEEDS' | 'WANTS' | 'SAVINGS';

export interface CreateTransactionRequest {
  title: string;
  amount: number;
  date: string;
  type: TransactionType;
  category?: ExpenseCategory;
}

export interface UpdateTransactionRequest {
  title: string;
  amount: number;
  date: string;
  category?: ExpenseCategory;
}

export interface TransactionResponse {
  id: string;
  title: string;
  amount: number;
  date: string;
  description: string | null;
  type: TransactionType;
  category: ExpenseCategory | null;
}

export interface PaginatedResponse<T> {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  content: T[];
}

export interface QueryParams {
  page: number;
  size: number;
  type: TransactionType;
  from: string;
  to: string;
}
