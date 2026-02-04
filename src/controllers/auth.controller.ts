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
import { AppError } from "../errors/AppError.error";

export class AuthController {
	static async register(req: Request, res: Response) {
		const { fullName, email, dateOfBirth, password } = req.body;

		const userRepository = AppDataSource.getRepository("User");

		const user = await userRepository.exists({
			where: { email },
		});

		if (user) {
			throw new AppError("User already exists", HttpStatusCodes.CONFLICT);
		}

		const roleRepository = AppDataSource.getRepository("Role");
		const userRole = await roleRepository.findOneBy({ name: RoleType.USER });

		if (!userRole) {
			throw new AppError("User role not found", HttpStatusCodes.NOT_FOUND);
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

		res
			.status(HttpStatusCodes.CREATED)
			.cookie("refreshToken", refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS)
			.json({ message: "User registered successfully", data: payload });
	}

	static async login(req: Request, res: Response) {
		const { email, password } = req.body;

		const userRepository = AppDataSource.getRepository("User");

		const user = await userRepository.findOne({
			where: { email },
			relations: ["role"],
		});

		if (!user) {
			throw new AppError("Invalid credentials", HttpStatusCodes.BAD_REQUEST);
		}

		const isPasswordMatch = await bcrypt.compare(password, user.password);

		if (!isPasswordMatch) {
			throw new AppError("Invalid credentials", HttpStatusCodes.BAD_REQUEST);
		}

		const { accessToken, refreshToken } = generateTokens(user.id);

		const payload = plainToInstance(AuthTokenResponseDto, {
			token: accessToken,
			user: plainToInstance(UserResponseDto, user),
		});

		res
			.status(HttpStatusCodes.OK)
			.cookie("refreshToken", refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS)
			.json({ message: "User logged in successfully", data: payload });
	}
}
