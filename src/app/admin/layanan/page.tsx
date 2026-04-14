"use client";

import { FormEvent, useMemo, useState } from "react";
import { Plus, Search, ToggleLeft, ToggleRight } from "lucide-react";
import toast from "react-hot-toast";

import { AdminNav } from "@/components/admin-nav";
import {
  serviceCatalog,
  type ServiceCategory,
  type ServiceItem,
} from "@/data/site-data";
import { formatRupiah } from "@/lib/utils";

type ManagedService = ServiceItem & {
  aktif: boolean;
};

type FormState = {
  nama: string;
  kategori: ServiceCategory;
  harga: number;
  deskripsi: string;
};

const initialForm: FormState = {
  nama: "",
  kategori: "utama",
  harga: 25000,
  deskripsi: "",
};

export default function AdminLayananPage() {
  const [services, setServices] = useState<ManagedService[]>(
    serviceCatalog.map((item) => ({ ...item, aktif: true })),
  );
  const [search, setSearch] = useState("");
  const [kategori, setKategori] = useState<"semua" | ServiceCategory>("semua");
  const [form, setForm] = useState<FormState>(initialForm);

  const filtered = useMemo(() => {
    return services.filter((item) => {
      const keyword = search.toLowerCase();
      const matchKeyword =
        item.nama.toLowerCase().includes(keyword) ||
        item.deskripsi.toLowerCase().includes(keyword);
      const matchKategori = kategori === "semua" ? true : item.kategori === kategori;

      return matchKeyword && matchKategori;
    });
  }, [kategori, search, services]);

  const summary = useMemo(
    () => ({
      total: services.length,
      aktif: services.filter((item) => item.aktif).length,
      utama: services.filter((item) => item.kategori === "utama").length,
      paket: services.filter((item) => item.kategori === "paket").length,
      lainnya: services.filter((item) => item.kategori === "lainnya").length,
    }),
    [services],
  );

  const toggleService = (id: string) => {
    setServices((prev) =>
      prev.map((item) => {
        if (item.id !== id) {
          return item;
        }

        const next = { ...item, aktif: !item.aktif };
        toast.success(next.aktif ? `${item.nama} diaktifkan.` : `${item.nama} dinonaktifkan.`);
        return next;
      }),
    );
  };

  const addService = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.nama || !form.deskripsi || form.harga <= 0) {
      toast.error("Lengkapi nama, deskripsi, dan harga layanan.");
      return;
    }

    const newService: ManagedService = {
      id: `svc-custom-${Date.now()}`,
      nama: form.nama,
      deskripsi: form.deskripsi,
      fitur: ["Disesuaikan oleh admin", "SOP standar Dorm Care", "Notifikasi otomatis"],
      kategori: form.kategori,
      hargaMin: form.harga,
      icon: "sparkles",
      aktif: true,
    };

    setServices((prev) => [newService, ...prev]);
    setForm(initialForm);
    toast.success("Layanan baru berhasil ditambahkan.");
  };

  return (
    <div className="space-y-6 pb-20 pt-10">
      <section className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8">
        <p className="section-label">Admin Dorm Care</p>
        <h1 className="h2-title mt-2 text-neutral-900">Manajemen Layanan</h1>
        <p className="mt-2 text-neutral-600">Tambah layanan baru, atur status aktif, dan cek distribusi kategori layanan.</p>
      </section>

      <AdminNav />

      <section className="grid gap-4 md:grid-cols-5">
        <article className="rounded-2xl border border-neutral-200 bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-neutral-500">Total layanan</p>
          <p className="mt-2 text-3xl font-black text-neutral-900">{summary.total}</p>
        </article>
        <article className="rounded-2xl border border-neutral-200 bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-neutral-500">Aktif</p>
          <p className="mt-2 text-3xl font-black text-neutral-900">{summary.aktif}</p>
        </article>
        <article className="rounded-2xl border border-neutral-200 bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-neutral-500">Kategori utama</p>
          <p className="mt-2 text-3xl font-black text-neutral-900">{summary.utama}</p>
        </article>
        <article className="rounded-2xl border border-neutral-200 bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-neutral-500">Kategori paket</p>
          <p className="mt-2 text-3xl font-black text-neutral-900">{summary.paket}</p>
        </article>
        <article className="rounded-2xl border border-neutral-200 bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-neutral-500">Kategori lainnya</p>
          <p className="mt-2 text-3xl font-black text-neutral-900">{summary.lainnya}</p>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-12">
        <article className="rounded-3xl border border-neutral-200 bg-white p-6 lg:col-span-4">
          <h2 className="font-heading text-2xl font-black text-neutral-900">Tambah layanan</h2>
          <form onSubmit={addService} className="mt-4 space-y-3">
            <label className="block space-y-1 text-sm font-semibold text-neutral-700">
              Nama layanan
              <input
                value={form.nama}
                onChange={(event) => setForm((prev) => ({ ...prev, nama: event.target.value }))}
                className="h-10 w-full rounded-xl border border-neutral-200 px-3 outline-none ring-brand-primary/30 focus:ring"
              />
            </label>

            <label className="block space-y-1 text-sm font-semibold text-neutral-700">
              Kategori
              <select
                value={form.kategori}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    kategori: event.target.value as ServiceCategory,
                  }))
                }
                className="h-10 w-full rounded-xl border border-neutral-200 px-3 outline-none ring-brand-primary/30 focus:ring"
              >
                <option value="utama">Utama</option>
                <option value="paket">Paket</option>
                <option value="lainnya">Lainnya</option>
              </select>
            </label>

            <label className="block space-y-1 text-sm font-semibold text-neutral-700">
              Harga mulai
              <input
                type="number"
                min={1}
                value={form.harga}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, harga: Number(event.target.value) }))
                }
                className="h-10 w-full rounded-xl border border-neutral-200 px-3 outline-none ring-brand-primary/30 focus:ring"
              />
            </label>

            <label className="block space-y-1 text-sm font-semibold text-neutral-700">
              Deskripsi ringkas
              <textarea
                rows={3}
                value={form.deskripsi}
                onChange={(event) => setForm((prev) => ({ ...prev, deskripsi: event.target.value }))}
                className="w-full rounded-xl border border-neutral-200 px-3 py-2 outline-none ring-brand-primary/30 focus:ring"
              />
            </label>

            <button
              type="submit"
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-brand-primary text-sm font-bold text-white hover:bg-brand-primary-dark"
            >
              <Plus className="size-4" />
              Simpan layanan
            </button>
          </form>
        </article>

        <article className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6 lg:col-span-8">
          <div className="grid gap-3 md:grid-cols-3">
            <label className="relative md:col-span-2">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cari layanan"
                className="h-10 w-full rounded-xl border border-neutral-200 pl-9 pr-3 text-sm outline-none ring-brand-primary/30 focus:ring"
              />
            </label>

            <select
              value={kategori}
              onChange={(event) =>
                setKategori(event.target.value as "semua" | ServiceCategory)
              }
              className="h-10 rounded-xl border border-neutral-200 px-3 text-sm outline-none ring-brand-primary/30 focus:ring"
            >
              <option value="semua">Semua kategori</option>
              <option value="utama">Utama</option>
              <option value="paket">Paket</option>
              <option value="lainnya">Lainnya</option>
            </select>
          </div>

          <div className="space-y-3">
            {filtered.map((item) => (
              <article key={item.id} className="rounded-2xl border border-neutral-200 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.1em] text-neutral-500">{item.kategori}</p>
                    <h3 className="mt-1 text-lg font-black text-neutral-900">{item.nama}</h3>
                    <p className="mt-1 text-sm text-neutral-600">{item.deskripsi}</p>
                    <p className="mt-2 text-sm font-semibold text-brand-primary-dark">{formatRupiah(item.hargaMin)}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleService(item.id)}
                    className={`inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-xs font-semibold ${
                      item.aktif
                        ? "border-green-200 bg-green-50 text-green-700"
                        : "border-neutral-200 bg-neutral-100 text-neutral-700"
                    }`}
                  >
                    {item.aktif ? <ToggleRight className="size-4" /> : <ToggleLeft className="size-4" />}
                    {item.aktif ? "Aktif" : "Nonaktif"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
