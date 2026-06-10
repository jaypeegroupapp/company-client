"use client";

import Link from "next/link";
import { Truck, Plus } from "lucide-react";

interface TruckFleetTableProps {
  trucks: any;
}

export function TruckFleetTable({ trucks }: TruckFleetTableProps) {
  // Sample truck data - in production, fetch from API
  const sampleTrucks = [
    {
      id: "1",
      plateNumber: "ABC 123",
      make: "Scania",
      model: "R450",
      year: 2020,
      status: "active",
    },
    {
      id: "2",
      plateNumber: "DEF 456",
      make: "Volvo",
      model: "FH16",
      year: 2021,
      status: "active",
    },
    {
      id: "3",
      plateNumber: "GHI 789",
      make: "Mercedes",
      model: "Actros",
      year: 2019,
      status: "maintenance",
    },
  ];

  const displayTrucks = sampleTrucks;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-gray-700">Truck Fleet</h3>
        <Link
          href="/trucks"
          className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          <Plus size={12} />
          Manage
        </Link>
      </div>
      <div className="space-y-2">
        {displayTrucks.map((truck) => (
          <div
            key={truck.id}
            className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <Truck size={16} className="text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {truck.plateNumber}
                </p>
                <p className="text-xs text-gray-500">
                  {truck.make} {truck.model}
                </p>
              </div>
            </div>
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                truck.status === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {truck.status}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 text-center">
        <Link
          href="/trucks"
          className="text-xs text-blue-600 hover:text-blue-700"
        >
          + Add new truck
        </Link>
      </div>
    </div>
  );
}
