const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {
  addRecipeToFavorites,
  getFavoriteRecipes,
} = require('../controllers/recipesController');

router.post('/favorites/:id', auth, addRecipeToFavorites);

router.get('/favorites', auth, getFavoriteRecipes);

module.exports = router;