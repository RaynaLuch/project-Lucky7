import RecipeCollection from '../db/models/recipe.js';
import { Ingredient } from '../db/models/ingredient.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { Category } from '../db/models/category.js';
import { UserCollection } from '../db/models/user.js';

export const getOwnRecipes = async ({ page, perPage, owner }) => {
  const skip = page > 0 ? (page - 1) * perPage : 0;

  const ownRecipesQuery = RecipeCollection.find({ owner });

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
  if (recipeById) {
    const recipe = recipeById.toObject();
    for (let ingredient of recipe.ingredients) {
      const ingData = await Ingredient.findById(ingredient.id);
      ingredient['name'] = ingData?.name;
    }

    if (recipe.thumb.search('https://ftp') > -1) {
      recipe.thumb = recipe.thumb.replace('preview', 'preview/large');
    }

    return recipe;
  } else {
    return null;
  }
};

export const searchRecipes = async ({
  query,
  category,
  ingredient,
  page = 1,
  limit = 12,
}) => {
  const skip = (page - 1) * limit;
  const filter = {};

  if (query) {
    filter.title = { $regex: query, $options: 'i' };
  }

  if (category) {
    const foundCategory = await Category.findOne({
      name: { $regex: category, $options: 'i' },
    });
    if (foundCategory) {
      filter.category = foundCategory.name;
    } else {
      return { total: 0, page, limit, results: [] };
    }
  }

  if (ingredient) {
    const foundIngredient = await Ingredient.findOne({
      name: { $regex: ingredient, $options: 'i' },
    });
    if (foundIngredient) {
      filter['ingredients.id'] = foundIngredient._id.toString();
    } else {
      return { total: 0, page, limit, results: [] };
    }
  }

  const recipes = await RecipeCollection.find(filter)
    .skip(skip)
    .limit(Number(limit));
  const total = await RecipeCollection.countDocuments(filter);

  return {
    total,
    page: Number(page),
    limit: Number(limit),
    results: recipes,
  };
};

export const deleteFavoriteRecipes = async (userId, recipeId) => {
  const user = await UserCollection.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const isFavorite = user.favorites.some(
    (favId) => favId.toString() === recipeId,
  );

  if (!isFavorite) {
    throw new Error('Recipe not in favorites');
  }

  user.favorites = user.favorites.filter(
    (favId) => favId.toString() !== recipeId,
  );

  await user.save();
};
