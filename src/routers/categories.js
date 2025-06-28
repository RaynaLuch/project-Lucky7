import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { fetchCategories } from '../controllers/categoriesControllers.js';

const router = express.Router();

router.get('/', ctrlWrapper(fetchCategories));

export default router;
