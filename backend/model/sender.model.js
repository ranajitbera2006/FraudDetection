import mongoose from "mongoose";
const senderScema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    senderPhone: {
      type: String,
      required: true,
    },
    receiverPhone: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    preBalance: {
      type: String,
      required: true,
    },
    tranction: {
      type: String,
      required: true,
      enum: ["payment", "transfer"],
    },
  },
  { timestamps: true },
);
export const Sender = mongoose.model("Sender", senderScema);
