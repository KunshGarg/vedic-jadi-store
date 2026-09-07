import { notFound } from "next/navigation";
import Image from "next/image";
import { getProductBySlug, products } from "@/data/products";
import AddToCartButton from "@/components/AddToCartButton";
import PincodeCheck from "@/components/PincodeCheck";
import TrustBar from "@/components/TrustBar";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const discountPct = product.mrp
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : null;

  return (
    <>
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-[var(--brand)]/5">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-contain p-10"
              priority
            />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-[var(--brand-dark)]">{product.name}</h1>
            <p className="mt-2 text-[var(--foreground)]/70">{product.shortDescription}</p>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-2xl font-semibold">₹{product.price}</span>
              {product.mrp && (
                <span className="text-[var(--foreground)]/40 line-through">₹{product.mrp}</span>
              )}
              {discountPct && (
                <span className="rounded-full bg-[var(--accent)]/15 px-2 py-0.5 text-xs font-semibold text-[var(--accent)]">
                  {discountPct}% off
                </span>
              )}
            </div>

            <div className="mt-6">
              <AddToCartButton product={product} />
            </div>

            <div className="mt-6">
              <PincodeCheck />
            </div>

            <div className="mt-10 whitespace-pre-line text-sm leading-relaxed text-[var(--foreground)]/80">
              {product.description}
            </div>

            {product.ingredients && (
              <div className="mt-6">
                <h2 className="text-sm font-semibold text-[var(--brand-dark)]">Ingredients</h2>
                <p className="mt-1 text-sm text-[var(--foreground)]/70">{product.ingredients}</p>
              </div>
            )}

            {product.usage && (
              <div className="mt-6">
                <h2 className="text-sm font-semibold text-[var(--brand-dark)]">How to use</h2>
                <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-[var(--foreground)]/80">
                  {product.usage.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
            )}

            {product.benefits && (
              <div className="mt-6">
                <h2 className="text-sm font-semibold text-[var(--brand-dark)]">Benefits</h2>
                <ul className="mt-2 space-y-1 text-sm text-[var(--foreground)]/80">
                  {product.benefits.map((b, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-[var(--brand)]">✓</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.note && (
              <p className="mt-6 text-xs italic text-[var(--foreground)]/50">{product.note}</p>
            )}
          </div>
        </div>
      </main>
      <TrustBar />
    </>
  );
}
