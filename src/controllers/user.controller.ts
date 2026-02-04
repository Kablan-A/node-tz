import HttpStatusCodes from "http-status-codes";
import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { plainToInstance } from "class-transformer";
import { UserResponseDto } from "../dto/user.dto";

export class UserController {
	static async getUser(req: Request, res: Response) {
		const { userId } = req.params;

		const user = await UserService.getUserById(userId);

		const payload = plainToInstance(UserResponseDto, user);

		res.status(HttpStatusCodes.OK).json({
			message: "Fetched user successfully",
			data: payload,
		});
	}

	static async getAllUsers(req: Request, res: Response) {
		const users = await UserService.getAllUsers();

		const payload = plainToInstance(UserResponseDto, users);

		res.status(HttpStatusCodes.OK).json({
			message: "Fetched all users successfully",
			data: payload,
		});
	}

	static async toggleUserActiveStatus(req: Request, res: Response) {
		const { userId } = req.params;

		const updatedUser = await UserService.toggleUserActiveStatus(userId);

		const payload = plainToInstance(UserResponseDto, updatedUser);

		res.status(HttpStatusCodes.OK).json({
			message: "Toggled user active status successfully",
			data: payload,
		});
	}
}
