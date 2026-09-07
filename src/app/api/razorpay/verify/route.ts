import { NextRequest, NextResponse } from "next/server";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { createNimbuspostShipment } from "@/lib/nimbuspost";
import { products } from "@/data/products";

type VerifyBody = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: { slug: string; quantity: number }[];
  total: number;
};

export async function POST(req: NextRequest) {
  try {
    const body: VerifyBody = await req.json();

    const isValid = verifyRazorpaySignature({
      orderId: body.razorpay_order_id,
      paymentId: body.razorpay_payment_id,
      signature: body.razorpay_signature,
    });

    if (!isValid) {
      return NextResponse.json({ error: "Signature verification failed" }, { status: 400 });
    }

    // Payment is confirmed genuine. Now create the shipment in NimbusPost.
    const lineItems = body.items.map((item) => {
      const product = products.find((p) => p.slug === item.slug);
      return {
        name: product?.name ?? item.slug,
        quantity: item.quantity,
        price: product?.price ?? 0,
      };
    });

    const totalWeightGrams = body.items.reduce((sum, item) => {
      const product = products.find((p) => p.slug === item.slug);
      return sum + (product?.weightInGrams ?? 100) * item.quantity;
    }, 0);

    let shipment = null;
    let shipmentError: string | null = null;
    try {
      shipment = await createNimbuspostShipment({
        orderNumber: body.razorpay_order_id,
        orderDate: new Date().toISOString().slice(0, 10),
        paymentType: "prepaid",
        orderAmount: body.total,
        customer: body.customer,
        items: lineItems,
        totalWeightGrams,
      });
    } catch (err) {
      // Payment already succeeded — don't fail the whole request if shipment
      // creation has a problem. Log it so you can create the shipment
      // manually from the NimbusPost dashboard, and surface it in the response.
      console.error("NimbusPost shipment creation failed", err);
      shipmentError = err instanceof Error ? err.message : "Unknown error";
    }

    return NextResponse.json({
      verified: true,
      paymentId: body.razorpay_payment_id,
      orderId: body.razorpay_order_id,
      shipment,
      shipmentError,
    });
  } catch (err) {
    console.error("verify error", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
