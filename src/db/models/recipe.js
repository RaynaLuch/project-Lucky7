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
    thumb: {
      type: String,
      required: false,
      default:
        'https://ftp.goit.study/img/so-yummy/preview/Summer%20Pistou.jpg',
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
