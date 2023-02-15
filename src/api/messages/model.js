import mongoose from "mongoose";
const { Schema, model } = mongoose;

const MessageSchema = new Schema(
  {
    sender: { type: String, required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, required: false },
    id: { type: String, required: false },
  },
  { timestamps: true }
);

export default model("Message", MessageSchema);
