import { AppError } from '@/errors/app-error.error';
import * as metricsService from '@/services/metrics.service';
import { Request, Response } from 'express';
import { DATE_QUERY_SCHEMA } from '../types';
export const getSummary = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Unauthorized', 401);
  }

  const validation = DATE_QUERY_SCHEMA.safeParse(req.query);

  if (!validation.success) {
    throw new AppError('Validation failed', 400, validation.error.errors);
  }

  const { startDate, endDate } = validation.data;

  const summary = await metricsService.getSummary(
    req.user.userId,
    new Date(startDate),
    new Date(endDate)
  );
  res.status(200).json(summary);
};
