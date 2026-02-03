import HttpStatusCodes from "http-status-codes";
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { AuthTokenResponseDto } from "../dto/auth.dto";
import { UserResponseDto } from "../dto/user.dto";
import { plainToInstance } from "class-transformer";
import { generateTokens } from "../utils/generate-tokens.util";
import { hashPassword } from "../utils/hash-password.util";
import * as bcrypt from "bcrypt";
import { REFRESH_TOKEN_COOKIE_OPTIONS } from "../config/cookie.config";
import { RoleType } from "../enums/RoleType.enum";

export class AuthController {
	static async register(req: Request, res: Response) {
		const { fullName, email, dateOfBirth, password } = req.body;

		const userRepository = AppDataSource.getRepository("User");

		const user = await userRepository.exists({
			where: { email },
		});

		if (user) {
			return res
				.status(HttpStatusCodes.CONFLICT)
				.json({ message: "User already exists" });
		}

		try {
			const roleRepository = AppDataSource.getRepository("Role");
			const userRole = await roleRepository.findOneBy({ name: RoleType.USER });

			if (!userRole) {
				return res
					.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
					.json({ message: "User role not found" });
			}

			const hashedPassword = await hashPassword(password);
			const newUser = userRepository.create({
				fullName,
				email,
				dateOfBirth: new Date(dateOfBirth),
				password: hashedPassword,
				role: userRole,
			});

			await userRepository.save(newUser);

			const { accessToken, refreshToken } = generateTokens(newUser.id);

			const payload = plainToInstance(AuthTokenResponseDto, {
				token: accessToken,
				user: plainToInstance(UserResponseDto, newUser),
			});

			return res
				.status(HttpStatusCodes.CREATED)
				.cookie("refreshToken", refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS)
				.json({ message: "User registered successfully", data: payload });
		} catch (error) {
			console.error("Error registering user:", error);

			return res
				.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
				.json({ message: "Internal server error" });
		}
	}

	static async login(req: Request, res: Response) {
		const { email, password } = req.body;

		const userRepository = AppDataSource.getRepository("User");

		const user = await userRepository.findOneBy({ email });

		if (!user) {
			return res
				.status(HttpStatusCodes.BAD_REQUEST)
				.json({ message: "Invalid credentials" });
		}

		const isPasswordMatch = await bcrypt.compare(password, user.password);

		if (!isPasswordMatch) {
			return res
				.status(HttpStatusCodes.BAD_REQUEST)
				.json({ message: "Invalid credentials" });
		}

		const { accessToken, refreshToken } = generateTokens(user.id);

		const payload = plainToInstance(AuthTokenResponseDto, {
			token: accessToken,
			user: plainToInstance(UserResponseDto, user),
		});

		return res
			.status(HttpStatusCodes.OK)
			.cookie("refreshToken", refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS)
			.json({ message: "User logged in successfully", data: { payload } });
	}
}
