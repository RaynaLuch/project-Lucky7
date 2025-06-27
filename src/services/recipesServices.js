import { Recipe } from '../db/models/contact.js';

export const getOwnRecipes = async (userId) => {
  const ownRecipes = await Recipe.find(userId);
  return ownRecipes;
};
