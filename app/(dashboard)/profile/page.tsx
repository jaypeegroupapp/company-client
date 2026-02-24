import { ProfileClient } from "@/components/(dashboard)/profile/client";
import { getCompanySession } from "@/data/company";
import { getSessionUser } from "@/data/user";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await getSessionUser();
  const company = await getCompanySession();

  return <ProfileClient user={user} company={company!} />;
}
