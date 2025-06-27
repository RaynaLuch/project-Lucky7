import express from 'express';
import { authenticate } from '../../middlewares/authenticate.js';
import {
  addRecipeToFavorites,
  getFavoriteRecipes,
  getOwnRecipesController,
} from '../../controllers/recipesController.js';
import { ctrlWrapper } from '../../utils/ctrlWrapper.js';

const router = express.Router();

router.use(authenticate);

router.post('/favorites/:id', addRecipeToFavorites);

router.get('/favorites', getFavoriteRecipes);

router.get('/own', ctrlWrapper(getOwnRecipesController));

export default router;
