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

  if (!companyId) {
    return (
      <div
        className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
        role="alert"
      >
        <p className="text-center text-sm text-gray-600 mb-4">
          Company ID is required to register. Please contact support.
        </p>
      </div>
    );
  }

  const company = await getCompanyById(companyId);
  const isRegistered = !!company?.userId;

  return <Register companyId={companyId} isRegistered={isRegistered} />;
}
