import ProductCard from "@/components/ProductCard";
import TrustBar from "@/components/TrustBar";
import { products } from "@/data/products";
import { siteConfig } from "@/lib/site-config";

export default function Home() {
  return (
    <main>
      <section className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
        <p className="text-sm font-medium uppercase tracking-widest text-[var(--accent)]">
          {siteConfig.heroKicker}
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[var(--brand-dark)] sm:text-5xl">
          {siteConfig.heroHeadline}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-[var(--foreground)]/70">
          {siteConfig.heroSubtext}
        </p>
        <p className="mt-2 text-sm italic text-[var(--foreground)]/50">{siteConfig.philosophy}</p>
        <a
          href="#shop"
          className="mt-8 inline-block rounded-full bg-[var(--brand)] px-8 py-3 text-sm font-semibold text-white hover:bg-[var(--brand-dark)]"
        >
          Shop now
        </a>
      </section>

      <TrustBar />

      <section id="shop" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="mb-8 text-2xl font-semibold text-[var(--brand-dark)]">Our Rituals</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
