const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth'); 
const User = require('../db/models/User');   
const Recipe = require('../db/models/Recipe'); 

// POST /api/recipes/favorites/:id
router.post('/favorites/:id', auth, async (req, res, next) => {
  try {
    const recipeId = req.params.id;
    const user = req.user;

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    if (!user.favorites.includes(recipeId)) {
      user.favorites.push(recipeId);
      await user.save();
    }

    res.status(200).json({ message: 'Recipe added to favorites' });
  } catch (error) {
    next(error);
  }
});

// GET /api/recipes/favorites
router.get('/favorites', auth, async (req, res, next) => {
  try {
    const userWithFavorites = await req.user.populate('favorites');
    res.status(200).json(userWithFavorites.favorites);
  } catch (error) {
    next(error);
  }
});

module.exports = router;