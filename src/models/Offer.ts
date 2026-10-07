import mongoose, { Schema, models, model } from "mongoose";

const OfferSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    percentageOff: { type: Number, default: 10 },
    eligibility: { type: String, default: "" },
    notes: { type: String, default: "" },
    startsAt: { type: Date },
    endsAt: { type: Date },
    visible: { type: Boolean, default: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Offer = models.Offer || model("Offer", OfferSchema);
