import AddOrderClient from "@/components/(dashboard)/orders/add/client";
import { getCompanyDetails } from "@/data/company";

export const dynamic = "force-dynamic";

export default async function AddOrderPage() {
  const company = await getCompanyDetails();

  return (
    <AddOrderClient
      credit={{
        limit: company?.creditLimit || 0,
        balance: company?.balance || 0,
      }}
    />
  );
}
