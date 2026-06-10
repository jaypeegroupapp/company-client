"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface OrderTrendChartProps {
  monthlySpent: number;
  monthlyLitres: number;
}

export function OrderTrendChart({
  monthlySpent,
  monthlyLitres,
}: OrderTrendChartProps) {
  const [mounted, setMounted] = useState(false);

  // Sample trend data - in production, fetch from API
  const data = [
    { month: "Jan", litres: 12500, spent: 187500 },
    { month: "Feb", litres: 14800, spent: 222000 },
    { month: "Mar", litres: 13200, spent: 198000 },
    { month: "Apr", litres: 15600, spent: 234000 },
    { month: "May", litres: 16800, spent: 252000 },
    { month: "Jun", litres: monthlyLitres, spent: monthlySpent },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Order Trend</h3>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <h3 className="text-sm font-medium text-gray-700 mb-4">
        Order Trend (Last 6 Months)
      </h3>
      <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip formatter={(value) => [`${value.toLocaleString()}`, ""]} />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="litres"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Litres"
              dot={{ fill: "#3b82f6", r: 4 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="spent"
              stroke="#10b981"
              strokeWidth={2}
              name="Spent (R)"
              dot={{ fill: "#10b981", r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
