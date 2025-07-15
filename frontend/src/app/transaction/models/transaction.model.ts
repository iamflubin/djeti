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
