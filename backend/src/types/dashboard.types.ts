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
