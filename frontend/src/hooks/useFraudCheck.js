import { useState } from "react";
import toast from "react-hot-toast";

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
    // Validation
    if (
      !fullname ||
      !transaction ||
      !senderPhone ||
      !receiverPhone ||
      !preBalance ||
      !amount
    ) {
      toast.error("Please fill the required fields!");
      return false;
    }
    if (Number(preBalance) < Number(amount)) {
      toast.error("Insufficient balance.");
      return false;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/sender/sender-details", {
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

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      if (data.error) {
        throw new Error(data.error);
      }
      return true;
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "Failed to send data.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, fraudCheck };
};

export default useFraudCheck;
