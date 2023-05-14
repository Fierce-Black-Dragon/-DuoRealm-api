import mongoose, { Schema, Document, InferSchemaType } from "mongoose";
const personalMessageSchema = new Schema(
  {
    sender: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["Text", "Media", "Document", "Link"],
    },
    content: { type: String, trim: true },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    chatId: { type: mongoose.Types.ObjectId, ref: "Chat", required: true },
    user: { type: mongoose.Types.ObjectId, ref: "User" }, // Add this field for user reference
  },
  { timestamps: true }
);

const PesonalMessage = mongoose.model("PesonalMessage", personalMessageSchema);
export default PesonalMessage;
