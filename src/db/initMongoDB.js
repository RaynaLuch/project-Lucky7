import mongoose from 'mongoose';
import { Category } from './models/category.js';
import { Ingredient } from './models/ingredient.js';

import { getEnvVar } from '../utils/getEnvVar.js';

export const initMongoDB = async () => {
  try {
    const user = getEnvVar('MONGODB_USER');
    const pwd = getEnvVar('MONGODB_PASSWORD');
    const url = getEnvVar('MONGODB_URL');
    const db = getEnvVar('MONGODB_DB');

    await mongoose.connect(
      `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority`,
    );
    console.log('Mongo connection successfully established!');

    const seed = {
      categories: ['Desserts', 'Soups', 'Salads', 'Main course'],
      ingredients: [
        'Salt',
        'Pepper',
        'Olive Oil',
        'Garlic',
        'Onion',
        'Tomato',
        'Basil',
        'Chicken Breast',
        'Beef',
        'Pasta',
        'Flour',
        'Sugar',
        'Butter',
        'Eggs',
        'Milk',
      ],
    };
    const catCount = await Category.countDocuments();
    if (catCount === 0) {
      console.log(`Seeding ${seed.categories.length} categories…`);
      await Category.insertMany(seed.categories.map((name) => ({ name })));
    }

    const ingCount = await Ingredient.countDocuments();
    if (ingCount === 0) {
      console.log(`Seeding ${seed.ingredients.length} ingredients…`);
      await Ingredient.insertMany(seed.ingredients.map((name) => ({ name })));
    }
  } catch (e) {
    console.log('Error while setting up mongo connection', e);
    throw e;
  }
};
