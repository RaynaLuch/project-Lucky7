import Recipe from '../db/models/recipe.js';
import User from '../db/models/user.js';

export const addRecipeToFavorites = async (req, res, next) => {
  try {
    const recipeId = req.params.id;
    const userId = req.user._id;

    const user = await User.findById(userId);
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

export const getFavoriteRecipes = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate('favorites');

    res.status(200).json(user.favorites);
  } catch (error) {
    next(error);
  }
};
