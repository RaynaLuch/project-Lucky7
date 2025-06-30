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
      default: 'Beef',
      required: true,
    },
    ingredients: [{ id: Schema.Types.ObjectId, measure: String }],
    instructions: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    photoUrl: {
      type: String,
      required: false,
      default: null,
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
