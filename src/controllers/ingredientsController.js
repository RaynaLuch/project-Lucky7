import { getAllIngredients } from '../services/ingredientService.js';

export const fetchIngredients = async (req, res) => {
  const ingredients = await getAllIngredients();
  res.status(200).json({
    status: 200,
    message: 'List of ingredients',
    data: ingredients,
  });
};
