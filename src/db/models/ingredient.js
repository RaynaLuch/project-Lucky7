import { model, Schema } from 'mongoose';

const ingredientSchema = new Schema(
  {
    _id: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true, trim: true },
  },
  { timestamps: false, versionKey: false },
);

export const Ingredient = model('ingredients', ingredientSchema);
