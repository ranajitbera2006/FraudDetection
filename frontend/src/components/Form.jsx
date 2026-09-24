import React, { useState } from "react";
// import useFraudCheck from "../../hooks/useFraudCheck";
import toast from "react-hot-toast";
import { MdCurrencyRupee } from "react-icons/md";
import useFraudCheck from "../hooks/useFraudCheck";
const Form = () => {
  const { loading, fraudCheck } = useFraudCheck();
  const [fullname, setFullname] = useState("");
  const [transaction, setTransaction] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [preBalance, setpreBalance] = useState("");
  const [amount, setAmount] = useState("");
  const [openMenu, setOpenMenu] = useState(false);
  const handletransactionChange = (selectedTransaction) => {
    setTransaction(selectedTransaction);
    setOpenMenu(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await fraudCheck({
      fullname,
      transaction,
      senderPhone,
      receiverPhone,
      preBalance,
      amount,
    });
    if (success) {
      setFullname("");
      setTransaction("");
      setSenderPhone("");
      setReceiverPhone("");
      setpreBalance("");
      setAmount("");
      toast.success("Your data successfully! Wait for checking...");
    }
  };

  return (
    <div className="gradient-background min-h-screen ">
      <div className="min-h-screen flex justify-center items-center">
        <form onSubmit={handleSubmit}>
          <div className=" p-5 rounded-2xl space-y-4 shadow-mauve-950 shadow-xl">
            <div className="pt-7">
              <h1 className="text-center font-bold text-2xl pb-2">
                Check Here is it fraud or not
              </h1>
            </div>

            <div className="border py-3 w-full max-w-md rounded-xl">
              <input
                onChange={(e) => setFullname(e.target.value)}
                value={fullname}
                name="fullname"
                id="fullname"
                type="text"
                placeholder="Enter fullname..."
                required
                className="w-full px-2 focus:outline-none"
              />
            </div>
            <div className="border py-3 w-full max-w-md rounded-xl">
              <input
                onChange={(e) => setSenderPhone(e.target.value)}
                value={senderPhone}
                name="senderPhone"
                id="senderPhone"
                type="number"
                placeholder="Enter Your Phone Number..."
                required
                className="w-full px-2 focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </div>
            <div className="border py-3 w-full max-w-md rounded-xl">
              <input
                onChange={(e) => setReceiverPhone(e.target.value)}
                value={receiverPhone}
                name="receiverPhone"
                id="receiverPhone"
                type="number"
                placeholder="Enter Receiver Phone Number..."
                required
                className="w-full px-2 focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </div>
            <div className="border py-3 flex items-center px-2 w-full max-w-md rounded-xl">
              <MdCurrencyRupee />
              <input
                onChange={(e) => setpreBalance(e.target.value)}
                value={preBalance}
                name="preBalance"
                id="preBalance"
                type="number"
                placeholder="Enter Your Previous bank amount..."
                required
                className="w-full px-2 focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </div>
            <div className="border py-3 flex items-center px-2 w-full max-w-md rounded-xl">
              <MdCurrencyRupee />
              <input
                onChange={(e) => setAmount(e.target.value)}
                value={amount}
                name="amount"
                id="amount"
                type="number"
                placeholder="Enter amount to be send..."
                required
                className="w-full px-2 focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </div>
            <div className="border w-full max-w-md flex justify-between  rounded-xl relative items-center px-2">
              <span className="text-gray-500 text-sm">
                Select transaction type:{" "}
                <span className="text-white capitalize">
                  {transaction || "Not selected"}
                </span>
              </span>

              <button
                type="button"
                className="btn btn-sm m-1"
                onClick={() => setOpenMenu((prev) => !prev)}
              >
                {transaction ? transaction.toUpperCase() : "Select"} ⬇️
              </button>
              {openMenu && (
                <ul className="absolute right-0 top-full mt-1 w-36 rounded-box bg-base-100 p-2 shadow-lg border z-50">
                  <li>
                    <button
                      type="button"
                      className="w-full text-left px-3 py-2 hover:bg-background rounded"
                      onClick={() => handletransactionChange("payment")}
                    >
                      Payment
                    </button>
                  </li>

                  <li>
                    <button
                      type="button"
                      className="w-full text-left px-3 py-2 hover:bg-background rounded"
                      onClick={() => handletransactionChange("transfer")}
                    >
                      Transfer
                    </button>
                  </li>
                </ul>
              )}
            </div>
            <div className="flex justify-between">
              <button type="submit" className="btn btn-success">
                {loading ? (
                  <div className="loading loading-spinner" />
                ) : (
                  "Check"
                )}
              </button>
              <button type="submit" className="btn btn-primary">
                {loading ? (
                  <div className="loading loading-spinner" />
                ) : (
                  "Probability"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
