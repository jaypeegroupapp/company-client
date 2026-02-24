import Register from "@/components/(auth)/register/register";
import { getCompanyById } from "@/data/company";
import { SearchParams } from "@/definitions";

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const query = await searchParams;
  const companyId = query.companyId || "";
  const company = await getCompanyById(companyId);
  const isRegistered = !!company?.userId;

  return <Register companyId={companyId} isRegistered={isRegistered} />;
}
