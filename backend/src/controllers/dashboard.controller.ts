import { AppError } from '@/errors/app-error.error';
import * as dashboardService from '@/services/dashboard.service';
import { DATE_QUERY_SCHEMA } from '@/types';
import { Request, Response } from 'express';

export const getSummary = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Unauthorized', 401);
  }
  const validation = DATE_QUERY_SCHEMA.safeParse(req.query);
  if (!validation.success) {
    throw new AppError('Validation failed', 400, validation.error.errors);
  }
  const { from, to } = validation.data;

  const summary = await dashboardService.getSummary(req.user.id, from, to);

  res.json(summary);
};

export const getExpensesDistribution = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Unauthorized', 401);
  }
  const validation = DATE_QUERY_SCHEMA.safeParse(req.query);
  if (!validation.success) {
    throw new AppError('Validation failed', 400, validation.error.errors);
  }
  const { from, to } = validation.data;
  const distribution = await dashboardService.getExpensesDistribution(
    req.user.id,
    from,
    to
  );
  res.json(distribution);
};

export const getBudget = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Unauthorized', 401);
  }
  const validation = DATE_QUERY_SCHEMA.safeParse(req.query);
  if (!validation.success) {
    throw new AppError('Validation failed', 400, validation.error.errors);
  }
  const { from, to } = validation.data;
  const budget = await dashboardService.getBudget(req.user.id, from, to);
  res.json(budget);
};
