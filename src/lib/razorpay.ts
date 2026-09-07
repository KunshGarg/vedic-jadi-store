import Razorpay from "razorpay";
import crypto from "crypto";

// Server-side only. Requires RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET env vars,
// set in your hosting platform's environment variables (never committed to git).
export function getRazorpayInstance() {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) {
    throw new Error(
      "Missing RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET environment variables"
    );
  }
  return new Razorpay({ key_id, key_secret });
}

// Verifies the signature Razorpay returns to the browser after a successful
// checkout. Formula per Razorpay docs: HMAC-SHA256(order_id + "|" + payment_id, key_secret)
export function verifyRazorpaySignature(params: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_secret) {
    throw new Error("Missing RAZORPAY_KEY_SECRET environment variable");
  }
  const expected = crypto
    .createHmac("sha256", key_secret)
    .update(`${params.orderId}|${params.paymentId}`)
    .digest("hex");

  // timing-safe comparison
  const expectedBuf = Buffer.from(expected);
  const actualBuf = Buffer.from(params.signature);
  if (expectedBuf.length !== actualBuf.length) return false;
  return crypto.timingSafeEqual(expectedBuf, actualBuf);
}

// Verifies a Razorpay webhook payload signature.
// Set RAZORPAY_WEBHOOK_SECRET to the secret you configure in the Razorpay
// Dashboard under Settings > Webhooks. This is a stronger guarantee than the
// client-side verification above because it comes server-to-server.
export function verifyRazorpayWebhookSignature(params: {
  rawBody: string;
  signature: string;
}): boolean {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error("Missing RAZORPAY_WEBHOOK_SECRET environment variable");
  }
  const expected = crypto
    .createHmac("sha256", webhookSecret)
    .update(params.rawBody)
    .digest("hex");
  const expectedBuf = Buffer.from(expected);
  const actualBuf = Buffer.from(params.signature);
  if (expectedBuf.length !== actualBuf.length) return false;
  return crypto.timingSafeEqual(expectedBuf, actualBuf);
}
