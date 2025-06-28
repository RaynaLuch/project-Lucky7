import createHttpError from 'http-errors';
import { Recipe } from '../db/models/recipe.js';
import { UserCollection } from '../db/models/user.js';
import { getOwnRecipes } from '../services/recipesServices.js';

export const addRecipeToFavorites = async (req, res, next) => {
  try {
    const recipeId = req.params.id;
    const userId = req.user._id;

    const user = await UserCollection.findById(userId);
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
    const user = await UserCollection.findById(userId).populate('favorites');

    res.status(200).json(user.favorites);
  } catch (error) {
    next(error);
  }
};

export const getOwnRecipesController = async (req, res) => {
  const ownRecipes = await getOwnRecipes({
    userId: req.user._id,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found own recipes!',
    data: ownRecipes,
  });
};

export const deleteRecipeController = async (req, res, next) => {
  const { id } = req.params;
  const recipe = await Recipe.findById(id);
  if (!recipe) {
    throw createHttpError(404, 'Recipe not found');
  }

  await Recipe.findByIdAndDelete(id);
  await UserCollection.updateMany(
    { favorites: id },
    { $pull: { favorites: id } },
  );
  res.status(204).send();
};
