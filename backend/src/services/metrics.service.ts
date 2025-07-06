import prisma from '@/lib/prisma';
import { SummaryResponse } from '@/types';
import { Transaction } from '@prisma/client';

const calculateTotal = (transactions: Transaction[]) => {
  return transactions.reduce((acc, curr) => acc + curr.amount.toNumber(), 0);
};

const getTotalIncome = async (userId: string, from: Date, to: Date) => {
  const incomes = await prisma.transaction.findMany({
    where: {
      userId,
      type: 'INCOME',
      date: {
        gte: from,
        lte: to,
      },
    },
  });

  return calculateTotal(incomes);
};

const getTotalExpense = async (userId: string, from: Date, to: Date) => {
  const expenses = await prisma.transaction.findMany({
    where: {
      userId,
      type: 'EXPENSE',
      date: {
        gte: from,
        lte: to,
      },
    },
  });

  return calculateTotal(expenses);
};

export const getSummary = async (
  userId: string,
  from: Date,
  to: Date
): Promise<SummaryResponse> => {
  const totalIncome = await getTotalIncome(userId, from, to);
  const totalExpense = await getTotalExpense(userId, from, to);
  return {
    totalIncome,
    totalExpenses: totalExpense,
    balance: totalIncome - totalExpense,
  };
};
