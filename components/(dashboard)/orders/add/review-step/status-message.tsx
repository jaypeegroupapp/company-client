"use client";

import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface StatusMessageProps {
  message: string | null;
}

export function StatusMessage({ message }: StatusMessageProps) {
  if (!message) return null;

  const isSuccess = message.includes("✅") || message.includes("success");
  const isError = message.includes("❌") || message.includes("Failed");
  const isWarning = message.includes("⚠️");

  let icon;
  let bgColor;
  let textColor;

  if (isSuccess) {
    icon = <CheckCircle size={16} className="text-green-600" />;
    bgColor = "bg-green-50";
    textColor = "text-green-700";
  } else if (isError) {
    icon = <XCircle size={16} className="text-red-600" />;
    bgColor = "bg-red-50";
    textColor = "text-red-700";
  } else {
    icon = <AlertCircle size={16} className="text-yellow-600" />;
    bgColor = "bg-yellow-50";
    textColor = "text-yellow-700";
  }

  return (
    <div className={`flex items-center gap-2 p-3 rounded-lg ${bgColor}`}>
      {icon}
      <p className={`text-sm ${textColor}`}>{message}</p>
    </div>
  );
}
