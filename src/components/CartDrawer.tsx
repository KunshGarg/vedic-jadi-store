"use client";

import Link from "next/link";
import Image from "next/image";
import { useUIStore } from "@/lib/ui-store";
import { useCartStore } from "@/lib/cart-store";
import { useMounted } from "@/lib/use-mounted";

export default function CartDrawer() {
  const isOpen = useUIStore((s) => s.isCartOpen);
  const closeCart = useUIStore((s) => s.closeCart);
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = useCartStore((s) => s.subtotal());

  const mounted = useMounted();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        aria-label="Close cart"
        className="absolute inset-0 bg-black/40"
        onClick={closeCart}
      />
      <div className="relative flex h-full w-full max-w-md flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-black/10 p-5">
          <h2 className="text-lg font-semibold text-[var(--brand-dark)]">Your Cart</h2>
          <button onClick={closeCart} className="text-sm text-[var(--foreground)]/60 hover:text-[var(--foreground)]">
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {!mounted || items.length === 0 ? (
            <p className="text-sm text-[var(--foreground)]/60">Your cart is empty.</p>
          ) : (
            <ul className="space-y-5">
              {items.map((item) => (
                <li key={item.slug} className="flex gap-4">
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-[var(--brand)]/5">
                    <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between">
                      <p className="text-sm font-medium">{item.name}</p>
                      <button
                        onClick={() => removeItem(item.slug)}
                        className="text-xs text-[var(--foreground)]/40 hover:text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                    <p className="text-sm text-[var(--foreground)]/60">₹{item.price}</p>
                    <div className="mt-2 inline-flex w-fit items-center rounded-full border border-black/10">
                      <button
                        className="px-3 py-1 text-sm"
                        onClick={() => setQuantity(item.slug, item.quantity - 1)}
                      >
                        −
                      </button>
                      <span className="px-2 text-sm">{item.quantity}</span>
                      <button
                        className="px-3 py-1 text-sm"
                        onClick={() => setQuantity(item.slug, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {mounted && items.length > 0 && (
          <div className="border-t border-black/10 p-5">
            <div className="mb-4 flex items-center justify-between text-sm">
              <span className="text-[var(--foreground)]/60">Subtotal</span>
              <span className="font-semibold">₹{subtotal}</span>
            </div>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="block w-full rounded-full bg-[var(--brand)] px-6 py-3 text-center text-sm font-semibold text-white hover:bg-[var(--brand-dark)]"
            >
              Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
