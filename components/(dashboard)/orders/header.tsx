"use client";

import Link from "next/link";
import { PlusCircle, Wallet } from "lucide-react";

export function OrderHeader({
  credit,
}: {
  credit: { limit: number; balance: number };
}) {
  return (
    <div className="flex justify-between items-center flex-wrap gap-4">
      <div className="flex items-center gap-8">
        <h1 className="text-xl font-semibold text-gray-800">Orders</h1>

        {credit && (
          <div className="flex items-center gap-3 bg-gray-100 px-3 py-2 rounded-lg text-sm">
            <Wallet size={16} className="text-gray-600" />
            <span className="text-gray-700">
              Balance: <strong>R{credit.balance}</strong> / Limit:{" "}
              <strong>R{credit.limit}</strong>
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
