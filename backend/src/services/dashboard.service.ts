import prisma from '@/lib/prisma';
import {
  Budget,
  BudgetRule,
  DashboardSummary,
  ExpensesDistribution,
} from '@/types';
import { ExpenseCategory, Transaction } from '@prisma/client';

const calculateGoals = (
  needsGoal: number,
  wantsGoal: number,
  savingsGoal: number
) => ({
  needs: (totalIncome: number) => totalIncome * (needsGoal / 100),
  wants: (totalIncome: number) => totalIncome * (wantsGoal / 100),
  savings: (totalIncome: number) => totalIncome * (savingsGoal / 100),
});

const getTotal = (transactions: Transaction[]) => {
  return transactions.reduce((acc, curr) => acc + curr.amount.toNumber(), 0);
};

const getIncomes = async (userId: string, from: Date, to: Date) => {
  return await prisma.transaction.findMany({
    where: {
      userId,
      type: 'INCOME',
      date: {
        gte: from,
        lte: to,
      },
    },
  });
};

const getExpenses = async (userId: string, from: Date, to: Date) => {
  return await prisma.transaction.findMany({
    where: {
      userId,
      type: 'EXPENSE',
      date: {
        gte: from,
        lte: to,
      },
    },
  });
};

const filterNeeds = (expenses: Transaction[]) => {
  return filterExpensesByCategory(expenses, 'NEEDS');
};

const filterWants = (expenses: Transaction[]) => {
  return filterExpensesByCategory(expenses, 'WANTS');
};

const filterSavings = (expenses: Transaction[]) => {
  return filterExpensesByCategory(expenses, 'SAVINGS');
};

const filterExpensesByCategory = (
  expenses: Transaction[],
  category: ExpenseCategory
) => {
  return expenses.filter(expense => expense.category === category);
};

export const getSummary = async (
  userId: string,
  from: Date,
  to: Date
): Promise<DashboardSummary> => {
  const incomes = await getIncomes(userId, from, to);

  const expenses = await getExpenses(userId, from, to);

  const totalIncome = getTotal(incomes);
  const totalExpenses = getTotal(expenses);

  return {
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses,
  };
};

export const getExpensesDistribution = async (
  userId: string,
  from: Date,
  to: Date
): Promise<ExpensesDistribution> => {
  const expenses = await getExpenses(userId, from, to);

  const needs = filterNeeds(expenses);
  const wants = filterWants(expenses);
  const savings = filterSavings(expenses);

  return {
    needs: getTotal(needs),
    wants: getTotal(wants),
    savings: getTotal(savings),
  };
};

export const getBudget = async (
  userId: string,
  from: Date,
  to: Date,
  rule: BudgetRule
): Promise<Budget> => {
  const incomes = await getIncomes(userId, from, to);
  const expenses = await getExpenses(userId, from, to);

  const totalIncome = getTotal(incomes);

  const needs = filterNeeds(expenses);
  const wants = filterWants(expenses);
  const savings = filterSavings(expenses);

  const totalNeeds = getTotal(needs);
  const totalWants = getTotal(wants);
  const totalSavings = getTotal(savings);

  const { needs: needsRule, wants: wantsRule, savings: savingsRule } = rule;

  const goals = calculateGoals(needsRule, wantsRule, savingsRule);

  return {
    needs: {
      goal: goals.needs(totalIncome),
      spent: totalNeeds,
      remaining: goals.savings(totalIncome) - totalNeeds,
    },
    wants: {
      goal: goals.wants(totalIncome),
      spent: totalWants,
      remaining: goals.wants(totalIncome) - totalWants,
    },
    savings: {
      goal: goals.savings(totalIncome),
      spent: totalSavings,
      remaining: goals.savings(totalIncome) - totalSavings,
    },
  };
};
