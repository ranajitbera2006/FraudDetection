import { useState } from "react";
import toast from "react-hot-toast";

const API_BASE = import.meta.env.VITE_API_URL || "";
const getApiUrl = () => {
  if (API_BASE)
    return `${API_BASE.replace(/\/$/, "")}/api/sender/sender-details`;
  return "/api/sender/sender-details";
};

const isValidPhoneNumber = (value) => {
  if (!value) return false;
  const normalized = String(value).trim();
  return /^[6-9]\d{9}$/.test(normalized);
};

const useFraudCheck = () => {
  const [loading, setLoading] = useState(false);

  const fraudCheck = async ({
    fullname,
    transaction,
    senderPhone,
    receiverPhone,
    preBalance,
    amount,
  }) => {
    if (
      !fullname ||
      !transaction ||
      !senderPhone ||
      !receiverPhone ||
      !preBalance ||
      !amount
    ) {
      toast.error("Please fill the required fields!");
      return null;
    }

    if (!isValidPhoneNumber(senderPhone)) {
      toast.error(
        "Sender phone number is invalid. Use 10 digits starting with 6-9.",
      );
      return null;
    }

    if (!isValidPhoneNumber(receiverPhone)) {
      toast.error(
        "Receiver phone number is invalid. Use 10 digits starting with 6-9.",
      );
      return null;
    }

    if (String(senderPhone).trim() === String(receiverPhone).trim()) {
      toast.error("Sender and receiver phone numbers cannot be the same.");
      return null;
    }

    if (Number(preBalance) < Number(amount)) {
      toast.error("Insufficient balance.");
      return null;
    }

    setLoading(true);

    try {
      const res = await fetch(getApiUrl(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullname,
          transaction,
          senderPhone,
          receiverPhone,
          preBalance,
          amount,
        }),
      });

      const rawText = await res.text();

      if (!rawText) {
        throw new Error(
          "No response from backend. Check the Render backend URL.",
        );
      }

      let data;
      try {
        data = JSON.parse(rawText);
      } catch {
        throw new Error(
          "The backend did not return JSON. Please check the Render backend URL.",
        );
      }

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      if (data.error) {
        throw new Error(data.error);
      }

      return data;
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "Failed to send data.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, fraudCheck };
};

export default useFraudCheck;
