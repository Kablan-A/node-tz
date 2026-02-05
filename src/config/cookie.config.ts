import { CookieOptions } from 'express';

const { NODE_ENV } = process.env;

const REFRESH_TOKEN_MAX_AGE = 15 * 24 * 60 * 60 * 1000;

export const REFRESH_TOKEN_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: NODE_ENV !== 'DEV',
  sameSite: 'strict',
  maxAge: REFRESH_TOKEN_MAX_AGE,
} as const;
