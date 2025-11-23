import { z } from 'zod';

export type DashboardSummary = {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
};

export type ExpensesDistribution = {
  needs: number;
  wants: number;
  savings: number;
};

export type BudgetDetails = {
  goal: number;
  spent: number;
  remaining: number;
};

export type Budget = {
  needs: BudgetDetails;
  wants: BudgetDetails;
  savings: BudgetDetails;
};

export const DATE_QUERY_SCHEMA = z.object({
  from: z
    .string()
    .date()
    .transform(val => new Date(val)),
  to: z
    .string()
    .date()
    .transform(val => new Date(val)),
});

export const BUDGET_QUERY_SCHEMA = z.object({
  from: z
    .string()
    .date()
    .transform(val => new Date(val)),

  to: z
    .string()
    .date()
    .transform(val => new Date(val)),

  needs: z
    .string()
    .transform(val => parseFloat(val))
    .refine(num => num >= 0 && num <= 100, {
      message: 'Needs must be between 0 and 100',
    }),

  wants: z
    .string()
    .transform(val => parseFloat(val))
    .refine(num => num >= 0 && num <= 100, {
      message: 'Wants must be between 0 and 100',
    }),

  savings: z
    .string()
    .transform(val => parseFloat(val))
    .refine(num => num >= 0 && num <= 100, {
      message: 'Savings must be between 0 and 100',
    }),
});

export type BudgetRule = {
  needs: number;
  wants: number;
  savings: number;
};
