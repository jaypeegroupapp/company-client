import { Wallet } from "lucide-react";
import React from "react";

const CreditBalance = ({
  credit,
}: {
  credit: { limit: number; balance: number };
}) => {
  return (
    <div className="flex items-center gap-3 bg-gray-100 px-3 py-2 rounded-lg text-sm">
      <Wallet size={16} className="text-gray-600" />
      <span className="text-gray-700">
        Balance: <strong>R{credit.balance}</strong> / Credit Limit:{" "}
        <strong>R{credit.limit}</strong>
      </span>
    </div>
  );
};

export default CreditBalance;
