"use client";

import { useState } from "react";
import { Package, Calendar } from "lucide-react";
import { IOrder } from "@/definitions/order";
import { OrderStatusBadge } from "./status-badge";
import { EditCollectionDateModal } from "./edit-collection-date-modal";

export function OrderSummary({
  order,
  isWithin48Hours,
  totalStockToDeduct,
}: {
  order: IOrder;
  isWithin48Hours: boolean;
  totalStockToDeduct: number;
}) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
        <div className="flex justify-between">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
              <Package size={24} />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-800">
                Order #{order.id?.slice(-6).toUpperCase()}
              </h2>
              <p className="text-sm text-gray-500">
                Created on{" "}
                {new Date(order.createdAt!).toLocaleDateString("en-ZA")}
              </p>
              <div className="mt-2">
                <OrderStatusBadge status={order.status} />
              </div>
            </div>
          </div>
          <div>
            {order.status === "pending" && (
              <button
                onClick={() => !isWithin48Hours && setShowModal(true)}
                disabled={isWithin48Hours}
                title={
                  isWithin48Hours
                    ? "Rescheduling is locked within 48 hours of collection."
                    : "Reschedule your collection date"
                }
                className={`flex items-center gap-2 rounded-lg p-2 text-sm font-medium transition
                  ${
                    isWithin48Hours
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gray-900 text-white hover:bg-gray-700"
                  }
                `}
              >
                <Calendar size={16} />
                <div className="md:block hidden">Reschedule Collection</div>
              </button>
            )}
          </div>
        </div>
        {/* ❗ Disclaimer */}
        <p className="text-xs text-red-700 text-center">
          * Rescheduling or cancelling a collection is only allowed up to 48
          hours before the collection date.
        </p>

        <div className="border-t border-gray-200 my-4" />

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <p className="text-gray-500">Product</p>
            <p className="font-medium">{order.productName}</p>
          </div>
          <div>
            <p className="text-gray-500 flex items-center justify-between">
              Collection Date
            </p>
            <p className="font-medium">
              {new Date(order.collectionDate).toLocaleDateString("en-ZA")}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Quantity</p>
            <p className="font-medium">{totalStockToDeduct}</p>
          </div>
          <div>
            <p className="text-gray-500">Total Amount</p>
            <p className="font-semibold text-gray-900">
              R{order.totalAmount.toFixed(2)}
            </p>
          </div>{" "}
          <div>
            <p className="text-gray-500">Mine</p>
            <p className="font-medium">{order.mineName}</p>
          </div>
        </div>
      </div>

      {/* ✅ Edit Date Modal */}
      {showModal && (
        <EditCollectionDateModal
          orderId={order.id!}
          open={showModal}
          currentDate={order.collectionDate}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
