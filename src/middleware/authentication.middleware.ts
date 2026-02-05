import { NextFunction, Request, Response } from 'express';
import HttpStatusCodes from 'http-status-codes';

import { AppError } from '../errors/AppError.error';
import { decodeToken } from '../utils/decode-token.util';

const { ACCESS_SECRET } = process.env;

export function authentication(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    const isBearerToken = authHeader && authHeader.startsWith('Bearer ');
    if (!isBearerToken) {
      throw new AppError('No or invalid token provided', HttpStatusCodes.UNAUTHORIZED);
    }

    const token = authHeader.split(' ')[1];

    req.user = decodeToken(token, ACCESS_SECRET!);
    next();
  } catch (err) {
    next(err);
  }
}
