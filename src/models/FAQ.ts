import mongoose, { Schema, models, model } from "mongoose";

const FAQSchema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: {
      type: String,
      enum: [
        "booking",
        "booth-experience",
        "prints-keepsakes",
        "event-planning",
      ],
      required: true,
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

FAQSchema.index({ status: 1, category: 1, order: 1 });

export const FAQ = models.FAQ || model("FAQ", FAQSchema);
