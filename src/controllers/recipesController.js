import createHttpError from 'http-errors';
import RecipeCollection from '../db/models/recipe.js';
import { UserCollection } from '../db/models/user.js';
import {
  addRecipes,
  getOwnRecipes,
  getRecipeById,
} from '../services/recipesServices.js';

export const addRecipeToFavorites = async (req, res, next) => {
  try {
    const recipeId = req.params.id;
    const userId = req.user._id;

    const user = await UserCollection.findById(userId);
    const recipe = await RecipeCollection.findById(recipeId);

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

export const addRecipesController = async (req, res) => {
  const { _id: owner } = req.user;
  const data = await addRecipes({ ...req.body, owner });

  res.status(201).json({
    status: 201,
    message: 'Successfully add recipe',
    data,
  });
};

export const deleteRecipeController = async (req, res, next) => {
  const { id } = req.params;
  const recipe = await RecipeCollection.findById(id);
  if (!recipe) {
    throw createHttpError(404, 'Recipe not found');
  }

  await RecipeCollection.findByIdAndDelete(id);
  await UserCollection.updateMany(
    { favorites: id },
    { $pull: { favorites: id } },
  );
  res.status(204).send();
};

export const getRecipeByIdController = async (req, res) => {
  const id = req.params.id;
  const foundRecipe = await getRecipeById(id);

  res.status(200).json({
    status: 200,
    message: 'Successfully found recipe by id!',
    data: foundRecipe,
  });
};
