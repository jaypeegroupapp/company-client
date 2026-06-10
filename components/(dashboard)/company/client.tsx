"use client";

import { motion } from "framer-motion";
import { KPICards } from "./kpi-cards";
import { OrderTrendChart } from "./charts/order-trend";
import { SpendingDistributionChart } from "./charts/spending-distribution";
import { OrderStatusChart } from "./charts/order-status";
import { ActiveOrdersTable } from "./tables/active-orders";
import { OrderHistoryTable } from "./tables/order-history";
import { TruckFleetTable } from "./tables/truck-fleet";
import { QuickActions } from "./quick-actions";

interface CompanyAdminDashboardClientProps {
  initialData: any;
}

export function CompanyAdminDashboardClient({
  initialData,
}: CompanyAdminDashboardClientProps) {
  if (!initialData?.success || !initialData.data) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const data = initialData.data;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex sm:flex-row flex-col justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Company Dashboard</h1>
        <QuickActions />
      </div>

      <KPICards data={data} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrderTrendChart
          monthlySpent={data.orders.monthlySpent}
          monthlyLitres={data.orders.monthlyLitres}
        />
        {/* <SpendingDistributionChart /> */}
        <div>
          <OrderStatusChart
            pending={data.orders.pending}
            accepted={data.orders.accepted}
            completed={data.orders.completed}
            cancelled={data.orders.cancelled}
          />
        </div>
      </div>

      {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <OrderHistoryTable orders={data.activeOrdersList || []} />
        </div>
      </div> */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActiveOrdersTable orders={data.orderHistory || []} />
        <TruckFleetTable trucks={data.fleet} />
      </div>
    </motion.div>
  );
}
