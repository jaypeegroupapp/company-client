import Register from "@/components/(auth)/register/register";
import { SearchParams } from "@/definitions";

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const query = await searchParams;
  const companyId = query.companyId || "";

  return <Register companyId={companyId} />;
}
