import { verifySession } from "@/lib/dal";
import { connectDB } from "@/lib/db";
import Company from "@/models/company";
import User from "@/models/user";
import { Types } from "mongoose";
import { cache } from "react";

export const getUser = cache(async (userData: any) => {
  await connectDB();
  return await User.findOne(userData);
});

export const getSessionUser = cache(async () => {
  await connectDB();
  const session = await verifySession();
  if (!session) return null;

  const userId = session?.userId as string;
  const company = (await Company.findOne({
    userId: new Types.ObjectId(userId),
  })) as any;

  if (!company) return null;

  return {
    name: company.name,
    email: company.contactEmail,
    contactNumber: company.contactPhone,
  };
});

export const isUserExists = async (email: string) => {
  try {
    await connectDB();
    const user = await getUser({ email });

    return !!user;
  } catch (error) {
    console.log("Failed to fetch user");
    return null;
  }
};
