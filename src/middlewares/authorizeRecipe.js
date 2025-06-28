import createHttpError from 'http-errors';
import RecipeCollection from '../db/models/recipe.js';

export const authorizeRecipe = async (req, res, next) => {
  const { id } = req.params;
  const recipe = await RecipeCollection.findById(id);

  if (!recipe) {
    return next(createHttpError(404, 'Recipe not found'));
  }

  const isOwner = recipe.ownerId.toString() === req.user._id.toString();

  if (!isOwner) {
    return next(createHttpError(403, 'Access denied - not your recipe'));
  }
  next();
};
