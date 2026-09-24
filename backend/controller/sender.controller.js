import { Sender } from "../model/sender.model.js";

export const SenderController = async (req, res) => {
  try {
    const {
      fullname,
      senderPhone,
      receiverPhone,
      amount,
      preBalance,
      transaction,
    } = req.body;
    if (
      !fullname ||
      !senderPhone ||
      !receiverPhone ||
      !amount ||
      !preBalance ||
      !transaction
    ) {
      return res
        .status(400)
        .json({ error: "Please fill the required feilds!" });
    }

    if (
      transaction.toLowerCase() !== "payment" &&
      transaction.toLowerCase() !== "transfer"
    ) {
      return res.status(400).json({ error: "Please choose from below!" });
    }
    const newSender = new Sender({
      fullname,
      senderPhone,
      receiverPhone,
      amount,
      preBalance,
      transaction,
    });
    if (!newSender) {
      return res.status(404).json({ error: "Please enter your details!" });
    }
    await newSender.save();
    return res.status(200).json({ message: "Wait for checking..." });
  } catch (error) {
    console.log("Error in SenderController ", error.message);
    return res.status(500).json({ error: "Internal server error!" });
  }
};
