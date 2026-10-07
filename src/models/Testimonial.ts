import mongoose, { Schema, models, model } from "mongoose";

const TestimonialSchema = new Schema(
  {
    reviewerName: { type: String, required: true },
    quote: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5 },
    eventCategory: {
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
    eventDate: { type: Date },
    order: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
  },
  { timestamps: true }
);

export const Testimonial =
  models.Testimonial || model("Testimonial", TestimonialSchema);
