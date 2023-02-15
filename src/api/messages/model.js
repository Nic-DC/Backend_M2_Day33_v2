import mongoose from "mongoose";
const { Schema, model } = mongoose;

const MessageSchema = new Schema(
  {
    sender: { type: String, required: true },
    text: { type: String, required: true },
    // createdAt: { type: Date, required: true },
    createdAt: {
      type: String,
      default: () =>
        new Date().toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
    },
    id: { type: String, required: false },
  },
  { timestamps: false }
);
MessageSchema.pre("save", function (next) {
  if (this.createdAt) {
    const formattedDate = new Date(this.createdAt).toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    console.log("formattedDate: ", formattedDate);
    this.createdAt = formattedDate;
    console.log("this.createdAt: ", this.createdAt);
  }
  console.log("THIS from the MessageSchema: ", this);
  next();
});

export default model("Message", MessageSchema);
