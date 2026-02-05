import { Request, Response } from 'express';
import HttpStatusCodes from 'http-status-codes';

import { REFRESH_TOKEN_COOKIE_OPTIONS } from '../config/cookie.config';
import { AppError } from '../errors/AppError.error';
import { AuthService } from '../services/auth.service';

export class AuthController {
  static async register(req: Request, res: Response) {
    const { payload, refreshToken } = await AuthService.register(req.body);

    res
      .status(HttpStatusCodes.CREATED)
      .cookie('refreshToken', refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS)
      .json({ message: 'User registered successfully', data: payload });
  }

  static async login(req: Request, res: Response) {
    const { payload, refreshToken } = await AuthService.login(req.body);

    res
      .status(HttpStatusCodes.OK)
      .cookie('refreshToken', refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS)
      .json({ message: 'User logged in successfully', data: payload });
  }

  static async refreshToken(req: Request, res: Response) {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      throw new AppError('No refresh token provided', HttpStatusCodes.BAD_REQUEST);
    }

    const {
      payload: { token },
      refreshToken: newRefreshToken,
    } = await AuthService.refreshToken(refreshToken);

    res
      .status(HttpStatusCodes.OK)
      .cookie('refreshToken', newRefreshToken, REFRESH_TOKEN_COOKIE_OPTIONS)
      .json({ message: 'Token refreshed successfully', data: { token } });
  }
}
