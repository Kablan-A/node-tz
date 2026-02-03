import jwt from "jsonwebtoken";

const { ACCESS_SECRET, ACCESS_EXPIRATION, REFRESH_SECRET, REFRESH_EXPIRATION } =
	process.env;

export function generateTokens(userId: string) {
	const accessToken = jwt.sign({ userId: userId }, ACCESS_SECRET!, {
		expiresIn: ACCESS_EXPIRATION,
	});

	const refreshToken = jwt.sign({ userId: userId }, REFRESH_SECRET!, {
		expiresIn: REFRESH_EXPIRATION,
	});

	return { accessToken, refreshToken };
}
