import { Category } from '../db/models/category.js';

export const getAllCategories = async () => {
  return await Category.find({}, { __v: 0 });
};
