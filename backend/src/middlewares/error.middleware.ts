import { AppError, AppErrorDetail } from '@/errors/app-error.error';
import { logger } from '@/utils/logger';
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error(err); // log full error

  if (err instanceof ZodError) {
    const formatted: AppErrorDetail[] = err.errors.map(e => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    res.status(400).json({
      message: 'Validation failed',
      statusCode: 400,
      errors: formatted,
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      statusCode: err.statusCode,
      message: err.message,
      errors: err.errors || [],
    });
    return;
  }

  res.status(500).json({
    statusCode: 500,
    message: 'Internal server error',
    errors: [],
  });
};
