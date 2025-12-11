import { OrderClientPage } from "@/components/(dashboard)/orders/client";
import { getCompanyDetails } from "@/data/company";
import { getOrders } from "@/data/order";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const orders = await getOrders();
  const company = await getCompanyDetails();

  return (
    <OrderClientPage
      initialOrders={orders || []}
      debit={{
        debitAmount: company?.debitAmount || 0,
        usedDebit: company?.usedDebit || 0,
      }}
    />
  );
}
