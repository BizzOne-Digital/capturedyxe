import mongoose, { Schema, models, model } from "mongoose";

const MediaAssetSchema = new Schema(
  {
    url: { type: String, required: true },
    cloudinaryPublicId: { type: String, required: true },
    alt: { type: String, default: "" },
    folder: { type: String, default: "captured-yxe" },
    bytes: { type: Number },
    format: { type: String },
    width: { type: Number },
    height: { type: Number },
  },
  { timestamps: true }
);

export const MediaAsset =
  models.MediaAsset || model("MediaAsset", MediaAssetSchema);
