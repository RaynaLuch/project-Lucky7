import express from 'express';
import { authenticate, identifyUser } from '../middlewares/authenticate.js';
import {
  addRecipesController,
  addRecipeToFavorites,
  getFavoriteRecipes,
  getOwnRecipesController,
  deleteRecipeController,
  getRecipeByIdController,
  searchRecipesController,
  deleteFavoriteRecipesController,
} from '../controllers/recipesController.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { authorizeRecipe } from '../middlewares/authorizeRecipe.js';
import { upload } from '../middlewares/upload.js';
import { validateBody } from '../middlewares/validateBody.js';
import { addRecipeSchema } from '../validation/recipe.js';

const router = express.Router();

router.get('/search', ctrlWrapper(searchRecipesController));

router.post('/favorites/:id', authenticate, addRecipeToFavorites);

router.get('/favorites', authenticate, getFavoriteRecipes);

router.get('/own', authenticate, ctrlWrapper(getOwnRecipesController));

router.post(
  '/own',
  authenticate,
  validateBody(addRecipeSchema),
  upload.single('photoUrl'),
  ctrlWrapper(addRecipesController),
);

router.delete(
  '/recipes/:id',
  authenticate,
  authorizeRecipe,
  ctrlWrapper(deleteRecipeController),
);
router.delete(
  '/favorites/:id',
  authenticate,
  ctrlWrapper(deleteFavoriteRecipesController),
);

router.get('/:id', identifyUser, ctrlWrapper(getRecipeByIdController));

export default router;
