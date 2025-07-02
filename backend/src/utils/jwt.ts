import { env } from '@/config/env';
import jwt, { SignOptions } from 'jsonwebtoken';

export interface JwtPayload extends jwt.JwtPayload {
  email: string;
  fullName: string;
  userId: string;
}

export const signToken = (
  payload: JwtPayload,
  options: SignOptions = { expiresIn: '15m' }
): string => {
  return jwt.sign(payload, env.JWT_SECRET, options);
};

export const verifyToken = (token: string): JwtPayload =>
  jwt.verify(token, env.JWT_SECRET) as JwtPayload;
