import mongoose, { Schema, models, model } from "mongoose";

const AdminUserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

export type AdminUserDocument = mongoose.InferSchemaType<typeof AdminUserSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const AdminUser =
  models.AdminUser || model("AdminUser", AdminUserSchema);
