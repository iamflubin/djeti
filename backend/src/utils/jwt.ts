import { env } from '@/config/env';
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

export const signToken = (
  payload: JwtPayload,
  options: SignOptions
): string => {
  return jwt.sign(payload, env.JWT_SECRET, options);
};

export const verifyToken = (token: string): JwtPayload =>
  jwt.verify(token, env.JWT_SECRET) as JwtPayload;
