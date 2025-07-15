import { AppError } from '@/errors/app-error.error';
import prisma from '@/lib/prisma';
import {
  PaginationResponse,
  TransactionRequest,
  TransactionResponse,
  TransactionType,
  UpdateTransactionRequest,
} from '@/types';
import { validatePageAndSize } from '@/utils';
import { logger } from '@/utils/logger';
import { Transaction } from '@prisma/client';

const toResponse = (transaction: Transaction): TransactionResponse => {
  return {
    id: transaction.id,
    title: transaction.title,
    description: transaction.description,
    amount: transaction.amount.toNumber(),
    type: transaction.type,
    date: transaction.date,
    category: transaction.category,
  };
};

export const createTransaction = async (
  transaction: TransactionRequest,
  userId: string
): Promise<string> => {
  await new Promise(res => setTimeout(res, 20000));

  if (transaction.type === 'EXPENSE' && !transaction.category) {
    throw new AppError('Category is required for expense transactions', 400);
  }
  const savedTransaction = await prisma.transaction.create({
    data: {
      title: transaction.title,
      amount: transaction.amount,
      type: transaction.type,
      date: transaction.date,
      description: transaction.description,
      category: transaction.category,
      userId: userId,
    },
  });

  logger.info('Transaction created:', savedTransaction);

  return savedTransaction.id;
};

export const readTransaction = async (
  id: string,
  userId: string
): Promise<TransactionResponse> => {
  const transaction = await prisma.transaction.findUnique({ where: { id } });
  if (!transaction) {
    throw new AppError('Transaction not found', 404);
  }

  if (transaction.userId !== userId) {
    throw new AppError('Forbidden', 403);
  }

  return toResponse(transaction);
};

export const readAllTransactions = async (
  userId: string,
  page: number,
  size: number,
  from?: Date,
  to?: Date,
  type?: TransactionType
): Promise<PaginationResponse<TransactionResponse>> => {
  validatePageAndSize(page, size);
  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      ...(from && { date: { gte: from } }),
      ...(to && { date: { lte: to } }),
      ...(type && { type }),
    },
    orderBy: { date: 'desc' },
    skip: page * size,
    take: size,
  });

  const totalElements = await prisma.transaction.count({
    where: {
      userId,
      ...(from && { date: { gte: from } }),
      ...(to && { date: { lte: to } }),
      ...(type && { type }),
    },
  });

  return {
    content: transactions.map(toResponse),
    page,
    size,
    totalElements,
    totalPages: Math.ceil(totalElements / size),
    last: transactions.length < size,
  };
};

export const updateTransaction = async (
  id: string,
  userId: string,
  transaction: UpdateTransactionRequest
): Promise<void> => {
  const currentTransaction = await prisma.transaction.findUnique({
    where: { id },
  });

  if (!currentTransaction) {
    throw new AppError('Transaction not found', 404);
  }

  if (currentTransaction.userId !== userId) {
    throw new AppError('Forbidden', 403);
  }

  if (currentTransaction.type === 'EXPENSE' && !transaction.category) {
    throw new AppError('Category is required for expense transactions', 400);
  }

  await prisma.transaction.update({
    where: { id },
    data: {
      title: transaction.title,
      amount: transaction.amount,
      date: transaction.date,
      description: transaction.description,
      category: transaction.category,
    },
  });

  logger.info('Transaction updated:', id);
};

export const deleteTransaction = async (
  id: string,
  userId: string
): Promise<void> => {
  const transaction = await prisma.transaction.findUnique({ where: { id } });
  if (!transaction) {
    throw new AppError('Transaction not found', 404);
  }

  if (transaction.userId !== userId) {
    throw new AppError('Forbidden', 403);
  }

  await prisma.transaction.delete({ where: { id } });
  logger.info('Transaction deleted:', id);
};
