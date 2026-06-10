"use client";

import { Package, TrendingUp, Droplet } from "lucide-react";

interface OrdersCardProps {
  totalOrders: number;
  totalSpent: number;
  totalLitres: number;
  monthlySpent: number;
  monthlyLitres: number;
}

export function OrdersCard({
  totalOrders,
  totalSpent,
  totalLitres,
  monthlySpent,
  monthlyLitres,
}: OrdersCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
        </div>
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <Package size={24} className="text-blue-600" />
        </div>
      </div>
      <div className="mt-3 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Total Spent:</span>
          <span className="font-medium">R {totalSpent.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Total Litres:</span>
          <span className="font-medium">{totalLitres.toLocaleString()}L</span>
        </div>
        <div className="border-t border-gray-100 pt-2 mt-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">This Month:</span>
            <span className="font-medium text-blue-600">
              {monthlyLitres.toLocaleString()}L (R {monthlySpent.toFixed(2)})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
