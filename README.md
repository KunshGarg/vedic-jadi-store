# Vedic Jadi storefront

A custom storefront for Dhan Lakshmi Global (Vedic Jadi), built with Next.js.
Includes Razorpay checkout and NimbusPost shipment creation.

## What's in here

- `src/data/products.ts` — your product catalog (**placeholder data — replace this**)
- `src/lib/site-config.ts` — business name, tagline, support contact (**replace the REPLACE_WITH_ fields**)
- `src/app/checkout/page.tsx` — checkout form + Razorpay Checkout widget
- `src/app/api/razorpay/*` — order creation, payment signature verification, optional webhook
- `src/lib/nimbuspost.ts` + `src/app/api/nimbuspost/*` — shipment creation and pincode serviceability check

## 1. Run it locally

```bash
npm install
cp .env.example .env.local   # fill in your real keys (see below)
npm run dev
```

Open http://localhost:3000

## 2. Fill in your content

- Edit `src/data/products.ts` with your real products, prices, descriptions.
- Add real product photos to `public/products/` and point each product's `images` array at them.
- Edit `src/lib/site-config.ts` with your support email/phone.

## 3. Get your API keys

**Razorpay** — Dashboard → Settings → API Keys. Use the *test* key while developing,
switch to the *live* key only once you've placed a real test order successfully.

**NimbusPost** — the login (email/password) you use at ship.nimbuspost.com, plus the
pickup location name configured under Settings → Pickup Addresses.

⚠️ Important: `src/lib/nimbuspost.ts` implements NimbusPost's commonly documented
login → bearer token → create-shipment flow, but NimbusPost's publicly available
docs are inconsistent about exact field names. **Before your first live order**,
log into your NimbusPost dashboard, open your account's API/Postman docs, and
confirm the request fields in `createNimbuspostShipment` match what your account
expects — then place one real test order end-to-end and check the shipment
actually appears correctly in your NimbusPost dashboard.

Never put real secret keys in files that get committed to git — they belong in
`.env.local` (ignored by git) locally, and in your hosting platform's environment
variable settings in production.

## 4. Deploy live on Vercel

1. Push this project to a GitHub repository.
2. Go to https://vercel.com/new and import that repository.
3. In the "Environment Variables" step, add every variable from `.env.example`
   with your real values (use your **live** Razorpay keys once ready).
4. Deploy.
5. Go to your Vercel project → Settings → Domains → add your domain (the one you
   already own). Vercel will show you either an A record or a CNAME record to add —
   add that record at your domain registrar's DNS settings. It typically goes live
   within a few minutes to a few hours.

## 5. Go live checklist

- [ ] Real products, prices, images, descriptions in place
- [ ] Support email/phone filled in
- [ ] Razorpay **test** key used for a full test purchase, payment shows in Razorpay dashboard
- [ ] NimbusPost shipment fields verified against your account's docs, test shipment appears in NimbusPost dashboard
- [ ] Switched to Razorpay **live** keys in Vercel env vars
- [ ] Domain connected and showing your store (not the Vercel default URL)
- [ ] Razorpay webhook configured (optional, recommended) pointing at `https://yourdomain.com/api/razorpay/webhook`

## Notes

- Shipping fee logic is a flat ₹60 (free over ₹999) in
  `src/app/api/razorpay/create-order/route.ts` — adjust as needed.
- There's currently no order database — Razorpay's dashboard and NimbusPost's
  dashboard are your record of orders and shipments. If you want an internal
  order history/admin view later, that's a natural next step (e.g. a small
  database like Supabase).
