import { model, Schema } from 'mongoose';

const categorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
  },
  { timestamps: false, versionKey: false },
);

export const Category = model('categories', categorySchema);
