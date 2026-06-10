import { CompanyAdminDashboardClient } from "@/components/(dashboard)/company/client";
import { getCompanyAdminDashboardData } from "@/data/company-admin";

export const dynamic = "force-dynamic";

export default async function CompanyAdminPage() {
  const dashboardData = await getCompanyAdminDashboardData();

  return (
    <div className="max-w-7xl mx-auto">
      <CompanyAdminDashboardClient initialData={dashboardData} />
    </div>
  );
}
