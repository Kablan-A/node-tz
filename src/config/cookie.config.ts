import { CookieOptions } from "express";

const { NODE_ENV } = process.env;

export const REFRESH_TOKEN_COOKIE_OPTIONS: CookieOptions = {
	httpOnly: true,
	secure: NODE_ENV !== "development",
	sameSite: "strict",
	maxAge: 7 * 24 * 60 * 60 * 1000,
} as const;
