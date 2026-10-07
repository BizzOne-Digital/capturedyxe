import { Schema, models, model } from "mongoose";

const ServiceSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    summary: { type: String, required: true },
    description: { type: String, required: true },
    features: [{ type: String }],
    audience: {
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
    imageUrl: { type: String, default: "" },
    imageAlt: { type: String, default: "" },
    order: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
  },
  { timestamps: true }
);

ServiceSchema.index({ status: 1, order: 1 });

export const Service = models.Service || model("Service", ServiceSchema);
