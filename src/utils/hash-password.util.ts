import * as bcrypt from "bcrypt";

export async function hashPassword(password: string): Promise<string> {
	const hashSalt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, hashSalt);

	return hashedPassword;
}
