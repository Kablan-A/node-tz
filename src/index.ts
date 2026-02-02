import "reflect-metadata";
import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
// import passport from "passport";
import cookieParser from "cookie-parser";

import { connectDB } from "./config/db.config";
import { FRONTEND_BASE_URL } from "./lib/constants/auth";
import { configDotenv } from "dotenv";

configDotenv();

const app = express();

app.set("port", process.env.PORT || 3001);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(passport.initialize());

app.use(
	cors({
		origin: FRONTEND_BASE_URL,
		credentials: true,
	}),
);

app.get("/", (_req, res) => {
	res.send("API Running");
});

// app.use("/auth", auth);
// app.use("/users", user);

connectDB();

const port = app.get("port");
app.listen(port, () => console.log(`Server started on port ${port}`));
