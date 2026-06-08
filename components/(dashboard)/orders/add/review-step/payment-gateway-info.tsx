"use client";

import { CreditCard, Shield, Clock } from "lucide-react";

interface PaymentGatewayInfoProps {
  needsPaymentGateway: boolean;
  debitAmount: number;
  remainingAfterDebit: number;
}

export function PaymentGatewayInfo({
  needsPaymentGateway,
  debitAmount,
  remainingAfterDebit,
}: PaymentGatewayInfoProps) {
  if (!needsPaymentGateway) return null;

  return (
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <CreditCard size={20} className="text-orange-600 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium text-orange-800">
            Partial Payment Required
          </p>
          <p className="text-xs text-orange-700 mt-1">
            Your debit balance of R {debitAmount.toFixed(2)} will be used first.
            The remaining amount of R {remainingAfterDebit.toFixed(2)} needs to
            be paid via credit card or EFT.
          </p>

          <div className="mt-3 flex flex-wrap gap-4">
            <div className="flex items-center gap-1">
              <Shield size={12} className="text-orange-600" />
              <span className="text-xs text-orange-700">Secure payment</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={12} className="text-orange-600" />
              <span className="text-xs text-orange-700">
                Instant confirmation
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
