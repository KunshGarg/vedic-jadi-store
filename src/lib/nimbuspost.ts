// NimbusPost integration.
//
// IMPORTANT — verify before going live:
// NimbusPost's publicly documented request/response schema is inconsistent
// across sources (their own SDKs describe both an email+password login flow
// and an API-key header flow). This file implements the commonly documented
// email+password login -> bearer token -> create shipment flow. Before your
// first real order, log into your NimbusPost dashboard (Settings > API),
// pull the current Postman collection for your account, and confirm the
// field names below (especially the pickup location identifier and the
// exact create-shipment payload) match what your account expects. This is
// flagged again in the deployment README.

const NIMBUSPOST_BASE_URL = "https://api.nimbuspost.com/api";

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getNimbuspostToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token;
  }

  const email = process.env.NIMBUSPOST_EMAIL;
  const password = process.env.NIMBUSPOST_PASSWORD;
  if (!email || !password) {
    throw new Error("Missing NIMBUSPOST_EMAIL / NIMBUSPOST_PASSWORD environment variables");
  }

  const res = await fetch(`${NIMBUSPOST_BASE_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`NimbusPost login failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  const token: string | undefined = data?.data;
  if (!token) {
    throw new Error(`NimbusPost login response missing token: ${JSON.stringify(data)}`);
  }

  // Tokens are commonly valid ~24h; cache for 20h to be safe.
  cachedToken = { token, expiresAt: Date.now() + 1000 * 60 * 60 * 20 };
  return token;
}

export type ShipmentInput = {
  orderNumber: string; // your own order id, e.g. the Razorpay order id or an internal one
  orderDate: string; // "YYYY-MM-DD"
  paymentType: "prepaid" | "cod";
  orderAmount: number; // total order value in INR
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
  items: { name: string; quantity: number; price: number }[];
  totalWeightGrams: number;
  dimensionsCm?: { length: number; breadth: number; height: number };
};

export async function createNimbuspostShipment(input: ShipmentInput) {
  const token = await getNimbuspostToken();

  const pickupLocation = process.env.NIMBUSPOST_PICKUP_LOCATION;
  if (!pickupLocation) {
    throw new Error(
      "Missing NIMBUSPOST_PICKUP_LOCATION environment variable (the pickup location name/id configured in your NimbusPost dashboard)"
    );
  }

  const payload = {
    order_number: input.orderNumber,
    order_date: input.orderDate,
    payment_type: input.paymentType === "cod" ? "COD" : "Prepaid",
    order_amount: input.orderAmount,
    package_weight: input.totalWeightGrams,
    package_length: input.dimensionsCm?.length ?? 15,
    package_breadth: input.dimensionsCm?.breadth ?? 12,
    package_height: input.dimensionsCm?.height ?? 8,
    request_auto_pickup: "yes",
    pickup_location: pickupLocation,
    consignee: {
      name: input.customer.name,
      phone: input.customer.phone,
      address: [input.customer.addressLine1, input.customer.addressLine2]
        .filter(Boolean)
        .join(", "),
      city: input.customer.city,
      state: input.customer.state,
      pincode: input.customer.pincode,
    },
    order_items: input.items.map((item) => ({
      name: item.name,
      qty: item.quantity,
      price: item.price,
    })),
  };

  const res = await fetch(`${NIMBUSPOST_BASE_URL}/shipments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`NimbusPost shipment creation failed (${res.status}): ${text}`);
  }

  return res.json();
}

// Optional: check whether a pincode is serviceable before checkout.
export async function checkServiceability(pincode: string) {
  const token = await getNimbuspostToken();
  const res = await fetch(
    `${NIMBUSPOST_BASE_URL}/courier/serviceability?pickup_pincode=${encodeURIComponent(
      process.env.NIMBUSPOST_PICKUP_PINCODE ?? ""
    )}&delivery_pincode=${encodeURIComponent(pincode)}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) return { serviceable: false };
  const data = await res.json();
  return { serviceable: Boolean(data?.data?.length), raw: data };
}
