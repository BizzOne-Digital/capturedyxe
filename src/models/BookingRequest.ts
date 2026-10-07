import { Schema, models, model } from "mongoose";

const PackageSnapshotSchema = new Schema(
  {
    packageId: String,
    name: String,
    priceCents: Number,
    durationHours: Number,
  },
  { _id: false }
);

const AddOnSnapshotSchema = new Schema(
  {
    addOnId: String,
    name: String,
    priceCents: Number,
  },
  { _id: false }
);

const BookingRequestSchema = new Schema(
  {
    eventType: { type: String, required: true },
    eventDate: { type: Date, required: true },
    eventTimeLocal: { type: String, required: true },
    timezone: { type: String, default: "America/Regina" },
    venueName: { type: String, default: "" },
    venueAddress: { type: String, default: "" },
    venueNotConfirmed: { type: Boolean, default: false },
    guestCount: { type: Number },
    packageHelp: { type: Boolean, default: false },
    packageSnapshot: PackageSnapshotSchema,
    addOnSnapshots: [AddOnSnapshotSchema],
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    notes: { type: String, default: "" },
    status: {
      type: String,
      enum: [
        "new",
        "contacted",
        "awaiting_confirmation",
        "confirmed",
        "completed",
        "cancelled",
      ],
      default: "new",
    },
    internalNotes: { type: String, default: "" },
    sourcePage: { type: String, default: "/booking" },
    idempotencyKey: { type: String, unique: true, sparse: true },
    notificationSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

BookingRequestSchema.index({ createdAt: -1 });
BookingRequestSchema.index({ status: 1 });
BookingRequestSchema.index({ eventDate: 1 });

export const BookingRequest =
  models.BookingRequest || model("BookingRequest", BookingRequestSchema);
