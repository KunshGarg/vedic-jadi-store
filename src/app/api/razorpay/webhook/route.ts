import { NextRequest, NextResponse } from "next/server";
import { verifyRazorpayWebhookSignature } from "@/lib/razorpay";

// Optional but recommended for production: configure this URL
// (https://yourdomain.com/api/razorpay/webhook) in the Razorpay Dashboard
// under Settings > Webhooks, subscribed to the "payment.captured" event, and
// set RAZORPAY_WEBHOOK_SECRET to the secret shown there.
//
// This gives you a server-to-server confirmation of payment that doesn't
// depend on the customer's browser successfully calling /api/razorpay/verify
// (e.g. if they closed the tab right after paying).
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let isValid = false;
  try {
    isValid = verifyRazorpayWebhookSignature({ rawBody, signature });
  } catch (err) {
    console.error("Webhook signature verification error", err);
    return NextResponse.json({ error: "Verification error" }, { status: 500 });
  }

  if (!isValid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(rawBody);
  console.log("Razorpay webhook event:", event.event);

  // TODO: if you rely on this webhook as your source of truth (recommended
  // for production), record the payment/order here — e.g. write to a
  // database — rather than only relying on /api/razorpay/verify.

  return NextResponse.json({ received: true });
}
