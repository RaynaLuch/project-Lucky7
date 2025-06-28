import express from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import {
  addRecipesController,
  addRecipeToFavorites,
  getFavoriteRecipes,
  getOwnRecipesController,
  deleteRecipeController,
  getRecipeByIdController,
} from '../controllers/recipesController.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { authorizeRecipe } from '../middlewares/authorizeRecipe.js';
import { validateBody } from '../middlewares/validateBody.js';
import { addRecipeSchema } from '../validation/recipe.js';

const router = express.Router();

router.post('/favorites/:id', authenticate, addRecipeToFavorites);

router.get('/favorites', authenticate, getFavoriteRecipes);

router.get('/own', authenticate, ctrlWrapper(getOwnRecipesController));

router.post('/own', authenticate, validateBody(addRecipeSchema), ctrlWrapper(addRecipesController));

router.delete(
  '/recipes/:id',
  authenticate,
  authorizeRecipe,
  ctrlWrapper(deleteRecipeController),
);

router.get('/:id', ctrlWrapper(getRecipeByIdController));


export default router;
