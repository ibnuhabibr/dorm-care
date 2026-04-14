"use client";

import Link from "next/link";
import { Bath, Fan, ShoppingBag, Sparkles, SprayCan, Truck } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import type { ServiceItem } from "@/data/site-data";

const iconMap = {
  sparkles: Sparkles,
  "spray-can": SprayCan,
  bath: Bath,
  shirt: ShoppingBag,
  fan: Fan,
  truck: Truck,
} as const;

const badgeColors: Record<string, string> = {
  TERLARIS: "bg-brand-primary text-white",
  HEMAT: "bg-brand-accent-light text-brand-accent",
  PREMIUM: "bg-neutral-900 text-white",
  BUNDLING: "bg-brand-primary-light text-brand-primary-dark",
};

const categoryLabels: Record<string, string> = {
  utama: "Layanan Utama",
  paket: "Paket Bersama",
  lainnya: "Layanan Lainnya",
};

type ServiceCardProps = {
  item: ServiceItem;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: () => void;
};

export function ServiceCard({ item, selectable, selected, onSelect }: ServiceCardProps) {
  const Icon = iconMap[item.icon] || Sparkles;
  const hasDiscount = item.hargaMax && item.hargaMax > item.hargaMin;
  const discountPercent = hasDiscount
    ? Math.round(((item.hargaMax! - item.hargaMin) / item.hargaMax!) * 100)
    : 0;

  const card = (
    <article
      className={`group relative flex flex-col rounded-2xl border bg-white p-5 shadow-sm card-hover overflow-hidden ${
        selected
          ? "border-brand-primary ring-2 ring-brand-primary/20"
          : "border-neutral-200 hover:border-brand-primary/30"
      }`}
      onClick={selectable ? onSelect : undefined}
      role={selectable ? "button" : undefined}
      tabIndex={selectable ? 0 : undefined}
    >
      {/* Selection check */}
      {selectable && selected && (
        <div className="absolute top-3 right-3 grid size-6 place-content-center rounded-full bg-brand-primary text-white z-10">
          <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}

      {/* Top: icon + badge */}
      <div className="flex items-start justify-between mb-4">
        <div className="grid size-11 place-content-center rounded-xl bg-brand-primary-light/30 text-brand-primary transition group-hover:bg-brand-primary group-hover:text-white">
          <Icon className="size-5" />
        </div>
        <div className="flex items-center gap-2">
          {item.badge && (
            <span className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${badgeColors[item.badge]}`}>
              {item.badge}
            </span>
          )}
        </div>
      </div>

      {/* Category label */}
      <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1">
        {categoryLabels[item.kategori] ?? item.kategori}
      </p>

      {/* Name + description */}
      <h3 className="font-display text-lg font-bold text-neutral-900 mb-1">{item.nama}</h3>
      <p className="text-sm text-neutral-500 mb-4 line-clamp-2">{item.deskripsi}</p>

      {/* Features */}
      <ul className="mb-5 flex-1 space-y-2">
        {item.fitur.map((fitur) => (
          <li key={fitur} className="flex items-start gap-2 text-sm text-neutral-600">
            <svg className="size-4 shrink-0 text-brand-primary mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>{fitur}</span>
          </li>
        ))}
      </ul>

      {/* Price */}
      <div className="mt-auto pt-4 border-t border-neutral-100">
        <div className="flex items-end justify-between mb-3">
          <div>
            {hasDiscount && (
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm line-through text-neutral-400">{formatRupiah(item.hargaMax!)}</span>
                <span className="rounded-full bg-error/10 px-2 py-0.5 text-[10px] font-bold text-error">
                  HEMAT {discountPercent}%
                </span>
              </div>
            )}
            <p className="font-display text-2xl font-extrabold text-neutral-900">
              {formatRupiah(item.hargaMin)}
              {item.hargaMax && !hasDiscount && (
                <span className="text-base font-bold text-neutral-400"> - {formatRupiah(item.hargaMax)}</span>
              )}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        {!selectable && (
          <div className="flex gap-2">
            <Link
              href={`/booking?layanan=${item.id}`}
              className="flex-1 rounded-xl bg-brand-primary py-2.5 text-center text-sm font-bold text-white transition hover:bg-brand-primary-dark btn-press"
            >
              Pesan Sekarang
            </Link>
            <Link
              href={`/layanan/${item.id}`}
              className="rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-bold text-neutral-700 transition hover:bg-neutral-50 btn-press"
            >
              Detail
            </Link>
          </div>
        )}
      </div>
    </article>
  );

  return card;
}
