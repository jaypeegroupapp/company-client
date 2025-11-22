import { getCompanyByUserId } from "@/services/company";
import { cache } from "react";

export const getCompany = cache(async (userData: any) => {
  return await getCompanyByUserId(userData);
});
