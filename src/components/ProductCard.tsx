import Link from "next/link";
import Image from "next/image";
import { Product } from "@/data/products";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-black/10 bg-white transition hover:shadow-lg"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-[var(--brand)]/5">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          className="object-contain p-8 transition group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-5">
        <h3 className="font-semibold text-[var(--brand-dark)]">{product.name}</h3>
        <p className="line-clamp-2 text-sm text-[var(--foreground)]/70">
          {product.shortDescription}
        </p>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-semibold">₹{product.price}</span>
          {product.mrp && (
            <span className="text-sm text-[var(--foreground)]/40 line-through">
              ₹{product.mrp}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
