import HttpStatusCodes from "http-status-codes";
import { Request, Response } from "express";
import { REFRESH_TOKEN_COOKIE_OPTIONS } from "../config/cookie.config";
import { AuthService } from "../services/auth.service";

export class AuthController {
	static async register(req: Request, res: Response) {
		const { payload, refreshToken } = await AuthService.register(req.body);

		res
			.status(HttpStatusCodes.CREATED)
			.cookie("refreshToken", refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS)
			.json({ message: "User registered successfully", data: payload });
	}

	static async login(req: Request, res: Response) {
		const { payload, refreshToken } = await AuthService.login(req.body);

		res
			.status(HttpStatusCodes.OK)
			.cookie("refreshToken", refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS)
			.json({ message: "User logged in successfully", data: payload });
	}
}
