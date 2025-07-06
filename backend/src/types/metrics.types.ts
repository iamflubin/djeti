import z from 'zod';

export type SummaryResponse = {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
};

export const DATE_QUERY_SCHEMA = z.object({
  startDate: z.string().date(),
  endDate: z.string().date(),
});
