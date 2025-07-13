import { AppError } from '@/errors/app-error.error';
import { verifyToken } from '@/utils/jwt';
import { NextFunction, Request, Response } from 'express';

export const requireAuth = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw new AppError('Unauthorized', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyToken(token);
    req.user = {
      id: payload.id,
      email: payload.email,
    };
    next();
  } catch {
    throw new AppError('Invalid or expired token', 401);
  }
};
