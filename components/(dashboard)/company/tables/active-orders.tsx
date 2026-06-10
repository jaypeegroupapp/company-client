"use client";

import Link from "next/link";
import { Clock, Package, CheckCircle } from "lucide-react";

interface ActiveOrdersTableProps {
  orders: any[];
}

export function ActiveOrdersTable({ orders }: ActiveOrdersTableProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock size={14} className="text-yellow-500" />;
      case "accepted":
        return <Package size={14} className="text-blue-500" />;
      case "completed":
        return <CheckCircle size={14} className="text-green-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "accepted":
        return "bg-blue-100 text-blue-700";
      case "completed":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
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
          No recent orders
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
      <div className="space-y-3">
        {orders.map((order) => (
          <Link
            key={order.id || order._id}
            href={`/orders/${order.id || order._id}`}
            className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-800">
                  Order #
                  {order.id?.slice(-6).toUpperCase() ||
                    order._id?.slice(-6).toUpperCase()}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${getStatusColor(order.status)}`}
              >
                {getStatusIcon(order.status)}
                {order.status}
              </span>
            </div>
            <div className="mt-2 flex justify-between text-xs text-gray-600">
              <span>R {order.totalAmount?.toFixed(2)}</span>
              <span>
                {order.sellingPrice ? `@ R${order.sellingPrice}/L` : ""}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
