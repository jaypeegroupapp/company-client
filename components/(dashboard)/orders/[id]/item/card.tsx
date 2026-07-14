// src/components/(dashboard)/orders/[id]/order-item-card.tsx
"use client";

import {
  Truck,
  Package,
  Droplet,
  User,
  Clock,
  CheckCircle,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { OrderItemStatusBadge } from "./status-badge";
import { DeleteOrderItemModal } from "./delete-modal";

export function OrderItemCard({
  item,
  sellingPrice,
  orderId,
  isPending,
}: {
  item: any;
  sellingPrice: number;
  orderId: string;
  isPending: boolean;
}) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <>
      <div className="p-6 hover:bg-gray-50 transition">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          {/* Left side - Truck Info */}
          <div className="flex-1">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <Truck size={24} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h4 className="text-base font-semibold text-gray-800">
                    {item.plateNumber || item.truckName}
                  </h4>
                  <OrderItemStatusBadge status={item.status} />
                </div>

                {/* Truck Details */}
                {(item.make || item.model || item.year) && (
                  <p className="text-sm text-gray-500 mb-2">
                    {[item.make, item.model, item.year].filter(Boolean).join(" ")}
                  </p>
                )}

                {/* Product and Company Info */}
                <div className="flex flex-wrap gap-3 text-sm mt-2">
                  {item.productName && (
                    <span className="text-gray-600 flex items-center gap-1">
                      <Package size={14} className="text-gray-400" />
                      Product: {item.productName}
                    </span>
                  )}
                  {item.companyName && (
                    <span className="text-gray-600 flex items-center gap-1">
                      Company: {item.companyName}
                    </span>
                  )}
                </div>

                {/* Dispenser Info */}
                {item.status === "completed" &&
                  (item.dispenserName || item.attendantName) && (
                    <OrderItemCompletionInfo item={item} />
                  )}
              </div>
            </div>
          </div>

          {/* Right side - Quantity and Price */}
          <OrderItemPriceInfo
            item={item}
            sellingPrice={sellingPrice}
            isPending={isPending}
            setShowDeleteModal={setShowDeleteModal}
          />
        </div>

        {/* Status Timeline */}
        {item.status === "completed" && <OrderItemTimeline />}
      </div>

      {/* Delete Modal */}
      <DeleteOrderItemModal
        orderId={orderId}
        itemId={item.id}
        plateNumber={item.plateNumber || item.truckName}
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      />
    </>
  );
}

// Sub-component for completion info
function OrderItemCompletionInfo({ item }: { item: any }) {
  return (
    <div className="mt-2 pt-2 border-t border-gray-100">
      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
        {item.dispenserName && (
          <span className="flex items-center gap-1">
            <Droplet size={12} />
            Dispenser: {item.dispenserName}
          </span>
        )}
        {item.attendantName && (
          <span className="flex items-center gap-1">
            <User size={12} />
            Attendant: {item.attendantName}
          </span>
        )}
        {item.completedAt && (
          <span className="flex items-center gap-1">
            <Clock size={12} />
            Completed: {new Date(item.completedAt).toLocaleString()}
          </span>
        )}
        {item.signature && (
          <span className="text-green-600 flex items-center gap-1">
            <CheckCircle size={12} />
            Signed
          </span>
        )}
      </div>
    </div>
  );
}

// Sub-component for price info
function OrderItemPriceInfo({
  item,
  sellingPrice,
  isPending,
  setShowDeleteModal,
}: {
  item: any;
  sellingPrice: number;
  isPending: boolean;
  setShowDeleteModal: (show: boolean) => void;
}) {
  const totalPrice = item.quantity * sellingPrice;
  return (
    <div className="text-right flex gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-4">
          <div className="">
            <p className="text-xs text-gray-500">Quantity</p>
            <p className="text-xl font-bold text-blue-600">{item.quantity}L</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Price per Litre</p>
            <p className="text-lg font-semibold text-gray-800">
              R {sellingPrice?.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-gray-200 flex flex-row gap-2 items-center justify-end">
          <p className="text-xs text-gray-500">Total</p>
          <p className="text-base font-bold text-green-600">
            R {totalPrice.toFixed(2)}
          </p>
        </div>
      </div>
      {/* Delete button for pending orders */}
      {isPending && (item.status === "pending" || item.status === "accepted") && (
        <button
          onClick={() => setShowDeleteModal(true)}
          className="p-1 rounded-full text-red-500 hover:bg-red-50 transition cursor-pointer"
          title="Remove sub-order"
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
}

// Sub-component for timeline
function OrderItemTimeline() {
  return (
    <div className="mt-4 pt-3 border-t border-gray-100">
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Clock size={12} />
          <span>Completed</span>
        </div>
        <div className="flex-1 h-px bg-gray-200" />
        <div className="flex items-center gap-1">
          <CheckCircle size={12} className="text-green-500" />
          <span>Transaction recorded</span>
        </div>
      </div>
    </div>
  );
}