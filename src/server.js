import express from 'express';
import pino from 'pino-http';
import cors from 'cors';

import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

import dotenv from 'dotenv';
import { getEnvVar } from './utils/getEnvVar.js';

import cookieParser from 'cookie-parser';

import auth from './routers/auth.js';
import recipesRouter from './routers/recipes.js';
import userRouter from './routers/users.js';
import categoriesRouter from './routers/categories.js';
import ingredientsRouter from './routers/ingredients.js';

dotenv.config();

const PORT = Number(getEnvVar('PORT', '3000'));

export const startServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(cookieParser());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use('/api/auth', auth);
  app.use('/api/recipes', recipesRouter);
  app.use('/api/users', userRouter);
  app.use('/api/categories', categoriesRouter);
  app.use('/api/ingredients', ingredientsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
