"use server";

import { getCompanyCreditsByCompanyIdService } from "@/services/company-credit";
import { mapCompanyCredit } from "./mapper";
import { verifySession } from "@/lib/dal";

export async function getCompanyCreditsByCompanyId() {
  try {
    const session = await verifySession();
    if (!session) return null;

    const companyId = session?.companyId as string;

    const credits = await getCompanyCreditsByCompanyIdService(companyId);
    if (!credits) return { success: true, data: [] };

    return {
      success: true,
      data: credits.map(mapCompanyCredit),
    };
  } catch (err: any) {
    console.error("❌ getCompanyCreditsByCompanyId error:", err);
    return { success: false, data: [] };
  }
}
