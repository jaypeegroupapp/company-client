"use client";

import { useState } from "react";
import { createOrderAction, createPaymentUrlAction } from "@/actions/order";
import { useRouter } from "next/navigation";
import { ITruck } from "@/definitions/truck";
import { IProduct } from "@/definitions/product";
import CreditBalance from "./credit-balance";
import { ICompanyCredit } from "@/definitions/company-credit";
import { Wallet, CreditCard, AlertCircle } from "lucide-react";

export function ReviewStep({
  selectedMine,
  selectedProduct,
  selectedTrucks,
  quantities,
  debit,
  discountAmount,
  isGridPlus,
  collectionDate,
  setCollectionDate,
  onBack,
}: {
  selectedMine: ICompanyCredit | null;
  selectedProduct: IProduct | null;
  selectedTrucks: ITruck[];
  quantities: any;
  debit: { debitAmount: number };
  discountAmount: number;
  isGridPlus: boolean;
  collectionDate: string;
  setCollectionDate: (d: string) => void;
  onBack: () => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!selectedMine || !selectedProduct) {
    return (
      <div className="space-y-4">
        <p className="text-gray-700 text-sm">
          Please complete previous steps before reviewing your order.
        </p>
        <button
          onClick={onBack}
          className="px-6 py-2 rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-100 transition"
        >
          Back
        </button>
      </div>
    );
  }

  const purchasePrice = selectedProduct.grid - (selectedProduct.discount || 0);
  const accountBalance =
    debit.debitAmount + (selectedMine.creditLimit - selectedMine.usedCredit);

  let sellingPrice = 0;

  if (isGridPlus && discountAmount > 0) {
    sellingPrice = selectedProduct.grid + discountAmount;
  } else {
    sellingPrice = selectedProduct.grid - discountAmount;
  }
  const getQuantity = (truckId?: string) =>
    truckId ? Number(quantities?.[truckId] || 0) : 0;

  // 🧮 Compute totals
  const total = selectedTrucks.reduce((acc, truck) => {
    const qty = getQuantity(truck.id);
    return acc + qty * sellingPrice;
  }, 0);

  const totalLitres = selectedTrucks.reduce(
    (acc, truck) => acc + getQuantity(truck.id),
    0,
  );

  const orderItems = selectedTrucks
    .filter((truck) => Boolean(truck.id))
    .map((truck) => ({
      truckId: truck.id,
      quantity: getQuantity(truck.id),
    }));

  // 🚨 BALANCE VALIDATION
  const hasSufficientDebit = total <= debit.debitAmount;
  const debitToUse = Math.min(total, debit.debitAmount);
  const remainingAfterDebit = total - debitToUse;
  const needsPaymentGateway = !hasSufficientDebit && remainingAfterDebit > 0;

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setMessage(null);

      // Only deduct the debit amount from company balance
      const debitPaid = Math.min(total, debit.debitAmount);
      const creditUsed =
        total > debit.debitAmount ? total - debit.debitAmount : 0;

      const orderData = {
        mineId: selectedMine.mineId,
        productId: selectedProduct.id,
        totalAmount: total,
        collectionDate,
        purchasePrice,
        sellingPrice,
        items: orderItems,
        debit: debitPaid,
        credit: creditUsed,
      };

      const formData = new FormData();
      formData.append("orderData", JSON.stringify(orderData));

      const result = await createOrderAction(formData);

      if (result?.message?.toLowerCase().includes("success")) {
        setMessage("✅ Order created successfully!");
        setTimeout(() => {
          setMessage(null);
          router.push("/orders");
        }, 1500);
      } else {
        setMessage(result?.message || "❌ Failed to create order");
      }
    } catch (error) {
      console.error("createOrderAction error:", error);
      setMessage("❌ Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentGateway = async () => {
    try {
      setPaymentLoading(true);
      setMessage(null);

      // Calculate how much needs to be paid via payment gateway
      const debitPaid = Math.min(total, debit.debitAmount);
      const amountToPay = total - debitPaid;
      const creditUsed = 0; // No credit used when using payment gateway

      const orderData = {
        mineId: selectedMine.mineId,
        productId: selectedProduct.id,
        totalAmount: total,
        collectionDate,
        purchasePrice,
        sellingPrice,
        items: orderItems,
        debit: debitPaid,
        credit: creditUsed,
      };

      const formData = new FormData();
      formData.append("orderData", JSON.stringify(orderData));

      // Create order first
      const result = await createOrderAction(formData);

      if (!result?.message?.toLowerCase().includes("success")) {
        setMessage(result?.message || "❌ Failed to create order");

        return;
      }

      // Create payment URL for remaining amount
      const paymentUrl = await createPaymentUrlAction(
        result.orderId!,
        amountToPay,
        selectedProduct.name,
      );

      if (paymentUrl) {
        // Redirect to payment gateway
        window.location.href = paymentUrl;
      } else {
        setMessage("❌ Failed to initialize payment gateway");
      }
    } catch (error) {
      console.error("Payment gateway error:", error);
      setMessage("❌ Unexpected error occurred during payment setup.");
    } finally {
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Review & Confirm
        </h2>
        <CreditBalance debit={debit} selectedMine={selectedMine} />
      </div>

      <div className="border border-gray-200 rounded-xl p-6 space-y-4 bg-gray-50 shadow-sm">
        {/* Mine */}
        <div>
          <h3 className="font-medium text-gray-900">Mine</h3>
          <p className="text-gray-700">{selectedMine.mineName}</p>
        </div>

        {/* Product */}
        <div>
          <h3 className="font-medium text-gray-900">Product</h3>
          <p className="text-gray-700">{selectedProduct.name}</p>
        </div>

        {/* Trucks */}
        <div>
          <h3 className="font-medium text-gray-900">Trucks & Quantities</h3>
          <ul className="space-y-2">
            {selectedTrucks.map((truck, idx) => {
              const quantity = getQuantity(truck.id);
              return (
                <li
                  key={truck.id ?? `truck-${idx}`}
                  className="flex justify-between text-sm text-gray-700 border-b border-gray-200 pb-1"
                >
                  <span>{truck.plateNumber}</span>
                  <span>{quantity} L</span>
                </li>
              );
            })}
          </ul>

          <p className="text-sm text-gray-600 mt-2 border-t border-gray-100 pt-2">
            Total Volume: <strong>{totalLitres} L</strong>
          </p>
        </div>

        {/* Collection Date */}
        <div>
          <div className="flex flex-row item-center gap-1">
            <h3 className="font-medium text-gray-900">Collection Date </h3>
            {collectionDate ? (
              new Date(collectionDate).toLocaleDateString()
            ) : (
              <div className="flex justify-between text-orange-600 font-medium ">
                {" "}
                - Please select a date
              </div>
            )}
          </div>
          <input
            type="date"
            value={collectionDate}
            onChange={(e) => setCollectionDate(e.target.value)}
            className="mt-2 border border-gray-300 rounded-lg px-3 py-2 w-full text-sm text-gray-800 focus:ring-1 focus:ring-gray-700 focus:outline-none"
          />
        </div>

        {/* Payment Breakdown */}
        <div className="pt-4 border-t border-gray-200 space-y-2">
          <div className="flex justify-between">
            <p className="text-sm text-gray-700">Total Amount:</p>
            <p className="text-lg font-semibold text-gray-900">
              R {total.toFixed(2)}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-sm text-gray-700">Debit Balance Available:</p>
            <p className="text-md font-medium text-gray-900">
              R {debit.debitAmount.toFixed(2)}
            </p>
          </div>
          {!hasSufficientDebit && (
            <div className="flex justify-between text-orange-600">
              <p className="text-sm">Debit to be used:</p>
              <p className="text-md font-bold">R {debitToUse.toFixed(2)}</p>
            </div>
          )}
          {needsPaymentGateway && (
            <div className="flex justify-between text-blue-600">
              <p className="text-sm">Remaining to Pay via Gateway:</p>
              <p className="text-md font-bold">
                R {remainingAfterDebit.toFixed(2)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Payment Gateway Info */}
      {needsPaymentGateway && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <CreditCard size={20} className="text-orange-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-orange-800">
                Partial Payment Required
              </p>
              <p className="text-xs text-orange-700 mt-1">
                Your debit balance of R {debit.debitAmount.toFixed(2)} will be
                used first. The remaining amount of R{" "}
                {remainingAfterDebit.toFixed(2)} needs to be paid via credit
                card or EFT.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Status message */}
      {message && (
        <div
          className={`text-center text-sm p-3 rounded-lg ${
            message.includes("✅")
              ? "text-green-600 bg-green-50"
              : "text-red-600 bg-red-50"
          }`}
        >
          {message}
        </div>
      )}

      {/* Buttons */}
      <div className="pt-4 flex justify-between gap-3">
        <button
          onClick={onBack}
          disabled={loading || paymentLoading}
          className="px-6 py-2 rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-100 transition"
        >
          Back
        </button>

        <div className="flex gap-3">
          {needsPaymentGateway ? (
            <button
              disabled={!collectionDate || paymentLoading}
              onClick={handlePaymentGateway}
              className={`px-6 py-2 rounded-lg text-white font-medium transition flex items-center gap-2 ${
                !collectionDate || paymentLoading
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
              disabled={!collectionDate || loading}
              onClick={handleSubmit}
              className={`px-6 py-2 rounded-lg text-white font-medium transition ${
                !collectionDate || loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gray-900 hover:bg-black"
              }`}
            >
              {loading ? "Saving..." : "Confirm Order"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
