import { Router } from 'express';

import { registerSchema } from '../validation/auth.js';
import { loginSchema } from '../validation/auth.js';

import { registerUserController } from '../controllers/auth.js';
import { loginUserController } from '../controllers/auth.js';

import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

router.post(
  '/register',
  validateBody(registerSchema),
  ctrlWrapper(registerUserController),
);

router.post(
  '/login',
  validateBody(loginSchema),
  ctrlWrapper(loginUserController),
);

export default router;
