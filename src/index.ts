import "reflect-metadata";
import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { connectDB } from "./config/db.config";
import { configDotenv } from "dotenv";
import { authRouter } from "./routes/auth.route";

configDotenv();

const { PORT, FRONTEND_BASE_URL } = process.env;

const app = express();

app.set("port", PORT || 3001);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
	cors({
		origin: FRONTEND_BASE_URL,
		credentials: true,
	}),
);

app.get("/", (_req, res) => {
	res.send("API Running");
});

app.use("/auth", authRouter);
// app.use("/users", user);

connectDB();

const port = app.get("port");
app.listen(port, () => console.log(`Server started on port ${port}`));
