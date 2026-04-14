"use client";

import Link from "next/link";
import { Bell, BellRing, CheckCheck, Clock3, Gift, Trash2, UserCircle2 } from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

import { notificationCatalog, type NotificationItem } from "@/data/site-data";
import { formatTanggalIndonesia } from "@/lib/utils";

type FilterKey = "semua" | "belum";
type CategoryKey = "semua" | "order" | "promo" | "akun";

const tabItems: Array<{ key: FilterKey; label: string }> = [
  { key: "semua", label: "Semua" },
  { key: "belum", label: "Belum dibaca" },
];

const categoryItems: Array<{ key: CategoryKey; label: string }> = [
  { key: "semua", label: "Semua Kategori" },
  { key: "order", label: "Pesanan" },
  { key: "promo", label: "Promo" },
  { key: "akun", label: "Akun" },
];

const categoryIcon: Record<NotificationItem["kategori"], typeof Gift> = {
  order: BellRing,
  promo: Gift,
  akun: UserCircle2,
};

export default function NotifikasiPage() {
  const [tab, setTab] = useState<FilterKey>("semua");
  const [category, setCategory] = useState<CategoryKey>("semua");
  const [notifications, setNotifications] = useState(notificationCatalog);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.sudahDibaca).length,
    [notifications],
  );

  const filtered = useMemo(() => {
    let items = [...notifications].sort(
      (a, b) => new Date(b.waktu).getTime() - new Date(a.waktu).getTime(),
    );

    if (tab === "belum") {
      items = items.filter((item) => !item.sudahDibaca);
    }

    if (category !== "semua") {
      items = items.filter((item) => item.kategori === category);
    }

    return items;
  }, [notifications, tab, category]);

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast.success("Notifikasi dihapus.");
  };

  return (
    <div className="space-y-6 pb-20 pt-10">
      <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="section-label">Notifikasi Dorm Care</p>
            <h1 className="h2-title mt-2 text-neutral-900">Pusat notifikasi akun</h1>
            <p className="mt-2 text-neutral-600">
              Lihat update order, promo aktif, dan info akun terbaru di satu tempat.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-primary/20 bg-brand-primary-light px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-brand-primary-dark">
            <Bell className="size-3.5" />
            {unreadCount} belum dibaca
          </span>
        </div>
      </section>

      {/* Toolbar */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {tabItems.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setTab(item.key)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  tab === item.key
                    ? "bg-brand-primary text-white"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {/* Category Filter */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as CategoryKey)}
              className="h-10 rounded-xl border border-neutral-200 bg-white px-3 text-sm font-semibold text-neutral-700 outline-none focus:border-brand-primary"
            >
              {categoryItems.map((item) => (
                <option key={item.key} value={item.key}>{item.label}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() =>
                setNotifications((prev) =>
                  prev.map((item) => ({ ...item, sudahDibaca: true })),
                )
              }
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-neutral-200 px-3 text-sm font-semibold text-neutral-700 hover:border-brand-primary/30 hover:text-brand-primary-dark transition"
            >
              <CheckCheck className="size-4" />
              Tandai semua
            </button>
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section className="space-y-3">
        {filtered.length === 0 ? (
          <article className="rounded-3xl border border-neutral-200 bg-white p-8 text-center">
            <Bell className="mx-auto mb-3 size-10 text-neutral-300" />
            <p className="font-semibold text-neutral-900">Belum ada notifikasi.</p>
            <p className="mt-1 text-sm text-neutral-600">
              Coba cek lagi setelah melakukan transaksi atau klaim promo.
            </p>
          </article>
        ) : null}

        {filtered.map((item) => {
          const Icon = categoryIcon[item.kategori];
          return (
            <article
              key={item.id}
              className={`group rounded-2xl border bg-white p-4 shadow-sm transition ${
                item.sudahDibaca
                  ? "border-neutral-200"
                  : "border-brand-primary/20 bg-brand-primary-light/40"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="grid size-10 shrink-0 place-content-center rounded-xl bg-brand-primary-light text-brand-primary-dark">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-neutral-900">{item.judul}</h2>
                      <span className="rounded bg-neutral-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-neutral-500">
                        {item.kategori}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-neutral-600">{item.pesan}</p>
                    <p className="mt-2 inline-flex items-center gap-1 text-xs text-neutral-500">
                      <Clock3 className="size-3.5" />
                      {formatTanggalIndonesia(item.waktu)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!item.sudahDibaca && (
                    <button
                      type="button"
                      onClick={() =>
                        setNotifications((prev) =>
                          prev.map((n) =>
                            n.id === item.id ? { ...n, sudahDibaca: true } : n,
                          ),
                        )
                      }
                      className="rounded-lg border border-brand-primary/20 bg-white px-3 py-2 text-xs font-semibold text-brand-primary-dark transition hover:bg-brand-primary-light"
                    >
                      Tandai dibaca
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="rounded-lg p-2 text-neutral-400 opacity-0 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                    title="Hapus notifikasi"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {/* Quick Actions */}
      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <p className="font-semibold">Butuh aksi cepat?</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Link href="/riwayat" className="rounded-lg bg-white px-3 py-2 font-semibold text-neutral-700 transition hover:bg-white/80">
            Buka riwayat
          </Link>
          <Link href="/promo" className="rounded-lg bg-white px-3 py-2 font-semibold text-neutral-700 transition hover:bg-white/80">
            Lihat promo
          </Link>
          <Link href="/profil" className="rounded-lg bg-white px-3 py-2 font-semibold text-neutral-700 transition hover:bg-white/80">
            Kelola profil
          </Link>
        </div>
      </section>
    </div>
  );
}
