"use client";

import { Wallet } from "lucide-react";
import { ICompanyCredit } from "@/definitions/company-credit";

interface CreditBalanceProps {
  debit: { debitAmount: number };
  selectedMine: ICompanyCredit | null;
}

export default function CreditBalance({
  debit,
  selectedMine,
}: CreditBalanceProps) {
  const creditBalance = selectedMine
    ? selectedMine.creditLimit - selectedMine.usedCredit
    : null;

  return (
    <div className="flex items-center gap-3 bg-gray-100 px-3 py-2 rounded-lg text-sm">
      <Wallet size={16} className="text-gray-600" />
      <span className="text-gray-700">
        Debit Balance: <strong>R{debit.debitAmount.toFixed(2)}</strong>
        {creditBalance !== null && (
          <>
            {" "}
            / Credit Balance: <strong>R{creditBalance.toFixed(2)}</strong>
          </>
        )}
      </span>
    </div>
  );
}
