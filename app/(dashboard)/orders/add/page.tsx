import AddOrderClient from "@/components/(dashboard)/orders/add/client";
import { getCompanyDetails } from "@/data/company";

export const dynamic = "force-dynamic";

export default async function AddOrderPage() {
  const company = await getCompanyDetails();

  return (
    <AddOrderClient
      debit={{
        debitAmount: company?.debitAmount || 0,
        usedDebit: company?.usedDebit || 0,
      }}
    />
  );
}
