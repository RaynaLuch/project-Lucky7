import express from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import {
  addRecipeToFavorites,
  getFavoriteRecipes,
  getOwnRecipesController,
} from '../controllers/recipesController.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();

router.post('/favorites/:id', authenticate, addRecipeToFavorites);

router.get('/favorites', authenticate, getFavoriteRecipes);

router.get('/own', authenticate, ctrlWrapper(getOwnRecipesController));

export default router;
