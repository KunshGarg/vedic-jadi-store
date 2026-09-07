"use client";

import { useRouter } from "next/navigation";
import Script from "next/script";
import { useState } from "react";
import { useCartStore } from "@/lib/cart-store";
import { siteConfig } from "@/lib/site-config";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
    };
  }
}

type FormState = {
  name: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
};

const emptyForm: FormState = {
  name: "",
  phone: "",
  email: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const clearCart = useCartStore((s) => s.clear);

  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const requiredFieldsFilled =
    form.name && form.phone && form.addressLine1 && form.city && form.state && /^\d{6}$/.test(form.pincode);

  async function handlePay() {
    if (items.length === 0) return;
    setError(null);
    setSubmitting(true);
    try {
      const orderRes = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ slug: i.slug, quantity: i.quantity })),
        }),
      });
      const order = await orderRes.json();
      if (!orderRes.ok) throw new Error(order.error ?? "Could not start payment");

      if (!scriptReady || !window.Razorpay) {
        throw new Error("Payment script hasn't loaded yet — try again in a moment.");
      }

      const razorpay = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: siteConfig.brandName,
        description: "Order payment",
        order_id: order.orderId,
        prefill: {
          name: form.name,
          contact: form.phone,
          email: form.email || undefined,
        },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...response,
                customer: form,
                items: items.map((i) => ({ slug: i.slug, quantity: i.quantity })),
                total: order.total,
              }),
            });
            const result = await verifyRes.json();
            if (!verifyRes.ok || !result.verified) {
              throw new Error(result.error ?? "Payment verification failed");
            }
            clearCart();
            router.push(
              `/order-confirmed?payment_id=${response.razorpay_payment_id}&order_id=${response.razorpay_order_id}`
            );
          } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong after payment.");
          }
        },
        modal: {
          ondismiss: () => setSubmitting(false),
        },
        theme: { color: "#2f5233" },
      });

      razorpay.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
        <p className="text-[var(--foreground)]/70">Your cart is empty.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setScriptReady(true)}
      />
      <h1 className="text-2xl font-semibold text-[var(--brand-dark)]">Checkout</h1>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <input
          className="rounded-lg border border-black/10 px-4 py-3 text-sm sm:col-span-2"
          placeholder="Full name"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
        />
        <input
          className="rounded-lg border border-black/10 px-4 py-3 text-sm"
          placeholder="Phone number"
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
        />
        <input
          className="rounded-lg border border-black/10 px-4 py-3 text-sm"
          placeholder="Email (optional)"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
        />
        <input
          className="rounded-lg border border-black/10 px-4 py-3 text-sm sm:col-span-2"
          placeholder="Address line 1"
          value={form.addressLine1}
          onChange={(e) => update("addressLine1", e.target.value)}
        />
        <input
          className="rounded-lg border border-black/10 px-4 py-3 text-sm sm:col-span-2"
          placeholder="Address line 2 (optional)"
          value={form.addressLine2}
          onChange={(e) => update("addressLine2", e.target.value)}
        />
        <input
          className="rounded-lg border border-black/10 px-4 py-3 text-sm"
          placeholder="City"
          value={form.city}
          onChange={(e) => update("city", e.target.value)}
        />
        <input
          className="rounded-lg border border-black/10 px-4 py-3 text-sm"
          placeholder="State"
          value={form.state}
          onChange={(e) => update("state", e.target.value)}
        />
        <input
          className="rounded-lg border border-black/10 px-4 py-3 text-sm"
          placeholder="Pincode"
          value={form.pincode}
          onChange={(e) => update("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
        />
      </div>

      <div className="mt-8 rounded-2xl border border-black/10 p-5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[var(--foreground)]/60">Subtotal</span>
          <span className="font-semibold">₹{subtotal}</span>
        </div>
        <p className="mt-1 text-xs text-[var(--foreground)]/50">
          Shipping is calculated and added when payment starts.
        </p>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <button
        disabled={!requiredFieldsFilled || submitting}
        onClick={handlePay}
        className="mt-6 w-full rounded-full bg-[var(--brand)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--brand-dark)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "Processing…" : "Pay with Razorpay"}
      </button>
    </main>
  );
}
