import Link from "next/link";
import { Suspense } from "react";

function Confirmation({
  searchParams,
}: {
  searchParams: { payment_id?: string; order_id?: string };
}) {
  return (
    <main className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
      <h1 className="text-3xl font-semibold text-[var(--brand-dark)]">Order confirmed!</h1>
      <p className="mt-3 text-[var(--foreground)]/70">
        Thank you — your payment was successful and your order is on its way to being shipped.
      </p>
      {searchParams.payment_id && (
        <p className="mt-6 text-xs text-[var(--foreground)]/50">
          Payment ID: {searchParams.payment_id}
          <br />
          Order ID: {searchParams.order_id}
        </p>
      )}
      <Link
        href="/"
        className="mt-10 inline-block rounded-full bg-[var(--brand)] px-8 py-3 text-sm font-semibold text-white hover:bg-[var(--brand-dark)]"
      >
        Continue shopping
      </Link>
    </main>
  );
}

export default async function OrderConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ payment_id?: string; order_id?: string }>;
}) {
  const params = await searchParams;
  return (
    <Suspense>
      <Confirmation searchParams={params} />
    </Suspense>
  );
}
