import { siteConfig } from "@/lib/site-config";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-black/10 bg-[var(--background)]">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-[var(--foreground)]/70 sm:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-medium text-[var(--brand-dark)]">{siteConfig.brandName}</p>
          <p>{siteConfig.address}</p>
        </div>
        <div className="mt-4 flex flex-col gap-1 sm:flex-row sm:gap-6">
          <span>{siteConfig.supportEmail}</span>
          <span>{siteConfig.supportPhone}</span>
        </div>
        <p className="mt-6 text-xs text-[var(--foreground)]/50">
          &copy; {new Date().getFullYear()} {siteConfig.businessName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
