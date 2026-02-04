import HttpStatusCodes from "http-status-codes";
import { AppDataSource } from "../data-source";
import { RoleType } from "../enums/RoleType.enum";
import { AppError } from "../errors/AppError.error";
import { hashPassword } from "../utils/hash-password.util";
import { User } from "../entity/User.entity";
import { AuthRegisterRequestDto } from "../dto/auth.dto";

export class UserService {
	static async getUserByEmail(email: string): Promise<User> {
		const userRepository = AppDataSource.getRepository("User");

		const user = await userRepository.findOne({
			where: { email },
			relations: ["role"],
		});

		if (!user) {
			throw new AppError("User not found", HttpStatusCodes.NOT_FOUND);
		}

		return user as User;
	}

	static async createUser({
		fullName,
		email,
		dateOfBirth,
		password,
	}: AuthRegisterRequestDto): Promise<User> {
		try {
			const userRepository = AppDataSource.getRepository("User");

			const userExists = await userRepository.exists({
				where: { email },
			});
			if (userExists) {
				throw new AppError("User already exists", HttpStatusCodes.CONFLICT);
			}

			const roleRepository = AppDataSource.getRepository("Role");
			const userRole = await roleRepository.findOneBy({ name: RoleType.USER });
			if (!userRole) {
				throw new AppError(
					"User role not found",
					HttpStatusCodes.INTERNAL_SERVER_ERROR,
				);
			}

			const hashedPassword = await hashPassword(password);
			const newUser = userRepository.create({
				fullName,
				email,
				dateOfBirth: new Date(dateOfBirth),
				password: hashedPassword,
				role: userRole,
			});

			const savedUser = await userRepository.save(newUser);

			return savedUser as User;
		} catch (err) {
			if (err instanceof AppError) {
				throw err;
			}

			console.error("Error creating user:", err);
			throw new AppError(
				"Failed to create user",
				HttpStatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}
}
