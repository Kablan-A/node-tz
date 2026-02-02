import { configDotenv } from "dotenv";
import { AppDataSource } from "../data-source";

configDotenv();

export const connectDB = async () => {
	try {
		if (AppDataSource.isInitialized) {
			console.log("DB already connected");

			return;
		}

		await AppDataSource.initialize();
		console.log("DB connected successfully");
	} catch (err) {
		console.error("DB connection failed with error: ", err);
		process.exit(1);
	}
};
