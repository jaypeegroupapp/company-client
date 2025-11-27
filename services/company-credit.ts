import { connectDB } from "@/lib/db";
import Company from "@/models/company";
import CompanyCreditTrail from "@/models/company-credit-trail";

export async function updateCompanyCreditService(
  companyId: string,
  data: {
    amount: number;
    reason?: string;
    type:
      | "credit-updated"
      | "order-debit"
      | "invoice-paid"
      | "admin-adjustment";
  }
) {
  await connectDB();

  const company = await Company.findById(companyId);
  if (!company) throw new Error("Company not found");

  const oldBalance = company.balance ?? 0;
  const newBalance = oldBalance + data.amount;

  // Update company balance
  company.balance = newBalance;
  await company.save();

  // Record credit trail
  await CompanyCreditTrail.create({
    companyId: company._id,
    type: data.type,
    amount: data.amount,
    oldBalance,
    newBalance,
    description: data.reason || "Credit updated via system",
  });

  return { oldBalance, newBalance };
}
