"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";
import { useUIStore } from "@/lib/ui-store";
import { siteConfig } from "@/lib/site-config";
import { useMounted } from "@/lib/use-mounted";

export default function Header() {
  const openCart = useUIStore((s) => s.openCart);
  const totalItems = useCartStore((s) => s.totalItems());

  // Avoid hydration mismatch: cart count comes from localStorage, only
  // trust it once mounted on the client.
  const mounted = useMounted();

  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-[var(--background)]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="text-lg font-semibold tracking-tight text-[var(--brand-dark)]">
          {siteConfig.brandName}
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium sm:flex">
          <Link href="/" className="hover:text-[var(--brand)]">
            Home
          </Link>
          <Link href="/#shop" className="hover:text-[var(--brand)]">
            Shop
          </Link>
        </nav>
        <button
          onClick={openCart}
          className="relative inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm font-medium hover:border-[var(--brand)] hover:text-[var(--brand)]"
        >
          Cart
          {mounted && totalItems > 0 && (
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--brand)] px-1 text-xs font-semibold text-white">
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
