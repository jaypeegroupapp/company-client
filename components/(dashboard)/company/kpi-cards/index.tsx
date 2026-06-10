"use client";

import { CreditCard } from "./credit-card";
import { OrdersCard } from "./orders-card";
import { FleetCard } from "./fleet-card";

interface KPICardsProps {
  data: any;
}

export function KPICards({ data }: KPICardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <CreditCard
        debitBalance={data.credit.debitBalance}
        availableCredit={data.credit.availableCredit}
        totalBalance={data.credit.totalBalance}
        utilizationPercentage={data.credit.utilizationPercentage}
      />
      <OrdersCard
        totalOrders={data.orders.totalOrders}
        totalSpent={data.orders.totalSpent}
        totalLitres={data.orders.totalLitres}
        monthlySpent={data.orders.monthlySpent}
        monthlyLitres={data.orders.monthlyLitres}
      />
      <FleetCard
        totalTrucks={data.fleet.totalTrucks}
        activeTrucks={data.fleet.activeTrucks}
      />
    </div>
  );
}
