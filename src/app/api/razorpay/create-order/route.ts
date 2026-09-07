import { NextRequest, NextResponse } from "next/server";
import { getRazorpayInstance } from "@/lib/razorpay";
import { products } from "@/data/products";

// Flat shipping fee in INR, used when computing the order total server-side.
// Replace with real logic (e.g. by weight/pincode) once you're ready.
const SHIPPING_FEE = 60;
const FREE_SHIPPING_THRESHOLD = 999;

type IncomingItem = { slug: string; quantity: number };

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const items: IncomingItem[] = body.items ?? [];

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Never trust a client-supplied amount — recompute from the product catalog.
    let subtotal = 0;
    for (const item of items) {
      const product = products.find((p) => p.slug === item.slug);
      if (!product) {
        return NextResponse.json(
          { error: `Unknown product: ${item.slug}` },
          { status: 400 }
        );
      }
      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        return NextResponse.json(
          { error: `Invalid quantity for ${item.slug}` },
          { status: 400 }
        );
      }
      subtotal += product.price * item.quantity;
    }

    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    const total = subtotal + shipping;

    const razorpay = getRazorpayInstance();
    const order = await razorpay.orders.create({
      amount: Math.round(total * 100), // Razorpay wants the amount in paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      notes: {
        items: JSON.stringify(items),
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID, // public key id, safe to expose
      subtotal,
      shipping,
      total,
    });
  } catch (err) {
    console.error("create-order error", err);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
