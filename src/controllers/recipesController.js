import RecipeCollection from '../db/models/recipe.js';
import { UserCollection } from '../db/models/user.js';
import { addRecipes, getOwnRecipes } from '../services/recipesServices.js';
import { addRecipeSchema } from '../validation/recipe.js';

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

  const validateResult = addRecipeSchema.validate(req.body);
  console.log(validateResult);
};
