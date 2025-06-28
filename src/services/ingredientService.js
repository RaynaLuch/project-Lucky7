import { Ingredient } from '../db/models/ingredient.js';

export const getAllIngredients = async () => {
  return await Ingredient.find({}, { __v: 0 });
};
