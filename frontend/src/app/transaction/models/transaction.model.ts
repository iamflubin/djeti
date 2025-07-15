export type TransactionType = 'INCOME' | 'EXPENSE';

export type ExpenseCategory = 'NEEDS' | 'WANTS' | 'SAVINGS';

export interface CreateTransactionRequest {
  title: string;
  amount: number;
  date: string;
  description?: string;
  type: TransactionType;
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

export interface TransactionQueryParams {
  page: number;
  size: number;
  from: Date;
  to: Date;
  type: TransactionType;
}
