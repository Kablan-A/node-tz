import jwt from "jsonwebtoken";
import { Role } from "../entity/Role.entity";

const { ACCESS_SECRET, ACCESS_EXPIRATION, REFRESH_SECRET, REFRESH_EXPIRATION } =
	process.env;

export function generateTokens(userId: string, role: Role) {
	const accessToken = jwt.sign({ userId: userId, role: role }, ACCESS_SECRET!, {
		expiresIn: ACCESS_EXPIRATION,
	});

	const refreshToken = jwt.sign(
		{ userId: userId, role: role },
		REFRESH_SECRET!,
		{
			expiresIn: REFRESH_EXPIRATION,
		},
	);

	return { accessToken, refreshToken };
}
