import { model, Schema } from 'mongoose';

const recipeSchema = new Schema({
  name: String,
  ingredients: [{ id: String, measure: String }],
});

export const Recipe = model('recipes', recipeSchema);
