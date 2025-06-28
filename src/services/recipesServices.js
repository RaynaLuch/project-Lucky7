import RecipeCollection from '../db/models/recipe.js';

export const getOwnRecipes = async (userId) => {
  const ownRecipes = await RecipeCollection.find(userId);
  return ownRecipes;
};

export const addRecipes = (payload) => RecipeCollection.create(payload);
