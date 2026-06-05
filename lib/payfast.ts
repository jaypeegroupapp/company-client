import { getSessionUser } from "@/data/user";

export async function createPaymentUrl(
  amount: number,
  productName: string,
  orderId: string,
) {
  const user = await getSessionUser();

  const email =
    process.env.PAYFAST_MODE === "sandbox"
      ? "admin@theugatour.com"
      : user?.email;
  const names = user?.name?.split(" ");
  const first = names[0];
  const last = names.length > 1 ? names[1] : "";

  // ✅ Validate input with zod schema
  const data: Record<string, string> = {
    merchant_id: process.env.PAYFAST_MERCHANT_ID!,
    merchant_key: process.env.PAYFAST_MERCHANT_KEY!,
    return_url: `${process.env.SITE_URL!}/${process.env.PAYFAST_RETURN_URL!}`,
    cancel_url: `${process.env.SITE_URL!}/${process.env.PAYFAST_CANCEL_URL!}`,
    notify_url: `${process.env.SITE_URL!}/${process.env.PAYFAST_NOTIFY_URL!}`,
    m_payment_id: orderId ?? `order-${Date.now()}`, // custom ID
    name_first: first,
    name_last: last,
    email_address: email, // sandbox email
    amount: amount.toFixed(2),
    item_name: productName,
    item_description: productName,
  };

  // 3️⃣ Build final encoded query string with signature
  const encodedQuery = Object.entries(data)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");

  const pfHost =
    process.env.PAYFAST_MODE === "sandbox"
      ? process.env.PAYFAST_SANDBOX_URL!
      : "https://www.payfast.co.za";

  return `${pfHost}/eng/process?${encodedQuery}`;
}
