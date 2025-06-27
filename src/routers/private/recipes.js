const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/authenticate');
const {
  addRecipeToFavorites,
  getFavoriteRecipes,
} = require('../../controllers/recipesController.js');

router.use(auth);

router.post('/favorites/:id', addRecipeToFavorites);

router.get('/favorites', getFavoriteRecipes);

module.exports = router;
