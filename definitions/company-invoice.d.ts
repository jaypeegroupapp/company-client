// definitions/company-invoice.ts
export interface ICompanyInvoice {
  id?: string;
  companyId: string;
  companyName?: string;
  status: "published" | "paid" | "closed";
  totalAmount: number;
  paymentDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type InvoiceTab = "All" | "Published" | "Paid" | "Closed";
