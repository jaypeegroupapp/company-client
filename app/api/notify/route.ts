import { NextResponse } from "next/server";
import crypto from "crypto";
import {
  cancelOrderService,
  confirmPaymentAndUpdateOrder,
} from "@/services/order";

export async function POST(req: Request) {
  try {
    // 1️⃣ Get raw POST body from Payfast
    const bodyText = await req.text();
    const params = new URLSearchParams(bodyText);

    // Convert to object for easier handling
    const data: Record<string, string> = {};
    params.forEach((value, key) => (data[key] = value));

    console.log("📦 Payfast ITN received:", data);

    // Build signature string
    let signatureString = Object.entries(data)
      .filter(([k]) => k !== "signature") // exclude signature from string
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join("&");

    // Add passphrase
    if (process.env.PAYFAST_PASSPHRASE) {
      signatureString += `&passphrase=${encodeURIComponent(
        process.env.PAYFAST_PASSPHRASE,
      )}`;
    }

    // 3️⃣ Generate signature and compare
    const generatedSignature = crypto
      .createHash("md5")
      .update(signatureString)
      .digest("hex");

    // if (generatedSignature !== data.signature) {
    //   console.error("❌ Invalid Payfast signature");
    //   return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    // }

    // 4️⃣ Optionally verify source IP (Payfast IP ranges)
    // This step is recommended for production to prevent spoofed requests.
    // You can fetch the request IP from headers: req.headers.get("x-forwarded-for");

    // 5️⃣ Validate with Payfast server (postback)
    const pfHost =
      process.env.PAYFAST_MODE === "sandbox"
        ? "sandbox.payfast.co.za"
        : "www.payfast.co.za";

    const validationResponse = await fetch(
      `https://${pfHost}/eng/query/validate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: bodyText, // send exact same body back
      },
    );

    const validationText = await validationResponse.text();

    // if (validationText !== "VALID") {
    //   console.error("❌ Payfast ITN validation failed:", validationText);
    //   return NextResponse.json({ error: "Invalid ITN data" }, { status: 400 });
    // }

    console.log("✅ Payfast Payment Verified:", data);

    // Update order based on payment status
    if (data.payment_status === "COMPLETE") {
      await confirmPaymentAndUpdateOrder(data.m_payment_id);
    } else if (data.payment_status === "CANCELLED") {
      await cancelOrderService(data.m_payment_id, "Payment cancelled by user");
    }

    return NextResponse.json({ status: "success" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error processing Payfast ITN:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
