import { Schema, models, model } from "mongoose";

const SiteSettingsSchema = new Schema(
  {
    singletonKey: { type: String, default: "main", unique: true },
    email: { type: String, default: "capturedyxe@outlook.com" },
    phone: { type: String, default: "+1 639 480 6206" },
    phoneTel: { type: String, default: "tel:+16394806206" },
    serviceArea: {
      type: String,
      default:
        "Saskatoon, Saskatchewan and surrounding areas by arrangement.",
    },
    instagramUrl: { type: String, default: "" },
    facebookUrl: { type: String, default: "" },
    logoUrl: { type: String, default: "/logo/Captured-yxe-lockup.png" },
    tagline: { type: String, default: "VINTAGE SOUL, INSTANT ROLL" },
    startingPriceCents: { type: Number, default: 40000 },
    showPublicPackagePrices: { type: Boolean, default: false },
    siteName: { type: String, default: "Captured.YXE" },
    defaultSeoTitle: {
      type: String,
      default: "Captured.YXE | Saskatoon Photo Booth Rentals",
    },
    defaultSeoDescription: {
      type: String,
      default:
        "Saskatoon's go-to photo booth experience for weddings, corporate events, and celebrations. Capture Moments into Memories.",
    },
    headline: { type: String, default: "Capture Moments into Memories." },
    subheadline: {
      type: String,
      default:
        "Saskatoon's go-to photo booth experience for weddings, corporate events, and celebrations.",
    },
    heroImageUrl: {
      type: String,
      default: "/hero-booth.jpg",
    },
    ctaPrimaryLabel: { type: String, default: "Check Availability" },
    ctaSecondaryLabel: { type: String, default: "Explore the Experience" },
  },
  { timestamps: true }
);

export const SiteSettings =
  models.SiteSettings || model("SiteSettings", SiteSettingsSchema);
