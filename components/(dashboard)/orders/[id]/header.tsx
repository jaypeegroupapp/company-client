"use client";

import { ArrowLeft, Trash2 } from "lucide-react";
import { IOrder } from "@/definitions/order";

interface Props {
  order: IOrder;
  onBack: () => void;
  onDelete: () => void;
  isWithin48Hours: boolean;
}

export function OrderHeader({
  order,
  onBack,
  onDelete,
  isWithin48Hours,
}: Props) {
  return (
    <div className="flex items-center justify-between">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-black transition"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      {order.status === "pending" && (
        <button
          onClick={() => {
            if (!isWithin48Hours) onDelete();
          }}
          disabled={isWithin48Hours}
          title={
            isWithin48Hours
              ? "Deleting an order is disabled within 48 hours of the collection date."
              : "Delete order"
          }
          className={`flex items-center gap-2 border rounded-lg px-4 py-2 text-sm font-medium transition
            ${
              isWithin48Hours
                ? "border-gray-200 bg-gray-200 text-gray-400 cursor-not-allowed"
                : "border-gray-300 text-gray-700 hover:bg-gray-100"
            }
          `}
        >
          <Trash2 size={16} />
          Delete Order
        </button>
      )}
    </div>
  );
}
