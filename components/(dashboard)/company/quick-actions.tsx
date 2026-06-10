"use client";

import { Plus, Truck, FileText, RefreshCw } from "lucide-react";
import Link from "next/link";

export function QuickActions() {
  const actions = [
    {
      name: "New Order",
      icon: Plus,
      href: "/orders/add",
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      name: "Add Truck",
      icon: Truck,
      href: "/trucks",
      color: "bg-green-600 hover:bg-green-700",
    },
    /* {
      name: "View Reports",
      icon: FileText,
      href: "/company/reports",
      color: "bg-purple-600 hover:bg-purple-700",
    },
    {
      name: "Top Up Credit",
      icon: RefreshCw,
      href: "/company/credit",
      color: "bg-orange-600 hover:bg-orange-700",
    }, */
  ];

  return (
    <div className="flex gap-2">
      {actions.map((action) => (
        <Link
          key={action.name}
          href={action.href}
          className={`flex items-center gap-2 px-3 py-2 text-sm text-white rounded-lg transition ${action.color}`}
        >
          <action.icon size={14} />
          <span className="hidden sm:inline">{action.name}</span>
        </Link>
      ))}
    </div>
  );
}
