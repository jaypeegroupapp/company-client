"use client";

import { useState } from "react";
import { createOrderAction } from "@/actions/order";
import { useRouter } from "next/navigation";

export function ReviewStep({
  selectedProduct,
  selectedTrucks,
  quantities,
  collectionDate,
  setCollectionDate,
  onBack,
}: {
  selectedProduct: any;
  selectedTrucks: any[];
  quantities: any;
  collectionDate: string;
  setCollectionDate: (d: string) => void;
  onBack: () => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const total = selectedTrucks.reduce((acc, truck) => {
    const qty = quantities[truck.id] || 0;
    return acc + qty * selectedProduct.price;
  }, 0);

  const totalLitres = Object.values(quantities).reduce(
    (a: number, b) => a + Number(b || 0),
    0
  );

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setMessage(null);

      const orderData = {
        productId: selectedProduct.id,
        totalAmount: total,
        collectionDate,
        items: selectedTrucks.map((truck) => ({
          truckId: truck.id,
          quantity: quantities[truck.id],
        })),
      };

      const formData = new FormData();
      formData.append("orderData", JSON.stringify(orderData));

      const result = await createOrderAction(formData);

      if (result?.message?.toLowerCase().includes("success")) {
        setMessage("✅ Order created successfully!");
        setTimeout(() => {
          setMessage(null);
          router.push("/orders");
        }, 2000);
      } else {
        setMessage(result?.message || "❌ Failed to create order");
      }
    } catch (error: any) {
      console.error("createOrderAction error:", error);
      setMessage("❌ Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold text-gray-900">Review & Confirm</h2>

      <div className="border border-gray-200 rounded-xl p-6 space-y-4 bg-gray-50 shadow-sm">
        {/* Product Info */}
        <div>
          <h3 className="font-medium text-gray-900">Product</h3>
          <p className="text-gray-700">{selectedProduct.name}</p>
        </div>

        {/* Truck & Quantity Info */}
        <div>
          <h3 className="font-medium text-gray-900">Trucks & Quantities</h3>
          <ul className="space-y-2">
            {selectedTrucks.map((truck) => (
              <li
                key={truck.id}
                className="flex justify-between text-sm text-gray-700 border-b border-gray-200 pb-1"
              >
                <span>{truck.plateNumber}</span>
                <span>{quantities[truck.id]} units</span>
              </li>
            ))}
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

        {/* Total Summary */}
        <div className="pt-4 flex justify-between border-t border-gray-200">
          <p className="text-sm text-gray-700">Total:</p>
          <p className="text-lg font-semibold text-gray-900">
            R {total.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Status Message */}
      {message && (
        <div
          className={`text-center text-sm ${
            message.includes("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </div>
      )}

      {/* Actions */}
      <div className="pt-4 flex justify-between">
        <button
          onClick={onBack}
          disabled={loading}
          className="px-6 py-2 rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-100 transition"
        >
          Back
        </button>
        <button
          disabled={!collectionDate || loading}
          onClick={handleSubmit}
          className={`px-6 py-2 rounded-lg text-white font-medium transition ${
            collectionDate && !loading
              ? "bg-gray-900 hover:bg-black"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {loading ? "Saving..." : "Confirm Order"}
        </button>
      </div>
    </div>
  );
}
