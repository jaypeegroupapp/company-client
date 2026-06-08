"use client";

import { Wallet, CreditCard } from "lucide-react";

interface PaymentBreakdownProps {
  total: number;
  debitAmount: number;
  hasSufficientDebit: boolean;
  debitToUse: number;
  remainingAfterDebit: number;
  needsPaymentGateway: boolean;
}

export function PaymentBreakdown({
  total,
  debitAmount,
  hasSufficientDebit,
  debitToUse,
  remainingAfterDebit,
  needsPaymentGateway,
}: PaymentBreakdownProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3 shadow-sm">
      <h3 className="font-medium text-gray-900 mb-3">Payment Breakdown</h3>

      <div className="space-y-2">
        <div className="flex justify-between items-center py-2">
          <div className="flex items-center gap-2">
            <Wallet size={16} className="text-gray-500" />
            <p className="text-sm text-gray-700">Total Amount:</p>
          </div>
          <p className="text-lg font-semibold text-gray-900">
            R {total.toFixed(2)}
          </p>
        </div>

        <div className="flex justify-between items-center py-2 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <Wallet size={16} className="text-blue-500" />
            <p className="text-sm text-gray-700">Debit Balance Available:</p>
          </div>
          <p className="text-md font-medium text-gray-900">
            R {debitAmount.toFixed(2)}
          </p>
        </div>

        {!hasSufficientDebit && (
          <div className="flex justify-between items-center py-2 bg-orange-50 rounded-lg px-3">
            <p className="text-sm text-orange-700">Debit to be used:</p>
            <p className="text-md font-bold text-orange-700">
              R {debitToUse.toFixed(2)}
            </p>
          </div>
        )}

        {needsPaymentGateway && (
          <div className="flex justify-between items-center py-2 bg-blue-50 rounded-lg px-3">
            <div className="flex items-center gap-2">
              <CreditCard size={16} className="text-blue-600" />
              <p className="text-sm text-blue-700">Remaining to Pay:</p>
            </div>
            <p className="text-md font-bold text-blue-700">
              R {remainingAfterDebit.toFixed(2)}
            </p>
          </div>
        )}

        {hasSufficientDebit && (
          <div className="flex justify-between items-center py-2 bg-green-50 rounded-lg px-3">
            <p className="text-sm text-green-700">
              Full amount covered by debit:
            </p>
            <p className="text-md font-bold text-green-700">
              R {total.toFixed(2)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
