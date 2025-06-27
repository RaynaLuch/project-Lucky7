import { Recipe } from '../db/models/recipe.js';

export const getOwnRecipes = async (userId) => {
  const ownRecipes = await Recipe.find(userId);
  return ownRecipes;
};
