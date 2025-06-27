import { model, Schema } from 'mongoose';

const recipesSchema = new Schema({});

export const Recipe = model('recipes', recipesSchema);
