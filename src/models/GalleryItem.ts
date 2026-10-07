import { Schema, models, model } from "mongoose";

const GalleryItemSchema = new Schema(
  {
    imageUrl: { type: String, required: true },
    cloudinaryPublicId: { type: String, default: "" },
    alt: { type: String, required: true },
    caption: { type: String, default: "" },
    category: {
      type: String,
      enum: [
        "wedding",
        "corporate",
        "milestone",
        "product-launch",
        "school",
        "festival",
        "general",
      ],
      default: "general",
    },
    designation: {
      type: String,
      enum: ["event", "inspiration"],
      default: "inspiration",
    },
    order: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
  },
  { timestamps: true }
);

export const GalleryItem =
  models.GalleryItem || model("GalleryItem", GalleryItemSchema);
