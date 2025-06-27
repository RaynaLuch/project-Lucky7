const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/authenticate');
const {
  addRecipeToFavorites,
  getFavoriteRecipes,
  getOwnRecipesController,
} = require('../../controllers/recipesController.js');
const ctrlWrapper = require('../../utils/ctrlWrapper.js');

router.use(auth);

router.post('/favorites/:id', addRecipeToFavorites);

router.get('/favorites', getFavoriteRecipes);

router.get('/own', ctrlWrapper(getOwnRecipesController));

module.exports = router;
