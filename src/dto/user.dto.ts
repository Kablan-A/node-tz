import { UUID } from "crypto";
import { Role } from "../entity/Role.entity";
import { Exclude } from "class-transformer";

export class UserResponseDto {
	id!: UUID;
	fullName!: string;
	email!: string;
	dateOfBirth!: Date;
	role!: Role;

	@Exclude()
	password?: never;

	isActive!: boolean;
}
