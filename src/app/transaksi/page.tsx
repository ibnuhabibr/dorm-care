"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  MapPin,
  Package,
  Receipt,
  Search,
  Truck,
} from "lucide-react";

import { orderCatalog } from "@/data/site-data";
import { formatRupiah, formatTanggal, getStatusInfo } from "@/lib/utils";

const statusFilters = ["Semua", "Pending", "Diterima", "Mitra Menuju", "Dalam Pengerjaan", "Selesai", "Dibatalkan"] as const;

export default function TransaksiPage() {
  const [activeFilter, setActiveFilter] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  // Split orders into active and past
  const activeOrders = useMemo(
    () =>
      orderCatalog.filter((order) => {
        const statusInfo = getStatusInfo(order.status);
        const statusMatch = activeFilter === "Semua" || statusInfo.label === activeFilter;
        const searchMatch =
          !searchQuery ||
          order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.layananNama.toLowerCase().includes(searchQuery.toLowerCase());
        return (
          statusMatch &&
          searchMatch &&
          !["selesai", "dibatalkan"].includes(order.status)
        );
      }),
    [activeFilter, searchQuery],
  );

  const completedOrders = useMemo(
    () =>
      orderCatalog.filter((order) => {
        const searchMatch =
          !searchQuery ||
          order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.layananNama.toLowerCase().includes(searchQuery.toLowerCase());
        return searchMatch && ["selesai", "dibatalkan"].includes(order.status);
      }),
    [searchQuery],
  );

  return (
    <div className="pb-20 pt-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition hover:text-brand-primary mb-4"
        >
          <ArrowLeft className="size-4" /> Kembali ke Beranda
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-extrabold text-neutral-900 sm:text-4xl">
              Transaksi Anda
            </h1>
            <p className="mt-2 text-neutral-500">
              Lacak status pesanan aktif dan riwayat layanan kebersihan Anda.
            </p>
          </div>
          <div className="hidden sm:grid size-14 place-content-center rounded-2xl bg-brand-primary-light">
            <Receipt className="size-7 text-brand-primary" />
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nomor pesanan atau layanan..."
            className="h-11 w-full rounded-xl border border-neutral-200 bg-white pl-10 pr-4 text-sm outline-none ring-brand-primary/30 transition focus:border-brand-primary focus:ring-2"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {statusFilters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`shrink-0 rounded-lg px-4 py-2.5 text-xs font-bold transition ${
                activeFilter === filter
                  ? "bg-brand-primary text-white"
                  : "border border-neutral-200 bg-white text-neutral-600 hover:border-brand-primary/30"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Active Transactions */}
      <section className="mb-12">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-neutral-900">
          <div className="size-2 animate-pulse rounded-full bg-brand-accent" />
          Pesanan Berjalan ({activeOrders.length})
        </h2>

        {activeOrders.length > 0 ? (
          <div className="space-y-4">
            {activeOrders.map((order) => {
              const status = getStatusInfo(order.status);
              const progress =
                order.status === "pending" ? 10
                : order.status === "diterima" ? 30
                : order.status === "menuju" ? 55
                : order.status === "dikerjakan" ? 75
                : 100;

              // Extract time from tanggal
              const dateObj = new Date(order.tanggal);
              const timeStr = dateObj.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

              return (
                <div
                  key={order.id}
                  className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
                >
                  <div className="absolute left-0 top-0 h-full w-1 bg-brand-primary" />

                  <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                      <div className="mb-1 flex items-center gap-3">
                        <span className="font-mono text-xs text-neutral-500">
                          {order.orderId}
                        </span>
                        <span
                          className="inline-flex rounded-full px-2.5 py-1 text-xs font-bold"
                          style={{
                            backgroundColor: `${status.color}20`,
                            color: status.color,
                          }}
                        >
                          {status.label}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-neutral-900">{order.layananNama}</h3>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-xs text-neutral-500">Total Pembayaran</p>
                      <p className="text-xl font-extrabold text-brand-primary">
                        {formatRupiah(order.total)}
                      </p>
                    </div>
                  </div>

                  <div className="mb-8 grid grid-cols-1 gap-4 rounded-xl border border-neutral-100 bg-neutral-50 p-4 md:grid-cols-3">
                    <div className="flex items-start gap-3">
                      <Clock className="mt-0.5 size-4 shrink-0 text-neutral-400" />
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Jadwal</p>
                        <p className="text-sm font-medium text-neutral-900">
                          {formatTanggal(order.tanggal)} • {timeStr} WIB
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 size-4 shrink-0 text-neutral-400" />
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Lokasi</p>
                        <p className="text-sm font-medium text-neutral-900">{order.alamat}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Package className="mt-0.5 size-4 shrink-0 text-neutral-400" />
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Mitra</p>
                        <p className="text-sm font-medium text-neutral-900">{order.mitra}</p>
                      </div>
                    </div>
                  </div>

                  {/* Progress */}
                  <div>
                    <div className="mb-2 flex items-center justify-between text-xs font-bold text-neutral-500">
                      <span className={`flex items-center gap-1 ${progress >= 10 ? "text-brand-primary" : "text-neutral-400"}`}>
                        <CheckCircle2 className="size-3" /> Dikonfirmasi
                      </span>
                      <span className={`flex items-center gap-1 ${progress >= 55 ? "text-brand-primary" : "text-neutral-400"}`}>
                        <Truck className="size-3" /> Menuju Lokasi
                      </span>
                      <span className={`flex items-center gap-1 ${progress >= 75 ? "text-brand-primary" : "text-neutral-400"}`}>
                        <Package className="size-3" /> Pengerjaan
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                      <div
                        className="h-full rounded-full bg-brand-primary transition-all duration-1000"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-10 text-center">
            <Receipt className="mx-auto mb-4 size-10 text-neutral-400" />
            <h3 className="text-lg font-bold text-neutral-900">Belum Ada Pesanan Aktif</h3>
            <p className="mb-6 mt-1 text-sm text-neutral-500">
              {activeFilter !== "Semua"
                ? `Tidak ada pesanan dengan status "${activeFilter}".`
                : "Anda belum memiliki pesanan yang sedang berjalan."}
            </p>
            <Link
              href="/layanan"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-brand-primary px-6 text-sm font-bold text-white transition hover:bg-brand-primary-dark btn-press"
            >
              Pesan Layanan
            </Link>
          </div>
        )}
      </section>

      {/* Completed Transactions */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-bold text-neutral-900">
            <CheckCircle2 className="size-5 text-neutral-400" />
            Riwayat Selesai ({completedOrders.length})
          </h2>
        </div>

        <div className="space-y-4">
          {completedOrders.length > 0 ? (
            completedOrders.map((order) => {
              const status = getStatusInfo(order.status);
              return (
                <div
                  key={order.id}
                  className="group flex flex-col justify-between gap-4 rounded-xl border border-neutral-200 bg-white p-5 transition hover:shadow-md sm:flex-row sm:items-center"
                >
                  <div className="flex items-start gap-4">
                    <div className="grid size-10 shrink-0 place-content-center rounded-full bg-neutral-100">
                      <Receipt className="size-5 text-neutral-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-neutral-900">{order.layananNama}</h3>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                        <span className="font-mono">{order.orderId}</span>
                        <span>•</span>
                        <span>{formatTanggal(order.tanggal)}</span>
                        <span
                          className="inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold"
                          style={{
                            backgroundColor: `${status.color}15`,
                            color: status.color,
                          }}
                        >
                          {status.label}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-6 border-t border-neutral-100 p-3 sm:justify-end sm:border-t-0 sm:p-0 mt-2 sm:mt-0">
                    <div className="text-left sm:text-right">
                      <p className="mb-0.5 text-xs font-semibold text-neutral-500">Total</p>
                      <p className="font-bold text-neutral-900">{formatRupiah(order.total)}</p>
                    </div>
                    <Link
                      href={`/transaksi/${order.id}`}
                      className="grid size-8 place-content-center rounded-full bg-neutral-50 text-neutral-400 transition group-hover:bg-brand-primary group-hover:text-white"
                    >
                      <ArrowRight className="size-4" />
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="py-8 text-center text-sm text-neutral-500">
              Belum ada riwayat transaksi.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}