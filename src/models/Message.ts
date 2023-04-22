import mongoose, { Schema, Document, InferSchemaType } from "mongoose";

const personalMessageSchema = new Schema(
  {
    sender: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["Text", "Media", "Document", "Link"],
    },
    created_at: {
      type: Date,
      default: Date.now(),
    },
    content: { type: String, trim: true },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    chatId: { type: mongoose.Types.ObjectId, ref: "Chat", required: true },
  },
  { timestamps: true }

  // more fields will be added when required
);

const PesonalMessage = mongoose.model("PesonalMessage", personalMessageSchema);
export default PesonalMessage;
