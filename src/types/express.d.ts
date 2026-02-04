import { Role } from "../entity/Role.entity";
import { TokenPayload } from "./jwt";

declare global {
	namespace Express {
		interface Request {
			user: TokenPayload;
		}
	}
}
