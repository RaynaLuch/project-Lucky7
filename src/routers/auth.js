import { Router } from 'express';

import { registerSchema, loginSchema } from '../validation/auth.js';

import {
  logoutUserController,
  registerUserController,
  loginUserController,
  refreshUserSessionController,
} from '../controllers/auth.js';

import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import { authenticate } from '../middlewares/authenticate.js';
import { authorizeRecipe } from '../middlewares/authorizeRecipe.js';
import { deleteRecipeController } from '../controllers/recipesController.js';

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

router.post('/refresh', ctrlWrapper(refreshUserSessionController));

router.post('/logout', authenticate, ctrlWrapper(logoutUserController));

router.delete(
  '/recipes/:id',
  authenticate,
  authorizeRecipe,
  ctrlWrapper(deleteRecipeController),
);

export default router;
