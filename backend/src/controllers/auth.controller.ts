import { env } from '@/config/env';
import { AppError } from '@/errors/app-error.error';
import * as authService from '@/services/auth.service';
import { LOGIN_SCHEMA, REGISTER_SCHEMA } from '@/types';
import { Request, Response } from 'express';

const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: env.REFRESH_TOKEN_EXPIRES_IN_MS,
  path: '/api/v1/auth/refresh',
};

export const login = async (req: Request, res: Response) => {
  const parsed = LOGIN_SCHEMA.safeParse(req.body);

  if (!parsed.success) {
    throw new AppError('Validation failed', 400, parsed.error.errors);
  }

  const { accessToken, refreshToken } = await authService.login(parsed.data);

  res
    .status(200)
    .cookie(env.REFRESH_TOKEN_COOKIE_NAME, refreshToken, cookieOptions)
    .json({ accessToken });
};

export const register = async (req: Request, res: Response) => {
  const parsed = REGISTER_SCHEMA.safeParse(req.body);

  if (!parsed.success) {
    throw new AppError('Validation failed', 400, parsed.error.errors);
  }

  await authService.register(parsed.data);

  res.sendStatus(204);
};

export const logout = async (req: Request, res: Response) => {
  const refreshToken = req.cookies[env.REFRESH_TOKEN_COOKIE_NAME];

  if (refreshToken) {
    await authService.logout(refreshToken);
  }

  res.clearCookie(env.REFRESH_TOKEN_COOKIE_NAME).sendStatus(204);
};

export const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies[env.REFRESH_TOKEN_COOKIE_NAME];

  if (!refreshToken) {
    throw new AppError('Refresh token not found', 401);
  }

  try {
    const { accessToken, refreshToken: newRefreshToken } =
      await authService.refreshToken(refreshToken);
    res
      .status(200)
      .cookie(env.REFRESH_TOKEN_COOKIE_NAME, newRefreshToken, cookieOptions)
      .json({ accessToken });
  } catch (error) {
    res.clearCookie(env.REFRESH_TOKEN_COOKIE_NAME, cookieOptions);
    throw error;
  }
};
