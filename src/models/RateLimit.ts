import mongoose, { Schema, models, model } from "mongoose";

const RateLimitSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    count: { type: Number, default: 1 },
    windowStart: { type: Date, required: true },
  },
  { timestamps: true }
);

RateLimitSchema.index({ windowStart: 1 }, { expireAfterSeconds: 3600 });

export const RateLimit = models.RateLimit || model("RateLimit", RateLimitSchema);
