import { getAllCategories } from '../services/categoriesService.js';

export const fetchCategories = async (req, res) => {
  const categories = await getAllCategories();
  res.status(200).json({
    status: 200,
    message: 'List of categories',
    data: categories,
  });
};
