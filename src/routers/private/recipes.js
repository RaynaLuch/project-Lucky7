import express from 'express';
import { addRecipeToFavorites, getFavoriteRecipes } from '../../controllers/recipesController.js';
import { authenticate as auth } from '../../middlewares/authenticate.js';

const router = express.Router();

router.post('/favorites/:id', auth, addRecipeToFavorites);
router.get('/favorites', auth, getFavoriteRecipes);

export default router;