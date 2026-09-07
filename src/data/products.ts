// Real catalog, pulled from your current vedicjadi.shop store.
// Images are still the placeholder graphic — I couldn't fetch your product
// photos automatically (this sandbox can't reach vedicjadi.shop directly).
// Send me the 6 product photos (or export them from Shopify: Products > each
// product > download images) and I'll drop them into public/products/ and
// wire them up here.

export type Product = {
  slug: string;
  name: string;
  price: number; // online-payment price, in INR
  mrp?: number; // strike-through MRP
  shortDescription: string;
  description: string;
  ingredients?: string;
  usage?: string[];
  benefits?: string[];
  note?: string; // wellness disclaimer, shown below benefits
  images: string[];
  weightInGrams: number;
  inStock: boolean;
};

export const products: Product[] = [
  {
    slug: "sugar-balance-tea",
    name: "Sugar Balance Tea",
    price: 799,
    mrp: 899,
    shortDescription:
      "20 tea bags in a 200g pouch, designed for a familiar Indian milk-chai routine.",
    description:
      "Feels like chai, not a compromise. Sugar Balance Tea lets you keep your everyday milk-chai ritual while supporting a sugar-conscious routine — sugar-free and caffeine-free.",
    usage: [
      "Place one tea bag in a cup with hot water",
      "Let it infuse, then add warm milk to taste",
      "Enjoy without added sugar",
    ],
    benefits: [
      "Sugar-free, caffeine-free",
      "Milk chai-friendly — tastes like a normal evening chai",
      "Brews in 3-4 minutes, mild flavour, not bitter",
      "20 tea bags per 200g pouch",
    ],
    images: ["/products/placeholder.svg"],
    weightInGrams: 200,
    inStock: true,
  },
  {
    slug: "sugar-nabhi-oil",
    name: "Sugar Nabhi Oil",
    price: 549,
    mrp: 999,
    shortDescription: "Nabhya Dhira sugar-support belly button oil for a calm nightly ritual.",
    description:
      "An ayurvedic belly-button (nabhi) oil designed to support a sugar-conscious wellness routine and promote post-meal comfort, through a simple nightly 2-3 drop ritual.",
    ingredients: "Ajwain, hing (asafoetida), ginger, tulsi, malkangani",
    usage: [
      "Apply 2-3 drops to the belly button before bedtime",
      "Massage gently in a clockwise circular motion",
      "Leave overnight and clean the navel area in the morning",
      "Use consistently as a daily ritual",
    ],
    benefits: [
      "Supports sugar-conscious wellness routines",
      "Promotes post-meal comfort",
      "Encourages lighter mornings",
      "Traditionally valued for digestive wellness",
    ],
    note: "This is a wellness product for routine support, not a medical treatment — please continue following your doctor's advice.",
    images: ["/products/placeholder.svg"],
    weightInGrams: 60,
    inStock: true,
  },
  {
    slug: "sugar-balance-comfort-socks",
    name: "Sugar Balance Comfort Socks",
    price: 549,
    mrp: 649,
    shortDescription: "Extra-wide cotton-blend crew socks with a soft, non-binding cuff.",
    description:
      "Dark-grey crew socks with a broad rib-knit cuff that gives gentle support without the tight elastic mark of regular socks. Cotton-spandex blend for breathability and everyday comfort.",
    benefits: [
      "Extra-wide cuff — no binding marks on ankles",
      "Breathable cotton-spandex knit",
      "Available in two sizes: S (35-39) or M (40-44)",
      "One pair per order",
    ],
    images: ["/products/placeholder.svg"],
    weightInGrams: 80,
    inStock: true,
  },
  {
    slug: "sugar-balance-vijaysar-wood-glass",
    name: "Sugar Balance Vijaysar Wood Glass",
    price: 599,
    mrp: 1399,
    shortDescription: "Traditional Vijaysar wood tumbler for a simple sugar-conscious morning routine.",
    description:
      "Natural Vijaysar wood, used in traditional Indian routines for generations. Infuse water overnight and drink it as part of your morning and evening ritual.",
    usage: [
      "Pour drinking water into the glass and let it infuse overnight",
      "Drink on an empty stomach each morning, and again ~30 minutes before dinner",
      "Use daily for at least 3 months; replace the tumbler after extended use",
    ],
    benefits: [
      "Simple natural water infusion, no preparation beyond filling the glass",
      "Fits into an everyday Indian routine",
      "Encourages a consistent daily habit",
    ],
    note: "This is a wellness product for routine support, not a medical treatment.",
    images: ["/products/placeholder.svg"],
    weightInGrams: 250,
    inStock: true,
  },
  {
    slug: "weight-management-body-detox-nabhi-oil",
    name: "Weight Management & Body Detox Nabhi Oil",
    price: 589,
    mrp: 1399,
    shortDescription: "A 30ml herbal nabhi oil for a simple nightly external-use wellness ritual.",
    description:
      "A 30ml amber-glass dropper bottle blending Ajwain, Hing, Ginger, Tulsi and Malkangani — a one-minute bedtime self-care ritual, meant to complement mindful eating, movement, hydration and sleep.",
    ingredients: "Ajwain, hing (asafoetida), ginger, tulsi, malkangani",
    usage: [
      "Clean and dry the navel area",
      "Apply 2-3 drops using the measured dropper",
      "Massage gently in a clockwise motion for one minute",
      "Leave overnight; clean in the morning",
    ],
    benefits: [
      "Simple one-minute evening ritual",
      "Measured-drop dropper bottle",
      "Complements healthy lifestyle habits",
    ],
    note: "Does not guarantee weight loss or replace food, movement, or professional health advice.",
    images: ["/products/placeholder.svg"],
    weightInGrams: 60,
    inStock: true,
  },
  {
    slug: "fatty-liver-nabhi-oil",
    name: "Fatty Liver Nabhi Oil",
    price: 549,
    mrp: 999,
    shortDescription: "Liver-conscious belly button oil for a simple nightly wellness ritual.",
    description:
      "An ayurvedic external-use oil for a straightforward nightly habit centred on liver wellness, using the traditional nabhi application method — a central point traditionally connected with digestion and vitality.",
    usage: [
      "Apply 4-6 drops into the belly button before bed",
      "Massage gently in clockwise circular motions around the navel",
      "Leave overnight; clean in the morning",
    ],
    benefits: [
      "Supports a liver-conscious wellness routine",
      "Under a minute a day",
      "Simple, consistent nightly ritual",
    ],
    note: "This is not a medicine and does not replace medical advice or treatment for fatty liver disease.",
    images: ["/products/placeholder.svg"],
    weightInGrams: 60,
    inStock: true,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
