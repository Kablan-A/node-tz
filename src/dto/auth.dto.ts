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
	@IsStrongPassword()
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
