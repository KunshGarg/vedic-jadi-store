import { siteConfig } from "@/lib/site-config";

export default function TrustBar() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-y border-black/10 bg-[var(--brand)]/5 px-4 py-3 text-xs font-medium text-[var(--brand-dark)] sm:text-sm">
      {siteConfig.trustBadges.map((badge) => (
        <span key={badge}>{badge}</span>
      ))}
    </div>
  );
}
