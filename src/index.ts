import 'reflect-metadata';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { configDotenv } from 'dotenv';
import express from 'express';

import { connectDB } from './config/db.config';
import { validateEnv } from './config/env.config';
import { handleErrors } from './middleware/handle-errors.middleware';
import { authRouter } from './routes/auth.route';
import { userRouter } from './routes/user.route';

configDotenv();

validateEnv();

const { PORT, FRONTEND_BASE_URL } = process.env;

const app = express();

app.set('port', PORT || 3001);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: FRONTEND_BASE_URL,
    credentials: true,
  }),
);

app.get('/', (_req, res) => {
  res.send('API Running');
});

app.use('/auth', authRouter);
app.use('/users', userRouter);

app.use(handleErrors);

const initServer = async () => {
  await connectDB();

  const port = app.get('port');
  app.listen(port, () => console.log(`Server started on port ${port}`));
};

initServer();
