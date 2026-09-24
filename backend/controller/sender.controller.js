import { spawn } from "node:child_process";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { Sender } from "../model/sender.model.js";

const isValidPhoneNumber = (value) => {
  if (!value) return false;
  return /^[6-9]\d{9}$/.test(String(value).trim());
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../../");
const pythonScript = path.resolve(projectRoot, "src/Main/predictor.py");

const getPythonCommand = () => {
  if (process.env.PYTHON_PATH) return process.env.PYTHON_PATH;
  if (fs.existsSync("/usr/local/bin/python3")) return "/usr/local/bin/python3";
  if (fs.existsSync("/usr/bin/python3")) return "/usr/bin/python3";
  return "python";
};

const getFraudPrediction = async (transactionData) => {
  return new Promise((resolve, reject) => {
    const pythonCommand = getPythonCommand();
    const pythonProcess = spawn(pythonCommand, [pythonScript], {
      cwd: projectRoot,
    });

    let stdout = "";
    let stderr = "";

    pythonProcess.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    pythonProcess.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    pythonProcess.on("error", (error) => {
      reject(error);
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(stderr || "Prediction failed"));
        return;
      }

      try {
        const result = JSON.parse(stdout.trim());
        resolve(result);
      } catch (error) {
        reject(new Error("Failed to parse fraud prediction"));
      }
    });

    pythonProcess.stdin.write(JSON.stringify(transactionData));
    pythonProcess.stdin.end();
  });
};

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

    if (!isValidPhoneNumber(senderPhone)) {
      return res.status(400).json({
        error:
          "Sender phone number is invalid. Use 10 digits starting with 6-9.",
      });
    }

    if (!isValidPhoneNumber(receiverPhone)) {
      return res.status(400).json({
        error:
          "Receiver phone number is invalid. Use 10 digits starting with 6-9.",
      });
    }

    if (String(senderPhone).trim() === String(receiverPhone).trim()) {
      return res.status(400).json({
        error: "Sender and receiver phone numbers cannot be the same.",
      });
    }

    const numericAmount = Number(amount);
    const numericPreBalance = Number(preBalance);
    const currentHour = new Date().getHours();
    const senderBalanceAfter = Math.max(numericPreBalance - numericAmount, 0);

    const transactionData = {
      step: 1,
      amount: numericAmount,
      oldbalanceOrg: numericPreBalance,
      newbalanceOrig: senderBalanceAfter,
      oldbalanceDest: 0,
      newbalanceDest: numericAmount,
      hour: currentHour,
      is_night: currentHour < 6 ? 1 : 0,
      sender_balance_change: numericAmount,
      receiver_balance_change: numericAmount,
      orig_balance_zero: numericPreBalance === 0 ? 1 : 0,
      dest_balance_zero: 1,
      type_TRANSFER: transaction.toLowerCase() === "transfer" ? 1 : 0,
    };

    const prediction = await getFraudPrediction(transactionData);

    const newSender = new Sender({
      fullname,
      senderPhone,
      receiverPhone,
      amount: numericAmount,
      preBalance: String(numericPreBalance),
      transaction,
    });
    if (!newSender) {
      return res.status(404).json({ error: "Please enter your details!" });
    }
    await newSender.save();

    return res.status(200).json({
      message: prediction.isFraud
        ? "Suspicious transaction detected."
        : "Transaction looks safe.",
      isFraud: prediction.isFraud,
      probability: prediction.probability,
    });
  } catch (error) {
    console.log("Error in SenderController ", error.message);
    return res.status(500).json({
      error: "Internal server error!",
      details: error.message,
    });
  }
};
