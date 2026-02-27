import AddOrderClient from "@/components/(dashboard)/orders/add/client";
import { getCompanySession } from "@/data/company";

export const dynamic = "force-dynamic";

export default async function AddOrderPage() {
  const company = await getCompanySession();

  return (
    <AddOrderClient
      debit={{
        debitAmount: company?.debitAmount || 0,
      }}
      discountAmount={company?.discountAmount || 0}
      isGridPlus={company?.isGridPlus || false}
    />
  );
}
