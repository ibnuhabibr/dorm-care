"use client";

import Link from "next/link";
import { Bell, Lock, ShieldCheck } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function PengaturanProfilPage() {
  const [notifOrder, setNotifOrder] = useState(true);
  const [notifPromo, setNotifPromo] = useState(true);
  const [notifWhatsapp, setNotifWhatsapp] = useState(true);

  return (
    <div className="space-y-6 pb-20 pt-10">
      <section className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8">
        <p className="section-label">Profil Dorm Care</p>
        <h1 className="h2-title mt-2 text-neutral-900">Pengaturan akun</h1>
        <p className="mt-2 text-neutral-600">Atur preferensi notifikasi dan keamanan akun kalian.</p>
      </section>

      <section className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6">
        <h2 className="h3-title text-neutral-900">Notifikasi</h2>

        <label className="flex items-center justify-between gap-3 rounded-xl border border-neutral-200 p-3">
          <div className="flex items-center gap-2">
            <Bell className="size-4 text-brand-primary-dark" />
            <span className="text-sm font-semibold text-neutral-800">Update status order</span>
          </div>
          <input type="checkbox" checked={notifOrder} onChange={(event) => setNotifOrder(event.target.checked)} />
        </label>

        <label className="flex items-center justify-between gap-3 rounded-xl border border-neutral-200 p-3">
          <div className="flex items-center gap-2">
            <Bell className="size-4 text-brand-primary-dark" />
            <span className="text-sm font-semibold text-neutral-800">Promo dan campaign</span>
          </div>
          <input type="checkbox" checked={notifPromo} onChange={(event) => setNotifPromo(event.target.checked)} />
        </label>

        <label className="flex items-center justify-between gap-3 rounded-xl border border-neutral-200 p-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-brand-primary-dark" />
            <span className="text-sm font-semibold text-neutral-800">Notifikasi WhatsApp</span>
          </div>
          <input
            type="checkbox"
            checked={notifWhatsapp}
            onChange={(event) => setNotifWhatsapp(event.target.checked)}
          />
        </label>
      </section>

      <section className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6">
        <h2 className="h3-title text-neutral-900">Keamanan</h2>
        <article className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-900">
            <Lock className="size-4 text-amber-700" />
            Ubah password
          </p>
          <p className="mt-2 text-sm text-neutral-600">
            Fitur ubah password terintegrasi akan aktif setelah gateway auth produksi disambungkan.
          </p>
        </article>
      </section>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => toast.success("Pengaturan berhasil disimpan.")}
          className="rounded-xl bg-brand-primary px-4 py-2 text-sm font-bold text-white hover:bg-brand-primary-dark"
        >
          Simpan pengaturan
        </button>
        <Link
          href="/profil"
          className="rounded-xl border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700"
        >
          Kembali ke profil
        </Link>
      </div>
    </div>
  );
}
