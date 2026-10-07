import mongoose, { Schema, models, model } from "mongoose";

const PageContentSchema = new Schema(
  {
    pageKey: { type: String, required: true, unique: true },
    title: { type: String, default: "" },
    introduction: { type: String, default: "" },
    heroImageUrl: { type: String, default: "" },
    ctaLabel: { type: String, default: "" },
    ctaHref: { type: String, default: "/booking" },
    extra: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export const PageContent =
  models.PageContent || model("PageContent", PageContentSchema);
