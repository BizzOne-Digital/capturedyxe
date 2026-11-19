import { Schema, models, model } from "mongoose";

const BrandSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    logoUrl: { type: String, default: "" },
    industry: { type: String, default: "" },
    eventType: { type: String, default: "" },
    location: { type: String, default: "" },
    eventDate: { type: String, default: "" },
    description: { type: String, default: "" },
    websiteUrl: { type: String, default: "" },
    photos: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    visible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Brand = models.Brand || model("Brand", BrandSchema);
