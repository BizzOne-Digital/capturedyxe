import mongoose, { Schema, models, model } from "mongoose";

const InquirySchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    eventType: { type: String, required: true },
    eventDate: { type: Date },
    message: { type: String, required: true },
    sourcePage: { type: String, default: "/contact" },
    status: {
      type: String,
      enum: ["new", "contacted", "closed"],
      default: "new",
    },
    internalNotes: { type: String, default: "" },
    idempotencyKey: { type: String, unique: true, sparse: true },
    notificationSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

InquirySchema.index({ createdAt: -1 });
InquirySchema.index({ status: 1 });

export const Inquiry = models.Inquiry || model("Inquiry", InquirySchema);
