import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { fetchIngredients } from '../controllers/ingredientsController.js';

const router = express.Router();

router.get('/', ctrlWrapper(fetchIngredients));

export default router;
