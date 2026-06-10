"use server";

import { verifySession } from "@/lib/dal";
import { getCompanyAdminDashboardDataService } from "@/services/company-admin";
import { redirect } from "next/navigation";

export async function getCompanyAdminDashboardData() {
  try {
    const session = await verifySession();
    if (!session) redirect("/login");

    const companyId = session.companyId as string;

    const data = await getCompanyAdminDashboardDataService(companyId);
    return { success: true, data };
  } catch (error: any) {
    console.error("❌ getCompanyAdminDashboardData error:", error);
    return {
      success: false,
      data: null,
      message: error.message,
    };
  }
}
