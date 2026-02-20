"use server";

import { verifySession } from "@/lib/dal";
import {
  getMineInvoicesService,
  getMineInvoiceByIdService,
} from "@/services/mine-invoice";
import { redirect } from "next/navigation";

const mapInvoice = (invoice: any) => ({
  id: invoice._id.toString(),
  mineId: invoice.mineId?._id || "",
  mineName: invoice.mineId?.name || "",
  companyId: invoice.companyId?._id || "",
  companyName: invoice.companyId?.name || "",
  status: invoice.status,
  totalAmount: Number(invoice.totalAmount || 0),
  paymentAmount: Number(invoice.paymentAmount || 0),
  openingBalance: Number(invoice.openingBalance || 0),
  closingBalance: Number(invoice.closingBalance || 0),
  paymentDate: invoice.paymentDate,
  createdAt: invoice.createdAt,
  updatedAt: invoice.updatedAt,
});

export async function getMineInvoices() {
  const session = await verifySession();
  if (!session) return [];

  const companyId = session.companyId as string;
  if (!companyId) redirect("/login");

  const invoices = await getMineInvoicesService(companyId);
  return Array.isArray(invoices) ? invoices.map(mapInvoice) : [];
}

export async function getMineInvoiceById(id: string) {
  const invoice = await getMineInvoiceByIdService(id);
  return invoice ? mapInvoice(invoice) : null;
}
