"use client";

import { Calendar, Package, Truck, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { OrderStatusBadge } from "../status-badge";
import { OrderInfoCard } from "./info-card";

export function OrderSummary({ order }: { order: any }) {
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);

  const totalQuantity =
    order.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) ||
    0;

  const isPending = order.status === "pending";
  const isAccepted = order.status === "accepted";
  const isCompleted = order.status === "completed";
  const isCancelled = order.status === "cancelled";

  const canAccept = isPending;
  const canDecline = isPending;

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Order #{order.orderNumber}
            </h2>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
              <Calendar size={14} />
              Created on {new Date(order.createdAt).toLocaleDateString("en-ZA")}
            </p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        <div className="border-t border-gray-200 my-4" />

        <div className="grid grid-cols-2 gap-4 text-sm">
          <OrderInfoCard
            icon={Package}
            label="Product"
            value={order.productName || "Diesel"}
          />
          <OrderInfoCard
            icon={Package}
            label="Total Quantity"
            value={`${totalQuantity}L`}
            valueClassName="text-blue-600"
          />
          <OrderInfoCard
            icon={Package}
            label="Total Amount"
            value={`R ${order.totalAmount?.toFixed(2) || 0}`}
            valueClassName="text-green-600"
          />
          <OrderInfoCard
            icon={Package}
            label="Collection Date"
            value={new Date(order.collectionDate).toLocaleDateString("en-ZA")}
            valueClassName="text-green-600"
          />
        </div>

        {/* Status Messages */}
        {isAccepted && (
          <div className="p-3 rounded-lg bg-blue-50">
            <p className="text-sm font-medium text-blue-800">
              ✅ Order accepted and awaiting fulfillment
            </p>
          </div>
        )}

        {isCompleted && (
          <div className="p-3 rounded-lg bg-green-50">
            <p className="text-sm font-medium text-green-800">
              ✓ Order completed successfully
            </p>
          </div>
        )}

        {isCancelled && (
          <div className="p-3 rounded-lg bg-red-50">
            <p className="text-sm font-medium text-red-800">
              ✗ Order cancelled
            </p>
            {order.declineReason && (
              <p className="text-xs text-red-600 mt-1">
                Reason: {order.declineReason}
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
