"use client";

import { Wallet, TrendingUp, AlertCircle } from "lucide-react";

interface CreditCardProps {
  debitBalance: number;
  availableCredit: number;
  totalBalance: number;
  utilizationPercentage: number;
}

export function CreditCard({
  debitBalance,
  availableCredit,
  totalBalance,
  utilizationPercentage,
}: CreditCardProps) {
  const isHighUtilization = utilizationPercentage > 80;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Available Balance</p>
          <p className="text-2xl font-bold text-gray-900">
            R {totalBalance.toFixed(2)}
          </p>
        </div>
        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
          <Wallet size={24} className="text-green-600" />
        </div>
      </div>
      <div className="mt-3 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Debit Balance:</span>
          <span className="font-medium">R {debitBalance.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Available Credit:</span>
          <span className="font-medium">R {availableCredit.toFixed(2)}</span>
        </div>
        <div className="mt-2">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Credit Used</span>
            <span>{utilizationPercentage.toFixed(0)}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${isHighUtilization ? "bg-red-500" : "bg-green-500"}`}
              style={{ width: `${utilizationPercentage}%` }}
            />
          </div>
        </div>
        {isHighUtilization && (
          <div className="flex items-center gap-1 text-xs text-red-600 mt-2">
            <AlertCircle size={12} />
            <span>Credit limit is highly utilized</span>
          </div>
        )}
      </div>
    </div>
  );
}
