"use client";

import { FileText } from "lucide-react";
import { ICompanyInvoice } from "@/definitions/company-invoice";
import { InvoiceStatusBadge } from "./status-badge";

export function InvoiceSummary({
  invoice,
  totalInvoiceAmount,
}: {
  invoice: ICompanyInvoice;
  totalInvoiceAmount: number;
}) {
  const formattedPaymentDate = invoice.paymentDate
    ? new Date(invoice.paymentDate).toLocaleDateString("en-ZA")
    : "-";

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
        <div className="flex md:flex-row flex-col space-y-4 md:space-y-0 justify-between">
          {/* Left */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
              <FileText size={24} />
            </div>

            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-800">
                Invoice #{invoice.id?.slice(-6).toUpperCase()}
              </h2>

              <p className="text-sm text-gray-500">
                Created on{" "}
                {new Date(invoice.createdAt!).toLocaleDateString("en-ZA")}
              </p>

              <div className="mt-2">
                <InvoiceStatusBadge status={invoice.status} />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 my-4" />

        {/* Invoice Summary Grid */}
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <p className="text-gray-500">Company</p>
            <p className="font-medium">{invoice.companyName}</p>
          </div>

          <div>
            <p className="text-gray-500">Total Amount</p>
            <p className="font-semibold text-gray-900">
              R{totalInvoiceAmount.toFixed(2)}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Payment Date</p>
            <p className="font-medium">{formattedPaymentDate}</p>
          </div>

          <div>
            <p className="text-gray-500">Status</p>
            <p className="font-medium capitalize">{invoice.status}</p>
          </div>
        </div>
      </div>
    </>
  );
}
