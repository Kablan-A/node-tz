import HttpStatusCodes from "http-status-codes";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError.error";

export function checkOwnership(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const userIdParams = req.params.userId;
		const { userId, role } = req.user;

		const isUser = role.name === "USER";
		const isOwner = userId === userIdParams;
		if (isUser && !isOwner) {
			throw new AppError(
				"Forbidden: You can only access your own resources",
				HttpStatusCodes.FORBIDDEN,
			);
		}

		next();
	} catch (err) {
		next(err);
	}
}
