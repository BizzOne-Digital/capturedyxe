import mongoose, { Schema, models, model } from "mongoose";

const InclusionSchema = new Schema(
  {
    label: { type: String, required: true },
    needsClientConfirmation: { type: Boolean, default: false },
    publiclyVisible: { type: Boolean, default: true },
  },
  { _id: false }
);

const PackageSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    tier: {
      type: String,
      enum: ["standard", "signature", "elite"],
      required: true,
    },
    priceCents: { type: Number, required: true },
    durationHours: { type: Number, required: true },
    inclusions: [InclusionSchema],
    confirmationNotes: { type: String, default: "" },
    shortDescription: { type: String, default: "" },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    showPricePublicly: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Package = models.Package || model("Package", PackageSchema);
