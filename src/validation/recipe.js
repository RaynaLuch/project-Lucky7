import Joi from 'joi';

export const addRecipeSchema = Joi.object({
  title: Joi.string().required().messages({
    'any.required': 'There must be a recipe title.',
    'string.base': 'Recipe title must be a string',
  }),
  description: Joi.string().required(),
  favorite: Joi.boolean(),
  time: Joi.string().required(),
  calories: Joi.number().required(),
  category: Joi.string().valid('Beef', 'Dessert').required(),
  instructions: Joi.string().required(),
});
