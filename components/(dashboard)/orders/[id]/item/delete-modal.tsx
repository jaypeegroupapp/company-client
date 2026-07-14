// src/components/(dashboard)/orders/[id]/delete-item-modal.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { BaseModal } from "@/components/ui/base-modal";
import { AlertTriangle, Trash2, Truck } from "lucide-react";
import { deleteOrderItemAction } from "@/actions/order-item";

interface Props {
  orderId: string;
  itemId: string;
  plateNumber: string;
  open: boolean;
  onClose: () => void;
}

export function DeleteOrderItemModal({
  orderId,
  itemId,
  plateNumber,
  open,
  onClose,
}: Props) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    setMessage("");

    startTransition(async () => {
      const result = await deleteOrderItemAction(orderId, itemId);

      if (result.success) {
        setMessage("✅ Sub-order deleted successfully!");
        router.refresh();
        setTimeout(onClose, 1500);
      } else {
        setMessage(`❌ ${result.message}`);
      }
    });
  };

  return (
    <BaseModal open={open} onClose={onClose}>
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-red-600">
          <AlertTriangle size={24} />
          <h3 className="text-lg font-semibold">Delete Sub-Order</h3>
        </div>

        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
          <Truck size={16} className="text-gray-500" />
          <span className="text-sm font-medium">{plateNumber}</span>
        </div>

        <p className="text-sm text-gray-600">
          Are you sure you want to remove this truck from the order?
          <br />
          <span className="text-xs text-gray-400 mt-1 block">
            This will reduce the total order quantity.
          </span>
        </p>

        {message && (
          <p
            className={`text-sm p-2 rounded ${message.includes("✅")
              ? "text-green-600 bg-green-50"
              : "text-red-600 bg-red-50"
              }`}
          >
            {message}
          </p>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={isPending}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-md ${isPending
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700"
              }`}
          >
            {isPending ? "Processing..." : "Remove Sub-Order"}
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </BaseModal>
  );
}