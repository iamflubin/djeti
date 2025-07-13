import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@/utils';
import { z } from 'zod';

export const TRANSACTION_QUERY_SCHEMA = z.object({
  page: z
    .string()
    .default(DEFAULT_PAGE)
    .transform(val => parseInt(val, 10)),
  size: z
    .string()
    .default(DEFAULT_PAGE_SIZE)
    .transform(val => parseInt(val, 10)),
  from: z
    .string()
    .date()
    .optional()
    .transform(val => (val ? new Date(val) : undefined)),
  to: z
    .string()
    .date()
    .optional()
    .transform(val => (val ? new Date(val) : undefined)),
  type: z.enum(['INCOME', 'EXPENSE']).optional(),
});

export const CREATE_TRANSACTION_SCHEMA = z.object({
  title: z.string().nonempty(),
  description: z.string().optional(),
  amount: z.number().nonnegative(),
  type: z.enum(['INCOME', 'EXPENSE']),
  date: z
    .string()
    .date()
    .transform(val => new Date(val)),
  category: z.enum(['NEEDS', 'WANTS', 'SAVINGS']).optional(),
});

export type TransactionRequest = z.infer<typeof CREATE_TRANSACTION_SCHEMA>;

export const UPDATE_TRANSACTION_SCHEMA = z.object({
  title: z.string().nonempty(),
  description: z.string().optional(),
  amount: z.number().nonnegative(),
  date: z
    .string()
    .date()
    .transform(val => new Date(val)),
  category: z.enum(['NEEDS', 'WANTS', 'SAVINGS']).optional(),
});

export type UpdateTransactionRequest = z.infer<
  typeof UPDATE_TRANSACTION_SCHEMA
>;

export type TransactionType = 'INCOME' | 'EXPENSE';

export type ExpenseCategory = 'NEEDS' | 'WANTS' | 'SAVINGS';

export type TransactionResponse = {
  id: string;
  title: string;
  description: string | null;
  amount: number;
  type: TransactionType;
  date: Date;
  category: ExpenseCategory | null;
};
