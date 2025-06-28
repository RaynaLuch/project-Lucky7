import { Schema, model } from 'mongoose';

const RecipesSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    description: {
      type: String,
      required: true,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    time: {
      type: String,
      required: true,
    },
    calories: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['Beef', 'Dessert'],
      default: 'Beef',
      required: true,
    },
    ingredients: [{ id: String, measure: String }],
    instructions: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  { versionKey: false, timestamps: true },
);

export const recipesSortFields = [
  'title',
  'ingredients',
  'favorite',
  'category',
];

const RecipeCollection = model('recipes', RecipesSchema);

export default RecipeCollection;
