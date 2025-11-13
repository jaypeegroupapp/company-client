"use client";

import { ArrowLeft, Trash2 } from "lucide-react";
import { IOrder } from "@/definitions/order";

interface Props {
  order: IOrder;
  onBack: () => void;
  onDelete: () => void;
}

export function OrderHeader({ order, onBack, onDelete }: Props) {
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
          onClick={onDelete}
          className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
        >
          <Trash2 size={16} />
          Delete Order
        </button>
      )}
    </div>
  );
}
