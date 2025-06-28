import RecipeCollection from '../db/models/recipe.js';
import { Ingredient } from '../db/models/ingredient.js';

export const getOwnRecipes = async (userId) => {
  const ownRecipes = await RecipeCollection.find(userId);
  return ownRecipes;
};


export const addRecipes = (payload) => RecipeCollection.create(payload);

export const getRecipeById = async (recipeId) => {
  const recipeById = await RecipeCollection.findById(recipeId);
  const recipe = recipeById.toObject();
  for (let ingredient of recipe.ingredients) {
    const ingData = await Ingredient.findById(ingredient.id);
    ingredient['name'] = ingData?.name;
  }

  return recipe;
};
