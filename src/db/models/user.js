import { model, Schema } from 'mongoose';

const usersSchema = new Schema(
  {
    name: { type: String, required: true, maxlength: 16, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      maxlength: 128,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: { type: String, required: true, minlength: 8, maxlength: 128 },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

usersSchema.method.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const UserCollection = model('users', usersSchema);
