import HttpStatusCodes from "http-status-codes";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError.error";

export function validateDto<T extends object>(
	type: new () => T,
): (req: Request, res: Response, next: NextFunction) => void {
	return async (req: Request, res: Response, next: NextFunction) => {
		const dtoInstance = plainToInstance(type, req.body);

		try {
			const errors = await validate(dtoInstance, {
				skipMissingProperties: false,
			});

			if (errors.length > 0) {
				const errorMessages = errors
					.map((err) => Object.values(err.constraints || {}))
					.flat()
					.join(", ");

				throw new AppError(errorMessages, HttpStatusCodes.BAD_REQUEST);
			}

			req.body = dtoInstance;
			next();
		} catch (err) {
			next(err);
		}
	};
}
