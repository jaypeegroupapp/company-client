// src/services/company-credit.ts
import { connectDB } from "@/lib/db";
import AccountStatementTrail from "@/models/account-statement-trail";
import Company from "@/models/company";
import CompanyCredit from "@/models/company-credit";
import CompanyCreditTrail from "@/models/company-credit-trail";
import Mine from "@/models/mine";
import mongoose, { Types } from "mongoose";

export async function getCompanyCreditsByCompanyIdService(companyId: string) {
  await connectDB();

  const companyObjectId = new Types.ObjectId(companyId);

  // Get all mines first
  const allMines = await Mine.aggregate([
    {
      $lookup: {
        from: "companycredits",
        let: { mineId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$mineId", "$$mineId"] },
                  { $eq: ["$companyId", companyObjectId] },
                  { $eq: ["$isActive", true] },
                ],
              },
            },
          },
        ],
        as: "credit",
      },
    },
    {
      $addFields: {
        credit: { $arrayElemAt: ["$credit", 0] },
      },
    },
    {
      $project: {
        id: "$_id",
        mineId: "$_id",
        mineName: "$name",
        creditId: { $ifNull: ["$credit._id", null] },
        creditLimit: { $ifNull: ["$credit.creditLimit", 0] },
        usedCredit: { $ifNull: ["$credit.usedCredit", 0] },
        status: { $ifNull: ["$credit.status", "settled"] },
        isActive: { $ifNull: ["$credit.isActive", false] },
        hasCredit: {
          $cond: { if: { $eq: ["$credit", null] }, then: false, else: true },
        },
      },
    },
    {
      $sort: { mineName: 1 },
    },
  ]);

  return allMines;
}

// src/services/company-credit.ts
export async function updateCompanyCreditService(
  companyId: string,
  mineId: string,
  data: {
    amount: number;
    reason?: string;
    type:
      | "credit-updated"
      | "order-debit"
      | "invoice-paid"
      | "admin-adjustment";
  },
) {
  await connectDB();
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Get company
    const company = await Company.findById(companyId).session(session);
    if (!company) throw new Error("Company not found");

    // Get company credit record (if exists)
    const companyCredit = await CompanyCredit.findOne({
      companyId,
      mineId,
    }).session(session);

    const debitBalance = company.debitAmount || 0;
    const creditBalance = companyCredit
      ? (companyCredit.creditLimit || 0) - (companyCredit.usedCredit || 0)
      : 0;
    const totalBalance = debitBalance + creditBalance;

    if (totalBalance < data.amount) {
      throw new Error(
        `Insufficient funds. Available: R ${totalBalance.toFixed(2)}, Required: R ${data.amount.toFixed(2)}`,
      );
    }

    // Track old balances for trail
    const oldTotalBalance = totalBalance;

    // Calculate how much to deduct from debit and credit
    let remainingAmount = data.amount;
    let debitDeducted = 0;
    let creditDeducted = 0;

    // First deduct from debit balance
    if (debitBalance > 0 && remainingAmount > 0) {
      debitDeducted = Math.min(debitBalance, remainingAmount);
      company.debitAmount = debitBalance - debitDeducted;
      remainingAmount -= debitDeducted;
    }

    // Then deduct from credit balance (if credit exists)
    if (remainingAmount > 0 && companyCredit) {
      creditDeducted = remainingAmount;
      companyCredit.usedCredit =
        (companyCredit.usedCredit || 0) + creditDeducted;
      await companyCredit.save({ session });
    } else if (remainingAmount > 0 && !companyCredit) {
      // If no credit exists but still have remaining amount, this shouldn't happen
      // because totalBalance check would have failed
      throw new Error("Insufficient debit balance and no credit available");
    }

    const newDebitBalance = company.debitAmount;
    const newCreditBalance = companyCredit
      ? (companyCredit.creditLimit || 0) - (companyCredit.usedCredit || 0)
      : 0;
    const newTotalBalance = newDebitBalance + newCreditBalance;

    // Save company updates
    await company.save({ session });

    // Create account statement trail
    await AccountStatementTrail.create(
      [
        {
          companyId: company._id,
          mineId: new mongoose.Types.ObjectId(mineId),
          type: data.type,
          amount: data.amount,
          oldBalance: oldTotalBalance,
          newBalance: newTotalBalance,
          description: data.reason || `Transaction: ${data.type}`,
        },
      ],
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    return {
      oldBalance: oldTotalBalance,
      newBalance: newTotalBalance,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("❌ updateCompanyCreditService failed:", error);
    throw new Error(
      error instanceof Error ? error.message : "Transaction failed",
    );
  }
}
