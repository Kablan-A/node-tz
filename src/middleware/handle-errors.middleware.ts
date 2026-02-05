import { NextFunction, Request, Response } from 'express';
import HttpStatusCodes from 'http-status-codes';

import { AppError } from '../errors/AppError.error';

export const handleErrors = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  const { statusCode, message } = err;

  if (err instanceof AppError) {
    return res.status(statusCode).json({
      message,
    });
  }

  res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
    message: 'Internal Server Error',
  });
};
