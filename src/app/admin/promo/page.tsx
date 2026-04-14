"use client";

import { FormEvent, useMemo, useState } from "react";
import { Copy, Plus, Tag } from "lucide-react";
import toast from "react-hot-toast";

import { AdminNav } from "@/components/admin-nav";
import { promoCatalog, type PromoItem } from "@/data/site-data";
import { formatRupiah } from "@/lib/utils";

type PromoForm = {
  nama: string;
  kode: string;
  tipe: PromoItem["tipe"];
  nilai: number;
  minTransaksi: number;
  kategori: PromoItem["kategori"];
};

const initialForm: PromoForm = {
  nama: "",
  kode: "",
  tipe: "persen",
  nilai: 10,
  minTransaksi: 50000,
  kategori: "diskon",
};

function promoValueLabel(tipe: PromoItem["tipe"], nilai: number) {
  return tipe === "persen" ? `${nilai}%` : formatRupiah(nilai);
}

export default function AdminPromoPage() {
  const [promos, setPromos] = useState(promoCatalog);
  const [form, setForm] = useState<PromoForm>(initialForm);

  const activeCount = useMemo(() => promos.filter((item) => item.aktif).length, [promos]);

  const toggleActive = (id: string) => {
    setPromos((prev) =>
      prev.map((item) => {
        if (item.id !== id) {
          return item;
        }
        toast.success(item.aktif ? `Promo ${item.kode} dinonaktifkan.` : `Promo ${item.kode} diaktifkan.`);
        return { ...item, aktif: !item.aktif };
      }),
    );
  };

  const addPromo = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.nama || !form.kode || form.nilai <= 0) {
      toast.error("Lengkapi data promo terlebih dahulu.");
      return;
    }

    const newPromo: PromoItem = {
      id: `promo-${Date.now()}`,
      nama: form.nama,
      kode: form.kode.toUpperCase(),
      deskripsi: `Promo ${form.nama} khusus pengguna Dorm Care.`,
      tipe: form.tipe,
      nilai: form.nilai,
      minTransaksi: form.minTransaksi,
      berlakuSampai: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
      kategori: form.kategori,
      aktif: true,
    };

    setPromos((prev) => [newPromo, ...prev]);
    setForm(initialForm);
    toast.success("Promo baru berhasil ditambahkan.");
  };

  return (
    <div className="space-y-6 pb-20 pt-10">
      <section className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8">
        <p className="section-label">Admin Dorm Care</p>
        <h1 className="h2-title mt-2 text-neutral-900">Manajemen Promo</h1>
        <p className="mt-2 text-neutral-600">Aktifkan, nonaktifkan, dan buat promo baru untuk campaign mingguan.</p>
      </section>

      <AdminNav />

      <section className="grid gap-6 lg:grid-cols-12">
        <article className="rounded-3xl border border-neutral-200 bg-white p-6 lg:col-span-4">
          <h2 className="font-heading text-2xl font-black text-neutral-900">Tambah promo</h2>
          <p className="mt-1 text-sm text-neutral-600">Promo aktif saat ini: {activeCount}</p>

          <form onSubmit={addPromo} className="mt-4 space-y-3">
            <label className="block space-y-1 text-sm font-semibold text-neutral-700">
              Nama promo
              <input
                value={form.nama}
                onChange={(event) => setForm((prev) => ({ ...prev, nama: event.target.value }))}
                className="h-10 w-full rounded-xl border border-neutral-200 px-3"
              />
            </label>
            <label className="block space-y-1 text-sm font-semibold text-neutral-700">
              Kode promo
              <input
                value={form.kode}
                onChange={(event) => setForm((prev) => ({ ...prev, kode: event.target.value.toUpperCase() }))}
                className="h-10 w-full rounded-xl border border-neutral-200 px-3 uppercase"
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block space-y-1 text-sm font-semibold text-neutral-700">
                Tipe
                <select
                  value={form.tipe}
                  onChange={(event) => setForm((prev) => ({ ...prev, tipe: event.target.value as PromoItem["tipe"] }))}
                  className="h-10 w-full rounded-xl border border-neutral-200 px-3"
                >
                  <option value="persen">Persen</option>
                  <option value="nominal">Nominal</option>
                </select>
              </label>
              <label className="block space-y-1 text-sm font-semibold text-neutral-700">
                Nilai
                <input
                  type="number"
                  min={1}
                  value={form.nilai}
                  onChange={(event) => setForm((prev) => ({ ...prev, nilai: Number(event.target.value) }))}
                  className="h-10 w-full rounded-xl border border-neutral-200 px-3"
                />
              </label>
            </div>

            <label className="block space-y-1 text-sm font-semibold text-neutral-700">
              Minimal transaksi
              <input
                type="number"
                min={0}
                value={form.minTransaksi}
                onChange={(event) => setForm((prev) => ({ ...prev, minTransaksi: Number(event.target.value) }))}
                className="h-10 w-full rounded-xl border border-neutral-200 px-3"
              />
            </label>

            <label className="block space-y-1 text-sm font-semibold text-neutral-700">
              Kategori
              <select
                value={form.kategori}
                onChange={(event) => setForm((prev) => ({ ...prev, kategori: event.target.value as PromoItem["kategori"] }))}
                className="h-10 w-full rounded-xl border border-neutral-200 px-3"
              >
                <option value="diskon">Diskon</option>
                <option value="member">Member</option>
                <option value="bundle">Bundle</option>
              </select>
            </label>

            <button
              type="submit"
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-brand-primary text-sm font-bold text-white hover:bg-brand-primary-dark"
            >
              <Plus className="size-4" />
              Simpan promo
            </button>
          </form>
        </article>

        <article className="space-y-3 rounded-3xl border border-neutral-200 bg-white p-6 lg:col-span-8">
          <h2 className="font-heading text-2xl font-black text-neutral-900">Daftar promo</h2>
          {promos.map((promo) => (
            <div key={promo.id} className="rounded-2xl border border-neutral-200 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">
                    <Tag className="size-3.5" />
                    {promo.kategori}
                  </p>
                  <p className="mt-1 text-lg font-black text-neutral-900">{promo.nama}</p>
                  <p className="text-sm text-neutral-600">{promo.deskripsi}</p>
                </div>
                <span
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold uppercase tracking-[0.1em] ${
                    promo.aktif ? "bg-green-100 text-green-700" : "bg-neutral-200 text-neutral-700"
                  }`}
                >
                  {promo.aktif ? "Aktif" : "Nonaktif"}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                <span className="rounded-lg bg-neutral-100 px-2.5 py-1 font-semibold text-neutral-700">{promo.kode}</span>
                <span className="rounded-lg bg-brand-primary-light px-2.5 py-1 font-semibold text-brand-primary-dark">
                  {promoValueLabel(promo.tipe, promo.nilai)}
                </span>
                <span className="rounded-lg bg-neutral-100 px-2.5 py-1 text-neutral-700">
                  Min {formatRupiah(promo.minTransaksi)}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => toggleActive(promo.id)}
                  className="h-9 rounded-lg border border-neutral-200 px-3 text-xs font-semibold text-neutral-700"
                >
                  {promo.aktif ? "Nonaktifkan" : "Aktifkan"}
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await navigator.clipboard.writeText(promo.kode);
                    toast.success(`Kode ${promo.kode} disalin.`);
                  }}
                  className="inline-flex h-9 items-center gap-2 rounded-lg border border-brand-primary/20 bg-brand-primary-light px-3 text-xs font-semibold text-brand-primary-dark"
                >
                  <Copy className="size-3.5" />
                  Salin kode
                </button>
              </div>
            </div>
          ))}
        </article>
      </section>
    </div>
  );
}
