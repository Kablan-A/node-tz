import * as bcrypt from "bcrypt";
import HttpStatusCodes from "http-status-codes";
import { AppError } from "../errors/AppError.error";
import { plainToInstance } from "class-transformer";
import {
	AuthLoginRequestDto,
	AuthRegisterRequestDto,
	AuthResponseDto,
} from "../dto/auth.dto";
import { UserService } from "./user.service";
import { generateTokens } from "../utils/generate-tokens.util";
import { UserResponseDto } from "../dto/user.dto";
import { User } from "../entity/User.entity";

export class AuthService {
	static async register(dto: AuthRegisterRequestDto) {
		const newUser = await UserService.createUser(dto);

		return this.buildAuthTokenResponse(newUser);
	}

	static async login({ email, password }: AuthLoginRequestDto) {
		const user = await UserService.getUserByEmail(email);

		const isPasswordMatch = await bcrypt.compare(password, user.password);
		if (!isPasswordMatch) {
			throw new AppError("Invalid credentials", HttpStatusCodes.BAD_REQUEST);
		}

		return this.buildAuthTokenResponse(user);
	}

	private static buildAuthTokenResponse(user: User) {
		const { accessToken, refreshToken } = generateTokens(user.id);
		const payload = plainToInstance(AuthResponseDto, {
			token: accessToken,
			user: plainToInstance(UserResponseDto, user),
		});

		return { payload, refreshToken };
	}
}
