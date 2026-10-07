import mongoose, { Schema, models, model } from "mongoose";

const TeamMemberSchema = new Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    biography: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const TeamMember =
  models.TeamMember || model("TeamMember", TeamMemberSchema);
