import { DataSource } from "typeorm";
import { User } from "./entity/User.entity";
import { Role } from "./entity/Role.entity";
import { configDotenv } from "dotenv";

configDotenv();

export const {
	DB_HOST,
	DB_PORT,
	DB_USERNAME,
	DB_PASSWORD,
	DB_DATABASE,
	NODE_ENV,
} = process.env;

export const AppDataSource = new DataSource({
	type: "postgres",
	host: DB_HOST,
	port: Number(DB_PORT),
	username: DB_USERNAME,
	password: DB_PASSWORD,
	database: DB_DATABASE,
	synchronize: false,
	logging: NODE_ENV === "DEV" ? true : false,
	entities: [User, Role],
	subscribers: [],
	migrations: [__dirname + "/migrations/*.ts"],
});
