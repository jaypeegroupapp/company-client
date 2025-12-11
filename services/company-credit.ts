import { connectDB } from "@/lib/db";
import Company from "@/models/company";
import CompanyCredit from "@/models/company-credit";
import CompanyCreditTrail from "@/models/company-credit-trail";
import mongoose, { Types } from "mongoose";

export async function getCompanyCreditsByCompanyIdService(companyId: string) {
  await connectDB();

  return await CompanyCredit.find({
    companyId: new Types.ObjectId(companyId),
  })
    .populate("mineId") // so we get mine.name
    .lean();
}

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
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const company = await Company.findById(companyId).session(session);
    if (!company) throw new Error("Company not found");

    const companyCredit = await CompanyCredit.findOne({ companyId }).session(
      session
    );
    if (!companyCredit) throw new Error("Company credit not found");

    const debitBalance = company.debitAmount - company.usedDebit;
    const creditBalance = companyCredit.creditLimit - companyCredit.usedCredit;

    if (debitBalance + creditBalance < data.amount) {
      throw new Error("Insufficient funds");
    }

    // Calculate how much to deduct from debit and credit
    let debitUsed = 0;
    let creditUsed = 0;

    if (debitBalance >= data.amount) {
      debitUsed = data.amount;
      company.usedDebit += debitUsed;
    } else {
      debitUsed = debitBalance;
      creditUsed = data.amount - debitBalance;
      company.usedDebit += debitUsed;
      companyCredit.usedCredit += creditUsed;
    }

    const oldBalance = debitBalance + creditBalance;
    const newBalance = oldBalance - data.amount;

    await company.save({ session });
    await companyCredit.save({ session });

    await CompanyCreditTrail.create(
      [
        {
          companyId: company._id,
          type: data.type,
          amount: data.amount,
          oldBalance,
          newBalance,
          description: data.reason || "Credit updated via system",
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return { oldBalance, newBalance };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("❌ updateCompanyCreditService failed:", error);
    throw new Error(
      error instanceof Error ? error.message : "Transaction failed"
    );
  }
}
