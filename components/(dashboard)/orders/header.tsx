"use client";

import Link from "next/link";
import { PackageCheck, PlusCircle, Wallet } from "lucide-react";

export function OrderHeader({
  debit,
}: {
  debit: { debitAmount: number; usedDebit: number };
}) {
  const balance = debit.debitAmount - debit.usedDebit;

  return (
    <div className="flex justify-between items-center flex-wrap gap-4">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <PackageCheck className="w-6 h-6 text-gray-700" />
          <h1 className="text-xl font-semibold text-gray-800">Orders</h1>
        </div>

        {debit && (
          <div className="flex items-center gap-3 bg-gray-100 px-3 py-2 rounded-lg text-sm">
            <Wallet size={16} className="text-gray-600" />
            <span className="text-gray-700">
              Debit Balance: <strong>R{balance}</strong>
            </span>
          </div>
        )}
      </div>

      <Link
        href="/orders/add"
        className="flex items-center gap-2 bg-gray-900 text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition"
      >
        <PlusCircle size={18} />
        Add Order
      </Link>
    </div>
  );
}
