import { connectDB } from "@/lib/db";
import Company from "@/models/company";
import CompanyCredit from "@/models/company-credit";
import CompanyCreditTrail from "@/models/company-credit-trail";
import Mine from "@/models/mine";
import mongoose, { Types } from "mongoose";

export async function getCompanyCreditsByCompanyIdService(companyId: string) {
  await connectDB();

  const companyObjectId = new Types.ObjectId(companyId);

  const result = await Mine.aggregate([
    {
      $lookup: {
        from: "companycredits",
        localField: "_id",
        foreignField: "mineId",
        as: "credit",
        pipeline: [{ $match: { companyId: companyObjectId } }],
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
        creditId: "$credit._id",
        creditLimit: { $ifNull: ["$credit.creditLimit", 0] },
        usedCredit: { $ifNull: ["$credit.usedCredit", 0] },
      },
    },
  ]);

  return result;
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

    const debitBalance = company.debitAmount;
    const creditBalance = companyCredit.creditLimit - companyCredit.usedCredit;

    if (debitBalance + creditBalance < data.amount) {
      throw new Error("Insufficient funds");
    }

    // Calculate how much to deduct from debit and credit
    if (debitBalance >= data.amount) {
      company.debitAmount -= data.amount;
    } else {
      company.debitAmount -= debitBalance;
      companyCredit.usedCredit += data.amount - debitBalance;
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
