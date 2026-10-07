import mongoose, { Schema, models, model } from "mongoose";

const AddOnSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    priceCents: { type: Number, required: true },
    description: { type: String, default: "" },
    needsClientConfirmation: { type: Boolean, default: true },
    active: { type: Boolean, default: true },
    showPricePublicly: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const AddOn = models.AddOn || model("AddOn", AddOnSchema);
