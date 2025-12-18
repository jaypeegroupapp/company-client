import { ICompanyCredit } from "@/definitions/company-credit";
import { Wallet } from "lucide-react";
import React from "react";

const CreditBalance = ({
  debit,
  selectedMine,
}: {
  debit: { debitAmount: number };
  selectedMine: ICompanyCredit | null;
}) => {
  const creditBalance = selectedMine
    ? selectedMine.creditLimit - selectedMine.usedCredit
    : null;

  return (
    <div className="flex items-center gap-3 bg-gray-100 px-3 py-2 rounded-lg text-sm">
      <Wallet size={16} className="text-gray-600" />
      <span className="text-gray-700">
        Debit Balance: <strong>R{debit.debitAmount}</strong>
        {creditBalance !== null && (
          <>
            / Credit Balance: <strong>R{creditBalance}</strong>
          </>
        )}
      </span>
    </div>
  );
};

export default CreditBalance;
