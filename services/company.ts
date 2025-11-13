import Company from "@/models/company";
import { connectDB } from "@/lib/db";
import { ICompany } from "@/definitions/company";
import { Types } from "mongoose";

// ✅ Create a new company
export async function createCompanyService(data: Partial<ICompany>) {
  await connectDB();
  const company = (await Company.create({
    ...data,
    userId: new Types.ObjectId(data.userId),
  })) as any;
  
  return company._id.toString();
}

// ✅ Update existing company
export async function updateCompanyService(
  companyId: string,
  data: Partial<ICompany>
) {
  await connectDB();
  const company = await Company.findByIdAndUpdate(companyId, data, {
    new: true,
  });
  return company;
}

// ✅ Delete company
export async function deleteCompanyService(companyId: string) {
  await connectDB();
  await Company.findByIdAndDelete(companyId);
  return { success: true };
}

// ✅ Get single company
export async function getCompanyById(companyId: string) {
  await connectDB();
  return await Company.findById(companyId);
}

// ✅ Get all companies
export async function getAllCompanies() {
  await connectDB();
  return await Company.find().sort({ createdAt: -1 });
}
