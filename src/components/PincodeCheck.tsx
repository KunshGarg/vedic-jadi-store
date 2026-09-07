"use client";

import { useState } from "react";

export default function PincodeCheck() {
  const [pincode, setPincode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "yes" | "no" | "error">("idle");

  async function check() {
    if (!/^\d{6}$/.test(pincode)) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch(`/api/nimbuspost/serviceability?pincode=${pincode}`);
      const data = await res.json();
      setStatus(data.serviceable ? "yes" : "no");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div>
      <div className="flex gap-2">
        <input
          value={pincode}
          onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder="Enter pincode"
          className="w-40 rounded-full border border-black/10 px-4 py-2 text-sm"
        />
        <button
          onClick={check}
          className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium hover:border-[var(--brand)] hover:text-[var(--brand)]"
        >
          Check delivery
        </button>
      </div>
      {status === "yes" && (
        <p className="mt-2 text-sm text-green-700">Delivery available to this pincode.</p>
      )}
      {status === "no" && (
        <p className="mt-2 text-sm text-red-600">Sorry, we don&apos;t deliver here yet.</p>
      )}
      {status === "error" && (
        <p className="mt-2 text-sm text-[var(--foreground)]/50">Enter a valid 6-digit pincode.</p>
      )}
    </div>
  );
}
