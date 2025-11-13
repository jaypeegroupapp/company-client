import { ProfileClient } from "@/components/(dashboard)/profile/client";
import { getSessionUser } from "@/data/user";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await getSessionUser();

  return <ProfileClient user={user} />;
}
