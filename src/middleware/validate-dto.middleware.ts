import HttpStatusCodes from "http-status-codes";
import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { Request, Response, NextFunction } from "express";

export function validateDto<T extends object>(
	type: new () => T,
): (req: Request, res: Response, next: NextFunction) => void {
	return (req: Request, res: Response, next: NextFunction) => {
		const dtoInstance = plainToInstance(type, req.body);

		validate(dtoInstance, { skipMissingProperties: false }).then(
			(errors: ValidationError[]) => {
				if (errors.length > 0) {
					const errorMessages = errors
						.map((error) => Object.values(error.constraints || {}))
						.flat();

					return res
						.status(HttpStatusCodes.BAD_REQUEST)
						.json({ errors: errorMessages });
				} else {
					req.body = dtoInstance;
					next();
				}
			},
		);
	};
}
