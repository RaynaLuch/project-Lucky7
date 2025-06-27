import { model, Schema } from 'mongoose';

const recipeSchema = new Schema({
  name: String,
  ingredients: [String],
});

export const Recipe = model('recipes', recipeSchema);