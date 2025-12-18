"use client";

import { useState } from "react";
import { createOrderAction } from "@/actions/order";
import { useRouter } from "next/navigation";
import { ITruck } from "@/definitions/truck";
import { IProduct } from "@/definitions/product";
import CreditBalance from "./credit-balance";
import { ICompanyCredit } from "@/definitions/company-credit";

export function ReviewStep({
  selectedMine,
  selectedProduct,
  selectedTrucks,
  quantities,
  debit,
  collectionDate,
  setCollectionDate,
  onBack,
}: {
  selectedMine: ICompanyCredit | null;
  selectedProduct: IProduct | null;
  selectedTrucks: ITruck[];
  quantities: any;
  debit: { debitAmount: number };
  collectionDate: string;
  setCollectionDate: (d: string) => void;
  onBack: () => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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

  const sellingPrice = selectedProduct.sellingPrice ?? 0;
  const purchasePrice = selectedProduct.purchasePrice ?? 0;
  const accountBalance =
    debit.debitAmount - (selectedMine.creditLimit - selectedMine.usedCredit);

  const getQuantity = (truckId?: string) =>
    truckId ? Number(quantities?.[truckId] || 0) : 0;

  // 🧮 Compute totals
  const total = selectedTrucks.reduce((acc, truck) => {
    const qty = getQuantity(truck.id);
    return acc + qty * sellingPrice;
  }, 0);

  const totalLitres = selectedTrucks.reduce(
    (acc, truck) => acc + getQuantity(truck.id),
    0
  );

  const orderItems = selectedTrucks
    .filter((truck) => Boolean(truck.id))
    .map((truck) => ({
      truckId: truck.id,
      quantity: getQuantity(truck.id),
    }));

  // 🚨 BALANCE VALIDATION
  const insufficientBalance = total > accountBalance;

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setMessage(null);

      if (insufficientBalance) {
        setMessage("❌ You do not have enough credit to complete this order.");
        return;
      }
      let debitPaid = total;
      let creditUsed = 0;

      if (total > debit.debitAmount) {
        debitPaid = debit.debitAmount;
        creditUsed = total - debit.debitAmount;
      }

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
          <h3 className="font-medium text-gray-900">Collection Date</h3>
          <input
            type="date"
            value={collectionDate}
            onChange={(e) => setCollectionDate(e.target.value)}
            className="mt-2 border border-gray-300 rounded-lg px-3 py-2 w-full text-sm text-gray-800 focus:ring-1 focus:ring-gray-700 focus:outline-none"
          />
        </div>

        {/* Total price */}
        <div className="pt-4 flex justify-between border-t border-gray-200">
          <p className="text-sm text-gray-700">Total:</p>
          <p className="text-lg font-semibold text-gray-900">
            R {total.toFixed(2)}
          </p>
        </div>

        {/* ❌ Insufficient accountBalance error */}
        {insufficientBalance && (
          <p className="text-red-600 text-sm font-medium mt-2">
            ❌ You do not have enough credit to place this order. (Available: R
            {accountBalance.toFixed(2)} | Needed: R{total.toFixed(2)})
          </p>
        )}
      </div>

      {/* Status message */}
      {message && (
        <div
          className={`text-center text-sm ${
            message.includes("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </div>
      )}

      {/* Buttons */}
      <div className="pt-4 flex justify-between">
        <button
          onClick={onBack}
          disabled={loading}
          className="px-6 py-2 rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-100 transition"
        >
          Back
        </button>

        <button
          disabled={!collectionDate || loading || insufficientBalance}
          onClick={handleSubmit}
          className={`px-6 py-2 rounded-lg text-white font-medium transition ${
            !collectionDate || loading || insufficientBalance
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gray-900 hover:bg-black"
          }`}
        >
          {loading ? "Saving..." : "Confirm Order"}
        </button>
      </div>
    </div>
  );
}
