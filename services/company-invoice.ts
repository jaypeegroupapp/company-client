"use server";
import { Types } from "mongoose";
import CompanyInvoice from "@/models/company-invoice";
import { connectDB } from "@/lib/db";
import { verifySession } from "@/lib/dal";

/**
 * Get all invoices
 */
export async function getCompanyInvoicesService() {
  await connectDB();
  const session = await verifySession();
  if (!session) return null;

  const companyId = session?.companyId as string;

  try {
    const invoices = await CompanyInvoice.find({
      companyId,
      status: { $ne: "pending" },
    })
      .populate("companyId", "name")
      .sort({ createdAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(invoices));
  } catch (error) {
    console.error("❌ getCompanyInvoicesService error:", error);
    return [];
  }
}

/**
 * Get invoices by company
 */
export async function getCompanyInvoicesByCompanyIdService(companyId: string) {
  await connectDB();

  try {
    const invoices = await CompanyInvoice.find({
      companyId: new Types.ObjectId(companyId),
    })
      .populate("companyId", "name")
      .sort({ createdAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(invoices));
  } catch (error) {
    console.error("❌ getCompanyInvoicesService error:", error);
    return [];
  }
}

/**
 * Get invoice by ID
 */
export async function getCompanyInvoiceByIdService(id: string) {
  await connectDB();

  try {
    const invoice = await CompanyInvoice.findById(id)
      .populate("companyId", "name")
      .lean();

    return invoice ? JSON.parse(JSON.stringify(invoice)) : null;
  } catch (error) {
    console.error("❌ getCompanyInvoiceByIdService error:", error);
    return null;
  }
}
