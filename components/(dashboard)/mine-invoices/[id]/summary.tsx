"use client";

import { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import { IMineInvoice } from "@/definitions/mine-invoice";
import { InvoiceStatusBadge } from "./status-badge";
import { getCompanyDetails } from "@/data/company";
import { ICompany } from "@/definitions/company";

export function InvoiceSummary({
  invoice,
  breakdown,
}: {
  invoice: IMineInvoice;
  breakdown: {
    openingBalance: number;
    newOrdersAmount: number;
    totalActivity: number;
    paidWithDebit: number;
    paidWithCredit: number;
    cashPayment: number;
    outstandingBalance: number;
  };
}) {
  const [isDebitPayment, setIsDebitPayment] = useState(false);
  const [companyDetails, setCompanyDetails] = useState<ICompany | null>(null);

  const formattedPaymentDate = invoice.paymentDate
    ? new Date(invoice.paymentDate).toLocaleDateString("en-ZA")
    : "-";

  useEffect(() => {
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    const company = await getCompanyDetails();

    /* if (res.success && res.data) {
      setCompanyDetails(res.data);
      if (res.data.debitAmount >= breakdown.outstandingBalance) {
        setIsDebitPayment(true);
      }
    } */
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
        <div className="flex justify-between flex-col md:flex-row gap-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
              <FileText size={24} />
            </div>

            <div>
              <h2 className="text-lg font-semibold">
                Invoice #{invoice.id?.slice(-6).toUpperCase()} -{" "}
                {invoice.companyName}
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

        <div className="border-t pt-4 text-sm space-y-2">
          <div className="flex justify-between">
            <span>Opening Balance</span>
            <span>R {breakdown.openingBalance.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>New Orders (this month)</span>
            <span>R {breakdown.newOrdersAmount.toFixed(2)}</span>
          </div>

          <div className="flex justify-between font-semibold border-b pb-2">
            <span>Total Activity</span>
            <span>R {breakdown.totalActivity.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-purple-600">
            <span>Paid with Debit</span>
            <span>- R {breakdown.paidWithDebit.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-green-600">
            <span>Paid with Cash</span>
            <span>- R {breakdown.cashPayment.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-red-600 font-semibold border-t pt-2">
            <span>Outstanding Balance</span>
            <span>R {breakdown.outstandingBalance.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </>
  );
}
