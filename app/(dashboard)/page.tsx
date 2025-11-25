// app/(company)/dashboard/page.tsx

import TilesSummary from "@/components/(dashboard)/dashboard/tiles-summary";
import BarChartCard from "@/components/(dashboard)/dashboard/bar-chart-card";
import LineChartCard from "@/components/(dashboard)/dashboard/line-chart-card";
import PieChartCard from "@/components/(dashboard)/dashboard/pie-chart-card";

export const dynamic = "force-dynamic";

import {
  // COMPANY-SPECIFIC ANALYTICS ONLY
  getCompanyDashboardSummary,
  getCompanyMonthlyOrdersStats,
  getCompanyOrderStatusStats,
  getCompanyOrdersByMine,
  getCompanyTruckStatus,
  getCompanyMonthlyInvoices,
} from "@/data/dashboard";

export default async function CompanyDashboardPage() {
  const summary = await getCompanyDashboardSummary();
  const monthlyOrders = await getCompanyMonthlyOrdersStats();
  const orderStatusStats = await getCompanyOrderStatusStats();
  const ordersByMine = await getCompanyOrdersByMine();

  const truckStatus = await getCompanyTruckStatus();
  const monthlyCompanyInvoices = await getCompanyMonthlyInvoices();

  return (
    <div className="py-4 md:p-4 space-y-6">
      {/* SUMMARY TILE SECTION */}
      <TilesSummary data={summary} />

      {/* MAIN DASHBOARD GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LineChartCard
          title="Monthly Orders"
          data={monthlyOrders}
          dataKey="orders"
        />

        <PieChartCard
          title="Order Status Breakdown"
          data={orderStatusStats}
          dataKey="value"
          nameKey="status"
        />

        <BarChartCard
          title="Orders by Mine"
          data={ordersByMine}
          xKey="mine"
          barKey="orders"
        />

        <PieChartCard
          title="Active vs Inactive Trucks"
          data={truckStatus}
          dataKey="count"
          nameKey="status"
        />

        <LineChartCard
          title="Company Invoice Revenue (Monthly)"
          data={monthlyCompanyInvoices}
          dataKey="total"
        />
      </div>
    </div>
  );
}
