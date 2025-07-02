import * as z from 'zod';

export const LOGIN_SCHEMA = z.object({
  email: z.string().email(),
  password: z.string().nonempty(),
});

export type LoginRequest = z.infer<typeof LOGIN_SCHEMA>;

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
};

export const REGISTER_SCHEMA = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().nonempty(),
});

export type RegisterRequest = z.infer<typeof REGISTER_SCHEMA>;
