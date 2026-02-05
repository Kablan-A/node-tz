import HttpStatusCodes from 'http-status-codes';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';

import { AppError } from '../errors/AppError.error';
import { TokenPayload } from '../types/jwt';

export function decodeToken(token: string, secret: string): TokenPayload {
  try {
    const decodedToken = jwt.verify(token, secret) as TokenPayload;
    return decodedToken;
  } catch (err) {
    if (err instanceof JsonWebTokenError) {
      if (err.name === 'TokenExpiredError') {
        throw new AppError('Token has expired', HttpStatusCodes.UNAUTHORIZED);
      } else if (err.name === 'JsonWebTokenError') {
        throw new AppError('Invalid token', HttpStatusCodes.UNAUTHORIZED);
      }
    }
  }
  throw new AppError('Token verification failed', HttpStatusCodes.UNAUTHORIZED);
}
