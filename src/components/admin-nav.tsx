"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const adminLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/pesanan", label: "Pesanan" },
  { href: "/admin/layanan", label: "Layanan" },
  { href: "/admin/pengguna", label: "Pengguna" },
  { href: "/admin/promo", label: "Promo" },
  { href: "/admin/konten", label: "Konten" },
  { href: "/admin/laporan", label: "Laporan" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="mb-6 flex flex-wrap gap-2 rounded-2xl border border-neutral-200 bg-white p-3">
      {adminLinks.map((item) => {
        const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);

        return (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "rounded-xl border px-3 py-2 text-sm font-semibold transition",
            active
              ? "border-brand-primary/30 bg-brand-primary-light text-brand-primary-dark"
              : "border-neutral-200 text-neutral-700 hover:border-brand-primary/30 hover:text-brand-primary-dark",
          )}
        >
          {item.label}
        </Link>
        );
      })}
    </nav>
  );
}
