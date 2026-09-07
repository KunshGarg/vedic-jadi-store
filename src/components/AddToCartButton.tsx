"use client";

import { useState } from "react";
import { Product } from "@/data/products";
import { useCartStore } from "@/lib/cart-store";
import { useUIStore } from "@/lib/ui-store";

export default function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useUIStore((s) => s.openCart);
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="flex items-center gap-3">
      <div className="inline-flex items-center rounded-full border border-black/10">
        <button
          className="px-4 py-2 text-lg"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
        >
          −
        </button>
        <span className="w-8 text-center">{quantity}</span>
        <button className="px-4 py-2 text-lg" onClick={() => setQuantity((q) => q + 1)}>
          +
        </button>
      </div>
      <button
        disabled={!product.inStock}
        onClick={() => {
          addItem(
            {
              slug: product.slug,
              name: product.name,
              price: product.price,
              weightInGrams: product.weightInGrams,
              image: product.images[0],
            },
            quantity
          );
          openCart();
        }}
        className="flex-1 rounded-full bg-[var(--brand)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--brand-dark)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {product.inStock ? "Add to cart" : "Out of stock"}
      </button>
    </div>
  );
}
