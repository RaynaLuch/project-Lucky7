import RecipeCollection from '../db/models/recipe.js';
import { Ingredient } from '../db/models/ingredient.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getOwnRecipes = async ({ page, perPage, owner }) => {
  const skip = page > 0 ? (page - 1) * perPage : 0;

  const ownRecipesQuery = await RecipeCollection.find({ owner });

  const [ownRecipesCount, data] = await Promise.all([
    RecipeCollection.countDocuments(ownRecipesQuery),
    ownRecipesQuery.skip(skip).limit(perPage),
  ]);

  const paginationData = calculatePaginationData(
    ownRecipesCount,
    perPage,
    page,
  );

  return { data, ...paginationData };
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
