import {
	IsDateString,
	IsEmail,
	IsNotEmpty,
	IsString,
	IsStrongPassword,
} from "class-validator";
import { UserResponseDto } from "./user.dto";

export class AuthRegisterRequestDto {
	@IsNotEmpty()
	@IsString()
	fullName!: string;

	@IsNotEmpty()
	@IsEmail()
	email!: string;

	@IsNotEmpty()
	@IsDateString()
	dateOfBirth!: string;

	@IsNotEmpty()
	@IsString()
	@IsStrongPassword(
		{
			minLength: 8,
			minLowercase: 1,
			minUppercase: 1,
			minNumbers: 1,
			minSymbols: 1,
		},
		{
			message:
				"Password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and symbols.",
		},
	)
	password!: string;
}

export class AuthLoginRequestDto {
	@IsNotEmpty()
	@IsEmail()
	email!: string;

	@IsNotEmpty()
	@IsString()
	password!: string;
}

export class AuthTokenResponseDto {
	token!: string;
	user!: UserResponseDto;
}
