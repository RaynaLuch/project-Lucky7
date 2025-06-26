const Recipe = require('../db/models/Recipe');
const User = require('../db/models/User');

//створити приватний ендпоінт для додавання рецепту до списку улюблених//

const addRecipeToFavorites = async (req, res, next) => {
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
};

//створити приватний ендпоінт для отримання улюблених рецептів//

const getFavoriteRecipes = async (req, res, next) => {
  try {
    const userWithFavorites = await req.user.populate('favorites');
    res.status(200).json(userWithFavorites.favorites);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addRecipeToFavorites,
  getFavoriteRecipes,
};