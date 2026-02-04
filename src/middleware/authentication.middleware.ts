import { NextFunction, Request, Response } from 'express';
import HttpStatusCodes from 'http-status-codes';
import jwt from 'jsonwebtoken';

import { AppError } from '../errors/AppError.error';
import { TokenPayload } from '../types/jwt';

const { ACCESS_SECRET } = process.env;

export function authentication(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    const isBearerToken = authHeader && authHeader.startsWith('Bearer ');
    if (!isBearerToken) {
      throw new AppError('No or invalid token provided', HttpStatusCodes.UNAUTHORIZED);
    }

    const token = authHeader.split(' ')[1];

    const decodedToken = jwt.verify(token, ACCESS_SECRET!) as TokenPayload;
    req.user = decodedToken;
    next();
  } catch (err) {
    next(err);
  }
}
