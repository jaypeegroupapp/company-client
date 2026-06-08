"use client";

import { CreditCard, CheckCircle } from "lucide-react";

interface ActionButtonsProps {
  needsPaymentGateway: boolean;
  collectionDate: string;
  loading: boolean;
  paymentLoading: boolean;
  remainingAfterDebit: number;
  onBack: () => void;
  onSubmit: () => void;
  onPaymentGateway: () => void;
}

export function ActionButtons({
  needsPaymentGateway,
  collectionDate,
  loading,
  paymentLoading,
  remainingAfterDebit,
  onBack,
  onSubmit,
  onPaymentGateway,
}: ActionButtonsProps) {
  const isDisabled = !collectionDate;
  const isDateSelected = !!collectionDate;

  return (
    <div className="pt-4 flex justify-between gap-3">
      <button
        onClick={onBack}
        disabled={loading || paymentLoading}
        className="px-6 py-2 rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-100 transition disabled:opacity-50"
      >
        Back
      </button>

      <div className="flex gap-3">
        {needsPaymentGateway ? (
          <button
            disabled={isDisabled || paymentLoading}
            onClick={onPaymentGateway}
            className={`px-6 py-2 rounded-lg text-white font-medium transition flex items-center gap-2 ${
              isDisabled || paymentLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-600 hover:bg-orange-700"
            }`}
          >
            {paymentLoading ? (
              "Processing..."
            ) : (
              <>
                <CreditCard size={16} />
                Pay R {remainingAfterDebit.toFixed(2)}
              </>
            )}
          </button>
        ) : (
          <button
            disabled={isDisabled || loading}
            onClick={onSubmit}
            className={`px-6 py-2 rounded-lg text-white font-medium transition flex items-center gap-2 ${
              isDisabled || loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gray-900 hover:bg-black"
            }`}
          >
            {loading ? (
              "Processing..."
            ) : (
              <>
                <CheckCircle size={16} />
                Confirm Order
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
