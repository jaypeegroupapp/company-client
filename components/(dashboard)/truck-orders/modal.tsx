"use client";

import { BaseModal } from "@/components/ui/base-modal";
import { useState, useEffect } from "react";
import { IOrderItemAggregated } from "@/definitions/order-item";
import { Truck, Factory, PackageCheck } from "lucide-react";

export function OrderItemDetailModal({
  open,
  onClose,
  item,
}: {
  open: boolean;
  onClose: () => void;
  item: IOrderItemAggregated;
}) {
  const [signature, setSignature] = useState<string | null>(null);

  // Load existing signature (if any)
  useEffect(() => {
    if (item.signature) {
      setSignature(item.signature);
    }
  }, [item.signature]);

  const hasExistingSignature = Boolean(item.signature);

  return (
    <BaseModal open={open} onClose={onClose}>
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Order Item Details
        </h2>

        {/* TRUCK */}
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Truck size={16} />
          {item.plateNumber} ({item.make} {item.model} {item.year})
        </div>

        {/* PRODUCT */}
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <PackageCheck size={16} />
          Product: {item.productName}
        </div>

        {/* COMPANY */}
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Factory size={16} />
          Company: {item.companyName}
        </div>

        {/* QUANTITY */}
        <div className="text-sm text-gray-700">
          Quantity: <span className="font-semibold">{item.quantity}</span>
        </div>

        {/* STATUS */}
        <div className="text-sm text-gray-700">
          Status:{" "}
          <span className="font-semibold capitalize">{item.status}</span>
        </div>

        {/* SIGNATURE AREA */}
        {hasExistingSignature && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Collector Signature:
            </p>

            {hasExistingSignature && item.signature && (
              // SHOW READ-ONLY IMAGE
              <div className="border border-gray-300 rounded-md bg-white p-2">
                <img
                  src={item.signature}
                  className="w-full h-auto object-contain"
                  alt="Existing signature"
                />
              </div>
            )}
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-3 pt-5 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100"
          >
            Close
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
