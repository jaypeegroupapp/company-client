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
    <div className="flex sm:items-center sm:justify-center gap-3 bg-gray-100 px-4 sm:px-3 py-2 rounded-lg text-sm">
      <Wallet size={16} className="mt-1 text-gray-600" />
      <span className="hidden sm:block text-gray-700">
        Debit Balance: <strong>R{debit.debitAmount.toFixed(2)}</strong>
        {creditBalance !== null && (
          <>
            {" "}
            / Credit Balance: <strong>R{creditBalance.toFixed(2)}</strong>
          </>
        )}
      </span>
      <div className="sm:hidden flex flex-col">
        <span className="text-gray-700">
          Debit Balance: <strong>R{debit.debitAmount.toFixed(2)}</strong>
        </span>
        <span className="text-gray-700">
          {creditBalance !== null && (
            <>
              Credit Balance: <strong>R{creditBalance.toFixed(2)}</strong>
            </>
          )}
        </span>
      </div>
    </div>
  );
}
