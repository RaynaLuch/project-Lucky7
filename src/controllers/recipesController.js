import * as fs from 'node:fs/promises';
import path from 'node:path';

import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';
import RecipeCollection from '../db/models/recipe.js';
import { UserCollection } from '../db/models/user.js';
import {
  addRecipes,
  deleteFavoriteRecipes,
  getOwnRecipes,
  getRecipeById,
  searchRecipes,
} from '../services/recipesServices.js';

import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';

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
  const { page, perPage } = parsePaginationParams(req.query);

  const ownRecipes = await getOwnRecipes({
    page,
    perPage,
    owner: req.user._id,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found own recipes!',
    data: ownRecipes,
  });
};

export const addRecipesController = async (req, res) => {
  let photoUrl = null;

  if (getEnvVar('UPLOAD_TO_CLOUDINARY') === 'true') {
    const result = await uploadToCloudinary(req.file.path);

    await fs.unlink(req.file.path);

    photoUrl = result.secure_url;
  } else {
    await fs.rename(req.file.path, path.resolve('uploads', req.file.filename));
    photoUrl = `http://localhost:3000/photoUrl/${req.file.filename}`;
  }

  const { _id: owner } = req.user;
  const data = await addRecipes({
    ...req.body,
    owner,
    photoUrl,
  });

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
  //const { _id: userid } = req.user;
  const user = req.user;
  console.log('user', user);

  if (!isValidObjectId(id)) {
    throw createHttpError(400, 'Wrong id format: is not valid ObjectId');
  }

  const foundRecipe = await getRecipeById(id);

  if (!foundRecipe) {
    throw createHttpError(404, 'Recipe not found');
  }

  foundRecipe.isFavorite = false;
  if (user?.favorites?.includes(id)) foundRecipe.isFavorite = true;

  res.status(200).json({
    status: 200,
    message: 'Successfully found recipe by id!',
    data: foundRecipe,
  });
};

export const searchRecipesController = async (req, res, next) => {
  try {
    const searchData = await searchRecipes(req.query);
    res.json(searchData);
  } catch (error) {
    next(error);
  }
};

export const deleteFavoriteRecipesController = async (req, res, next) => {
  try {
    await deleteFavoriteRecipes(req.user.id, req.params.id);
    res.status(204).end();
  } catch (error) {
    const status = error.message.includes('not') ? 404 : 500;
    res.status(error.status || status).json({ message: error.message });
  }
};
