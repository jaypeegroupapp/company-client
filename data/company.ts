"use server";
import { ICompany } from "@/definitions/company";
import { verifySession } from "@/lib/dal";
import { getCompanyByIdService, getCompanyByUserId } from "@/services/company";
import { cache } from "react";

const mapCompany = (company: any): ICompany => ({
  id: company._id?.toString?.() ?? company.id ?? "",
  userId: company.userId?.toString?.() ?? company.userId ?? "",
  companyName: company.companyName,
  registrationNumber: company.registrationNumber,
  contactEmail: company.contactEmail,
  contactPhone: company.contactPhone,
  billingAddress: company.billingAddress,
  vatNumber: company.vatNumber ?? "",
  invoiceFile: company.invoiceFile ?? "",
  creditLimit: company.creditLimit ?? 0,
  balance: company.balance ?? 0,
  createdAt: company.createdAt ?? "",
  updatedAt: company.updatedAt ?? "",
});

export const getCompany = cache(async (userData: any) => {
  return await getCompanyByUserId(userData);
});

export async function getCompanyDetails() {
  try {
    const session = await verifySession();
    if (!session) return null;

    const companyId = session?.companyId as string;

    const company = await getCompanyByIdService(companyId);
    if (!company) return null;
    return mapCompany(company);
  } catch (error: any) {
    console.error("❌ getCompanyById error:", error);
    return null;
  }
}
