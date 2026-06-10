"use client";

import Link from "next/link";
import { CheckCircle, XCircle, Clock } from "lucide-react";

interface OrderHistoryTableProps {
  orders: any[];
}

export function OrderHistoryTable({ orders }: OrderHistoryTableProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle size={14} className="text-green-500" />;
      case "cancelled":
        return <XCircle size={14} className="text-red-500" />;
      case "accepted":
        return <Clock size={14} className="text-blue-500" />;
      default:
        return <Clock size={14} className="text-yellow-500" />;
    }
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium text-gray-700">Recent Orders</h3>
          <Link
            href="/orders"
            className="text-xs text-blue-600 hover:text-blue-700"
          >
            View all →
          </Link>
        </div>
        <p className="text-sm text-gray-500 text-center py-8">
          No order history
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-gray-700">Recent Orders</h3>
        <Link
          href="/orders"
          className="text-xs text-blue-600 hover:text-blue-700"
        >
          View all →
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs text-gray-500 border-b">
            <tr>
              <th className="text-left py-2">Order #</th>
              <th className="text-left py-2">Date</th>
              <th className="text-left py-2">Amount</th>
              <th className="text-left py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 10).map((order) => (
              <tr
                key={order.id || order._id}
                className="border-b border-gray-100"
              >
                <td className="py-2">
                  <Link
                    href={`/orders/${order.id || order._id}`}
                    className="text-blue-600 hover:underline"
                  >
                    #
                    {order.id?.slice(-6).toUpperCase() ||
                      order._id?.slice(-6).toUpperCase()}
                  </Link>
                </td>
                <td className="py-2 text-gray-600">
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="py-2 font-medium">
                  R {order.totalAmount?.toFixed(2)}
                </td>
                <td className="py-2">
                  <span className="flex items-center gap-1">
                    {getStatusIcon(order.status)}
                    <span className="capitalize">{order.status}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
