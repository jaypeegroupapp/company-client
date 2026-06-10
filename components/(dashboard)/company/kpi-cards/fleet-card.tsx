"use client";

import { Truck, CheckCircle } from "lucide-react";

interface FleetCardProps {
  totalTrucks: number;
  activeTrucks: number;
}

export function FleetCard({ totalTrucks, activeTrucks }: FleetCardProps) {
  const activePercentage =
    totalTrucks > 0 ? (activeTrucks / totalTrucks) * 100 : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Fleet Size</p>
          <p className="text-2xl font-bold text-gray-900">{totalTrucks}</p>
        </div>
        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
          <Truck size={24} className="text-purple-600" />
        </div>
      </div>
      <div className="mt-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Active Trucks:</span>
          <span className="font-medium">{activeTrucks}</span>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span className="text-gray-500">Fleet Utilization:</span>
          <span className="font-medium">{activePercentage.toFixed(0)}%</span>
        </div>
        {activeTrucks === totalTrucks && totalTrucks > 0 && (
          <div className="flex items-center gap-1 text-xs text-green-600 mt-2">
            <CheckCircle size={12} />
            <span>All trucks are active</span>
          </div>
        )}
      </div>
    </div>
  );
}
