import { AppError } from '@/errors/app-error.error';
import * as transactionService from '@/services/transaction.service';
import {
  CREATE_TRANSACTION_SCHEMA,
  TRANSACTION_QUERY_SCHEMA,
  UPDATE_TRANSACTION_SCHEMA,
} from '@/types';
import { Request, Response } from 'express';

export const createTransaction = async (req: Request, res: Response) => {
  const validation = CREATE_TRANSACTION_SCHEMA.safeParse(req.body);

  if (!validation.success) {
    throw new AppError('Validation failed', 400, validation.error.errors);
  }

  if (!req.user) {
    throw new AppError('Unauthorized', 401);
  }

  const transactionId = await transactionService.createTransaction(
    validation.data,
    req.user.id
  );

  const location = `${req.baseUrl}/${transactionId}`;

  res.status(201).location(location).send();
};

export const readTransaction = async (req: Request, res: Response) => {
  const transactionId = req.params.id;

  if (!transactionId) {
    throw new AppError('Transaction id is required', 400);
  }

  if (!req.user) {
    throw new AppError('Unauthorized', 401);
  }

  const transaction = await transactionService.readTransaction(
    transactionId,
    req.user.id
  );
  res.status(200).json(transaction);
};

export const readAllTransactions = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Unauthorized', 401);
  }

  const validation = TRANSACTION_QUERY_SCHEMA.safeParse(req.query);

  if (!validation.success) {
    throw new AppError('Validation failed', 400, validation.error.errors);
  }

  const { page, size, from, to, type } = validation.data;

  const transactions = await transactionService.readAllTransactions(
    req.user.id,
    page,
    size,
    from,
    to,
    type
  );
  res.status(200).json(transactions);
};

export const deleteTransaction = async (req: Request, res: Response) => {
  const transactionId = req.params.id;

  if (!transactionId) {
    throw new AppError('Transaction id is required', 400);
  }

  if (!req.user) {
    throw new AppError('Unauthorized', 401);
  }

  await transactionService.deleteTransaction(transactionId, req.user.id);
  res.sendStatus(204);
};

export const updateTransaction = async (req: Request, res: Response) => {
  const transactionId = req.params.id;

  if (!transactionId) {
    throw new AppError('Transaction id is required', 400);
  }

  if (!req.user) {
    throw new AppError('Unauthorized', 401);
  }

  const validation = UPDATE_TRANSACTION_SCHEMA.safeParse(req.body);

  if (!validation.success) {
    throw new AppError('Validation failed', 400, validation.error.errors);
  }

  await transactionService.updateTransaction(
    transactionId,
    req.user.id,
    validation.data
  );

  res.sendStatus(204);
};
