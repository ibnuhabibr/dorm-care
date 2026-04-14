"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Printer } from "lucide-react";

const sections = [
  {
    id: "ketentuan-umum",
    title: "Ketentuan Umum",
    items: [
      "Layanan Dorm Care saat ini difokuskan untuk area Surabaya dengan prioritas Sukolilo dan sekitarnya.",
      "Semua transaksi pada fase ini masih berupa prototype, namun alur dibuat menyerupai sistem produksi.",
      "Dengan menggunakan layanan ini, pengguna dianggap memahami sifat simulasi untuk pembayaran dan notifikasi.",
    ],
  },
  {
    id: "pemesanan-jadwal",
    title: "Pemesanan & Jadwal",
    items: [
      "Pengguna disarankan melakukan booking minimal 1 jam sebelum waktu layanan.",
      "Perubahan jadwal dapat dilakukan dari halaman riwayat selama status belum dikerjakan.",
      "Dorm Care berhak menyesuaikan jadwal apabila terjadi cuaca ekstrem atau kondisi operasional khusus.",
    ],
  },
  {
    id: "pembatalan-refund",
    title: "Pembatalan & Refund",
    items: [
      "Pembatalan oleh pengguna sebelum mitra berangkat tidak dikenai biaya.",
      "Pembatalan saat mitra sudah menuju lokasi dapat dikenai biaya operasional terbatas.",
      "Untuk fase prototype, proses refund bersifat simulasi dan ditampilkan sebagai notifikasi sistem.",
    ],
  },
  {
    id: "data-pengguna",
    title: "Data Pengguna",
    items: [
      "Email dan nomor WhatsApp dipakai untuk verifikasi akun, notifikasi, serta dukungan pelanggan.",
      "Dorm Care tidak membagikan data pribadi pengguna ke pihak ketiga di luar kebutuhan operasional.",
      "Pengguna bertanggung jawab menjaga keamanan akses akun masing-masing.",
    ],
  },
  {
    id: "kode-promo",
    title: "Penggunaan Kode Promo",
    items: [
      "Setiap kode promo hanya dapat digunakan satu kali per akun kecuali disebutkan sebaliknya.",
      "Promo tidak dapat digabungkan dengan promo lainnya dalam satu transaksi.",
      "Dorm Care berhak membatalkan promo jika mendapati indikasi penyalahgunaan.",
    ],
  },
  {
    id: "tanggung-jawab",
    title: "Tanggung Jawab & Garansi",
    items: [
      "Dorm Care memberikan garansi pengerjaan ulang gratis jika hasil tidak sesuai standar. Klaim harus dalam 24 jam.",
      "Kerusakan atau kehilangan barang yang disengaja oleh pengguna bukan tanggung jawab mitra.",
      "Mitra Dorm Care telah melewati proses verifikasi identitas dan pelatihan standar operasional.",
    ],
  },
];

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState(sections[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -60% 0px", threshold: 0.1 },
    );

    for (const section of sections) {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="space-y-6 pb-20 pt-10">
      {/* Header */}
      <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="section-label">Legal Dorm Care</p>
            <h1 className="h2-title mt-2 text-neutral-900">Syarat & Ketentuan Penggunaan</h1>
            <p className="mt-3 max-w-3xl text-neutral-600">
              Dokumen ini menjadi panduan layanan agar pengalaman pengguna dan operasional tim Dorm Care tetap nyaman, aman, dan transparan.
            </p>
          </div>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-bold text-neutral-700 transition hover:bg-neutral-50 print:hidden"
          >
            <Printer className="size-4" />
            Cetak
          </button>
        </div>
      </section>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* Sticky Table of Contents */}
        <aside className="w-full shrink-0 lg:sticky lg:top-24 lg:w-[260px] print:hidden">
          <div className="rounded-2xl border border-neutral-200 bg-white p-4">
            <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500">
              <FileText className="size-3.5" />
              Daftar Isi
            </div>
            <nav className="space-y-1">
              {sections.map((section, idx) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    activeSection === section.id
                      ? "bg-brand-primary-light text-brand-primary-dark"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                  }`}
                >
                  <span className="grid size-5 shrink-0 place-content-center rounded text-[10px] font-bold bg-neutral-100 text-neutral-500">
                    {idx + 1}
                  </span>
                  {section.title}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 space-y-4">
          {sections.map((section, idx) => (
            <article
              key={section.id}
              id={section.id}
              className="scroll-mt-24 rounded-3xl border border-neutral-200 bg-white p-6"
            >
              <div className="mb-3 flex items-center gap-3">
                <span className="grid size-8 place-content-center rounded-lg bg-brand-primary text-sm font-bold text-white">
                  {idx + 1}
                </span>
                <h2 className="font-display text-xl font-bold text-neutral-900">{section.title}</h2>
              </div>
              <ul className="space-y-2.5 text-sm leading-relaxed text-neutral-700">
                {section.items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>

      {/* Help CTA */}
      <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6 print:hidden">
        <h2 className="font-display text-xl font-bold text-amber-900">Butuh penjelasan tambahan?</h2>
        <p className="mt-2 text-sm text-amber-900/90">
          Tim kami siap bantu lewat kanal kontak. Jika ada ketentuan yang belum jelas, kalian bisa langsung diskusi dengan admin.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/kontak"
            className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-amber-600 btn-press"
          >
            Hubungi admin
          </Link>
          <Link
            href="/panduan"
            className="rounded-xl border border-amber-300 px-4 py-2 text-sm font-semibold text-amber-900 transition hover:bg-amber-100"
          >
            Buka halaman panduan
          </Link>
        </div>
      </section>

      {/* Last updated */}
      <p className="text-center text-xs text-neutral-400">
        Terakhir diperbarui: 14 April 2026 · Versi 1.0
      </p>
    </div>
  );
}
