import { env } from '@/config/env';
import { AppError } from '@/errors/app-error.error';
import prisma from '@/lib/prisma';
import { LoginRequest, LoginResponse, RegisterRequest } from '@/types';
import { comparePassword, hashPassword } from '@/utils/hash';
import { signToken } from '@/utils/jwt';
import { AppUser } from '@prisma/client';

const fakeHash = '$2a$10$A3zWV6X542wcgAnf/YkL8urDwnhoo8I.//lVX1gpNJYWMWSBFb2De';

const generateTokenPair = async (user: AppUser): Promise<LoginResponse> => {
  const accessToken = signToken(
    {
      sub: user.id,
      id: user.id,
      email: user.email,
      fullName: user.fullName,
    },
    { expiresIn: env.JWT_EXPIRES_IN_S }
  );

  const refreshToken = await prisma.refreshToken.create({
    data: {
      userId: user.id,
      expiresAt: new Date(Date.now() + env.REFRESH_TOKEN_EXPIRES_IN_MS),
    },
  });

  return {
    accessToken,
    refreshToken: refreshToken.token,
  };
};

export const login = async (request: LoginRequest): Promise<LoginResponse> => {
  const user = await prisma.appUser.findUnique({
    where: { email: request.email },
  });

  const password = user ? user.password : fakeHash;

  const isPasswordValid = await comparePassword(request.password, password);

  if (!user || !isPasswordValid) {
    throw new AppError('Invalid email or password', 401);
  }

  return generateTokenPair(user);
};

export const register = async (request: RegisterRequest): Promise<void> => {
  const user = await prisma.appUser.findUnique({
    where: { email: request.email },
  });

  if (user) {
    throw new AppError('User already exists', 409);
  }

  const hashedPassword = await hashPassword(request.password);

  await prisma.appUser.create({
    data: {
      email: request.email,
      password: hashedPassword,
      fullName: request.fullName,
    },
  });
};

export const logout = async (refreshToken: string): Promise<void> => {
  await prisma.refreshToken.delete({ where: { token: refreshToken } });
};

export const refreshToken = async (
  refreshToken: string
): Promise<LoginResponse> => {
  const savedRefreshToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: { user: true },
  });

  if (!savedRefreshToken) {
    throw new AppError('Invalid refresh token', 401);
  }

  const isTokenExpired = new Date() > savedRefreshToken.expiresAt;

  if (savedRefreshToken.revoked) {
    await prisma.refreshToken.deleteMany({
      where: { userId: savedRefreshToken.userId },
    });
    throw new AppError('Refresh token revoked', 403);
  }

  if (isTokenExpired) {
    await prisma.refreshToken.delete({ where: { token: refreshToken } });
    throw new AppError('Refresh token expired', 403);
  }

  await prisma.refreshToken.update({
    where: { token: refreshToken },
    data: { revoked: true },
  });

  return generateTokenPair(savedRefreshToken.user);
};
