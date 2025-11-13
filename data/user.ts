import { verifySession } from "@/lib/dal";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
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
  const user = (await User.findById(userId, "name email contactNumber")) as any;
  if (!user) return null;

  const { name, email, contactNumber } = user;
  return { name, email, contactNumber };
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
