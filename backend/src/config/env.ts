import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  PORT: z.string().default('5000'),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN_S: z
    .string()
    .default('900')
    .transform(val => parseInt(val, 10)),
  REFRESH_TOKEN_EXPIRES_IN_MS: z
    .string()
    .default('604800000')
    .transform(val => parseInt(val, 10)),
  REFRESH_TOKEN_COOKIE_NAME: z.string(),
  CORS_ORIGINS: z.string().default('http://localhost:3000'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('Invalid environment variables:', parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data;
