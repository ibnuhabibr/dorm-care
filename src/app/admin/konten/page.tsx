"use client";

import { FormEvent, useState } from "react";
import { Plus, Stars, Trash2, MessageSquare, HelpCircle } from "lucide-react";
import toast from "react-hot-toast";

import { AdminNav } from "@/components/admin-nav";
import { faqCatalog, testimonials, type FaqItem, type TestimoniItem } from "@/data/site-data";

type ContentTab = "faq" | "testimoni" | "banner";

const tabs: Array<{ key: ContentTab; label: string; icon: typeof HelpCircle }> = [
  { key: "faq", label: "FAQ", icon: HelpCircle },
  { key: "testimoni", label: "Testimoni", icon: MessageSquare },
  { key: "banner", label: "Banner", icon: Stars },
];

export default function AdminKontenPage() {
  const [activeTab, setActiveTab] = useState<ContentTab>("faq");

  // FAQ state
  const [faqs, setFaqs] = useState(faqCatalog);
  const [faqForm, setFaqForm] = useState({ pertanyaan: "", jawaban: "", kategori: "layanan" as FaqItem["kategori"] });

  // Testimoni state
  const [testiList, setTestiList] = useState(testimonials);
  const [testiForm, setTestiForm] = useState({ nama: "", role: "", layanan: "", ulasan: "", rating: 5 });

  // Banner state
  const [bannerTitle, setBannerTitle] = useState("🎉 Grand Launch Dorm Care — Surabaya");
  const [bannerSub, setBannerSub] = useState("Nikmati diskon 15% untuk 50 pelanggan pertama!");
  const [bannerActive, setBannerActive] = useState(true);

  const addFaq = (e: FormEvent) => {
    e.preventDefault();
    if (!faqForm.pertanyaan || !faqForm.jawaban) return toast.error("Lengkapi pertanyaan & jawaban.");
    const newFaq: FaqItem = {
      id: `faq-${Date.now()}`,
      pertanyaan: faqForm.pertanyaan,
      jawaban: faqForm.jawaban,
      kategori: faqForm.kategori,
    };
    setFaqs((prev) => [newFaq, ...prev]);
    setFaqForm({ pertanyaan: "", jawaban: "", kategori: "layanan" });
    toast.success("FAQ berhasil ditambahkan.");
  };

  const addTesti = (e: FormEvent) => {
    e.preventDefault();
    if (!testiForm.nama || !testiForm.ulasan) return toast.error("Lengkapi nama & isi ulasan.");
    const newTesti: TestimoniItem = {
      id: `testi-${Date.now()}`,
      nama: testiForm.nama,
      role: testiForm.role || "Pengguna Dorm Care",
      layanan: testiForm.layanan || "Pro Basic Clean",
      ulasan: testiForm.ulasan,
      rating: testiForm.rating,
    };
    setTestiList((prev) => [newTesti, ...prev]);
    setTestiForm({ nama: "", role: "", layanan: "", ulasan: "", rating: 5 });
    toast.success("Testimoni berhasil ditambahkan.");
  };

  return (
    <div className="space-y-6 pb-20 pt-10">
      <section className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8">
        <p className="section-label">Admin Dorm Care</p>
        <h1 className="h2-title mt-2 text-neutral-900">Manajemen Konten</h1>
        <p className="mt-2 text-neutral-600">Kelola FAQ, testimoni, dan pengaturan banner promosi.</p>
      </section>

      <AdminNav />

      {/* Tab Switcher */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-3">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  activeTab === tab.key
                    ? "bg-brand-primary text-white"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                }`}
              >
                <Icon className="size-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* FAQ Tab */}
      {activeTab === "faq" && (
        <section className="grid gap-6 lg:grid-cols-12">
          {/* Add Form */}
          <article className="rounded-3xl border border-neutral-200 bg-white p-6 lg:col-span-4">
            <h2 className="text-xl font-black text-neutral-900">Tambah FAQ</h2>
            <p className="mt-1 text-sm text-neutral-600">Total FAQ: {faqs.length}</p>
            <form onSubmit={addFaq} className="mt-4 space-y-3">
              <label className="block space-y-1 text-sm font-semibold text-neutral-700">
                Pertanyaan
                <input
                  value={faqForm.pertanyaan}
                  onChange={(e) => setFaqForm((p) => ({ ...p, pertanyaan: e.target.value }))}
                  className="h-10 w-full rounded-xl border border-neutral-200 px-3 outline-none ring-brand-primary/30 focus:ring"
                />
              </label>
              <label className="block space-y-1 text-sm font-semibold text-neutral-700">
                Jawaban
                <textarea
                  rows={3}
                  value={faqForm.jawaban}
                  onChange={(e) => setFaqForm((p) => ({ ...p, jawaban: e.target.value }))}
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2 outline-none ring-brand-primary/30 focus:ring"
                />
              </label>
              <label className="block space-y-1 text-sm font-semibold text-neutral-700">
                Kategori
                <select
                  value={faqForm.kategori}
                  onChange={(e) => setFaqForm((p) => ({ ...p, kategori: e.target.value as FaqItem["kategori"] }))}
                  className="h-10 w-full rounded-xl border border-neutral-200 px-3 outline-none"
                >
                  <option value="layanan">Layanan</option>
                  <option value="pembayaran">Pembayaran</option>
                  <option value="jadwal">Jadwal</option>
                  <option value="area">Area</option>
                  <option value="akun">Akun</option>
                </select>
              </label>
              <button type="submit" className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-brand-primary text-sm font-bold text-white hover:bg-brand-primary-dark">
                <Plus className="size-4" /> Simpan FAQ
              </button>
            </form>
          </article>

          {/* FAQ List */}
          <article className="space-y-3 rounded-3xl border border-neutral-200 bg-white p-6 lg:col-span-8">
            <h2 className="text-xl font-black text-neutral-900">Daftar FAQ</h2>
            {faqs.map((faq) => (
              <div key={faq.id} className="rounded-2xl border border-neutral-200 p-4 group">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="rounded bg-neutral-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neutral-500">{faq.kategori}</span>
                    <h3 className="mt-1 font-bold text-neutral-900">{faq.pertanyaan}</h3>
                    <p className="mt-1 text-sm text-neutral-600">{faq.jawaban}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFaqs((prev) => prev.filter((f) => f.id !== faq.id));
                      toast.success("FAQ berhasil dihapus.");
                    }}
                    className="rounded-lg p-2 text-neutral-400 opacity-0 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            ))}
          </article>
        </section>
      )}

      {/* Testimoni Tab */}
      {activeTab === "testimoni" && (
        <section className="grid gap-6 lg:grid-cols-12">
          <article className="rounded-3xl border border-neutral-200 bg-white p-6 lg:col-span-4">
            <h2 className="text-xl font-black text-neutral-900">Tambah Testimoni</h2>
            <p className="mt-1 text-sm text-neutral-600">Total: {testiList.length}</p>
            <form onSubmit={addTesti} className="mt-4 space-y-3">
              <label className="block space-y-1 text-sm font-semibold text-neutral-700">
                Nama pelanggan
                <input value={testiForm.nama} onChange={(e) => setTestiForm((p) => ({ ...p, nama: e.target.value }))} className="h-10 w-full rounded-xl border border-neutral-200 px-3 outline-none ring-brand-primary/30 focus:ring" />
              </label>
              <label className="block space-y-1 text-sm font-semibold text-neutral-700">
                Role
                <input value={testiForm.role} onChange={(e) => setTestiForm((p) => ({ ...p, role: e.target.value }))} placeholder="Mahasiswa ITS" className="h-10 w-full rounded-xl border border-neutral-200 px-3 outline-none ring-brand-primary/30 focus:ring" />
              </label>
              <label className="block space-y-1 text-sm font-semibold text-neutral-700">
                Layanan yang digunakan
                <input value={testiForm.layanan} onChange={(e) => setTestiForm((p) => ({ ...p, layanan: e.target.value }))} placeholder="Pro Basic Clean" className="h-10 w-full rounded-xl border border-neutral-200 px-3 outline-none ring-brand-primary/30 focus:ring" />
              </label>
              <label className="block space-y-1 text-sm font-semibold text-neutral-700">
                Isi ulasan
                <textarea rows={3} value={testiForm.ulasan} onChange={(e) => setTestiForm((p) => ({ ...p, ulasan: e.target.value }))} className="w-full rounded-xl border border-neutral-200 px-3 py-2 outline-none ring-brand-primary/30 focus:ring" />
              </label>
              <label className="block space-y-1 text-sm font-semibold text-neutral-700">
                Rating (1-5)
                <input type="number" min={1} max={5} value={testiForm.rating} onChange={(e) => setTestiForm((p) => ({ ...p, rating: Number(e.target.value) }))} className="h-10 w-full rounded-xl border border-neutral-200 px-3 outline-none ring-brand-primary/30 focus:ring" />
              </label>
              <button type="submit" className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-brand-primary text-sm font-bold text-white hover:bg-brand-primary-dark">
                <Plus className="size-4" /> Simpan Testimoni
              </button>
            </form>
          </article>

          <article className="space-y-3 rounded-3xl border border-neutral-200 bg-white p-6 lg:col-span-8">
            <h2 className="text-xl font-black text-neutral-900">Daftar Testimoni</h2>
            {testiList.map((t) => (
              <div key={t.id} className="rounded-2xl border border-neutral-200 p-4 group">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="grid size-10 shrink-0 place-content-center rounded-full bg-brand-primary text-sm font-bold text-white">
                      {t.nama.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-neutral-900">{t.nama}</p>
                      <p className="text-xs text-neutral-500">{t.role} · {t.layanan} · ⭐ {t.rating}</p>
                      <p className="mt-1 text-sm text-neutral-600 italic">&ldquo;{t.ulasan}&rdquo;</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setTestiList((prev) => prev.filter((i) => i.id !== t.id));
                      toast.success("Testimoni dihapus.");
                    }}
                    className="rounded-lg p-2 text-neutral-400 opacity-0 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            ))}
          </article>
        </section>
      )}

      {/* Banner Tab */}
      {activeTab === "banner" && (
        <section className="rounded-3xl border border-neutral-200 bg-white p-6">
          <h2 className="text-xl font-black text-neutral-900 mb-4">Pengaturan Banner Promosi</h2>
          <p className="text-sm text-neutral-600 mb-6">Banner ini ditampilkan di bagian atas halaman Beranda.</p>

          <div className="space-y-4 max-w-xl">
            <label className="block space-y-1 text-sm font-semibold text-neutral-700">
              Judul banner
              <input
                value={bannerTitle}
                onChange={(e) => setBannerTitle(e.target.value)}
                className="h-10 w-full rounded-xl border border-neutral-200 px-3 outline-none ring-brand-primary/30 focus:ring"
              />
            </label>
            <label className="block space-y-1 text-sm font-semibold text-neutral-700">
              Teks pendukung
              <input
                value={bannerSub}
                onChange={(e) => setBannerSub(e.target.value)}
                className="h-10 w-full rounded-xl border border-neutral-200 px-3 outline-none ring-brand-primary/30 focus:ring"
              />
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input type="checkbox" checked={bannerActive} onChange={() => setBannerActive(!bannerActive)} className="peer sr-only" />
                <div className="h-6 w-11 rounded-full bg-neutral-200 transition peer-checked:bg-brand-primary" />
                <div className="absolute left-[2px] top-[2px] h-5 w-5 rounded-full bg-white transition peer-checked:translate-x-full" />
              </div>
              <span className="text-sm font-semibold text-neutral-700">Banner aktif</span>
            </label>

            {/* Preview */}
            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">Preview</p>
              {bannerActive ? (
                <div className="rounded-2xl bg-gradient-to-r from-brand-primary to-brand-primary-dark p-4 text-white">
                  <p className="font-display font-bold">{bannerTitle}</p>
                  <p className="text-sm text-white/80 mt-1">{bannerSub}</p>
                </div>
              ) : (
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-center text-neutral-500 text-sm">
                  Banner sedang dinonaktifkan.
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => toast.success("Pengaturan banner disimpan!")}
              className="mt-4 rounded-xl bg-brand-primary px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-primary-dark transition"
            >
              Simpan Pengaturan
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
