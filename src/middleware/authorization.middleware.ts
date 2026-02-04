import { NextFunction, Request, Response } from 'express';
import HttpStatusCodes from 'http-status-codes';

import { RoleType } from '../enums/RoleType.enum';
import { AppError } from '../errors/AppError.error';

export function authorization(roles: RoleType[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const userRole = req.user?.role;

      const authorized = userRole && roles.includes(userRole.name);
      if (!authorized) {
        throw new AppError(
          "Forbidden: You don't have permission to access this resource",
          HttpStatusCodes.FORBIDDEN,
        );
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}
