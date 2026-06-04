"use client";


import { useEffect, useState } from "react";
import Image from "next/image";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  ChevronRight,
  Clock,
  Heart,
  Mail,
  MapPin,
  Phone,
  Shield,
  Sparkles,
  Star,
  Target,
  Users,
  Zap,
} from "lucide-react";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

import { faqCatalog, whatsappContact } from "@/data/site-data";

const values = [
  { icon: Sparkles, title: "Bersih Berkualitas", desc: "Standar kebersihan profesional, bukan sekadar bersih di permukaan." },
  { icon: Clock, title: "Tepat Waktu", desc: "Mitra tiba sesuai jadwal, karena waktu mahasiswa sangat berharga." },
  { icon: Shield, title: "Aman & Terpercaya", desc: "Semua mitra diverifikasi, dilatih SOP, dan beroperasi transparan." },
  { icon: Heart, title: "Ramah Mahasiswa", desc: "Harga terjangkau, layanan fleksibel, dan komunikasi santai." },
  { icon: Zap, title: "Digital-First", desc: "Booking online, notifikasi WhatsApp, pantau status real-time." },
  { icon: Users, title: "Komunitas Kos", desc: "Bundling bareng teman kos jadi lebih hemat dan seru." },
];

const timeline = [
  { year: "2025", event: "Riset kebutuhan kebersihan mahasiswa Surabaya dimulai" },
  { year: "2026 Q1", event: "Dorm Care dirancang dan dikembangkan" },
  { year: "2026 Q2", event: "Soft Launch area Kecamatan Sukolilo, Surabaya" },
  { year: "2026 Q3", event: "Ekspansi area dan peluncuran program member" },
];



type GalleryItem = {
  id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
};

export default function TentangPage() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) { setGalleryLoading(false); return; }

      const { data } = await supabase
        .from("gallery")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (data) setGallery(data);
      setGalleryLoading(false);
    };
    fetchGallery();
  }, []);

  return (
    <div className="pb-20 pt-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-neutral-900 px-6 py-16 text-white sm:px-12 shadow-xl">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-neutral-800 via-neutral-900 to-neutral-900 -z-10" />
        <div className="absolute -bottom-12 -right-12 h-64 w-64 rounded-full bg-brand-primary/20 blur-[80px] pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <p className="section-label text-brand-primary mb-3">Tentang Kami</p>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white leading-tight">
            Kami percaya kamar bersih <br />
            <span className="text-brand-primary">mengubah hidup mahasiswa</span>
          </h1>
          <p className="mt-5 text-[15px] leading-relaxed text-neutral-300 max-w-xl">
            Dorm Care hadir sebagai pionir layanan kebersihan kos &amp; asrama digital di Surabaya.
            Didirikan oleh mahasiswa, untuk mahasiswa — kami tahu betapa repotnya menjaga kamar tetap bersih di tengah jadwal kuliah yang padat.
          </p>
        </div>
      </section>

      {/* Visi & Misi */}
      <section className="pt-20">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm card-hover">
            <div className="inline-flex size-12 items-center justify-center rounded-xl bg-brand-primary-light text-brand-primary mb-4">
              <Target className="size-6" />
            </div>
            <h2 className="font-display text-2xl font-bold text-neutral-900 mb-3">Visi</h2>
            <p className="text-sm leading-relaxed text-neutral-600">
              Menjadi layanan kebersihan hunian mahasiswa terdepan di Indonesia yang menggabungkan
              teknologi digital dengan sentuhan manusiawi, menciptakan lingkungan tinggal yang sehat
              dan mendukung produktivitas akademik.
            </p>
          </div>
          <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm card-hover">
            <div className="inline-flex size-12 items-center justify-center rounded-xl bg-brand-accent-light text-brand-accent mb-4">
              <Star className="size-6" />
            </div>
            <h2 className="font-display text-2xl font-bold text-neutral-900 mb-3">Misi</h2>
            <ul className="text-sm leading-relaxed text-neutral-600 space-y-2">
              <li className="flex items-start gap-2"><span className="mt-1.5 size-1.5 rounded-full bg-brand-primary shrink-0" /> Menyediakan layanan kebersihan profesional dengan harga terjangkau</li>
              <li className="flex items-start gap-2"><span className="mt-1.5 size-1.5 rounded-full bg-brand-primary shrink-0" /> Membangun sistem booking digital yang mudah dan transparan</li>
              <li className="flex items-start gap-2"><span className="mt-1.5 size-1.5 rounded-full bg-brand-primary shrink-0" /> Menciptakan lapangan kerja bagi komunitas lokal Surabaya</li>
              <li className="flex items-start gap-2"><span className="mt-1.5 size-1.5 rounded-full bg-brand-primary shrink-0" /> Mengembangkan ekosistem layanan kebutuhan mahasiswa</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Nilai-Nilai */}
      <section className="pt-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="section-label mb-2">Nilai Kami</p>
          <h2 className="font-display text-3xl font-bold text-neutral-900">Yang kami pegang teguh</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((item) => (
            <article key={item.title} className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm card-hover">
              <div className="inline-flex size-10 items-center justify-center rounded-xl bg-brand-primary-light/50 text-brand-primary mb-4">
                <item.icon className="size-5" />
              </div>
              <h3 className="font-display text-base font-bold text-neutral-900 mb-2">{item.title}</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">{item.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Galeri Dokumentasi */}
      <section className="pt-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="section-label mb-2">Galeri</p>
          <h2 className="font-display text-3xl font-bold text-neutral-900">Dokumentasi layanan kami</h2>
          <p className="mt-2 text-neutral-600 text-sm">
            Potret hasil kerja dan momen tim Dorm Care di lapangan
          </p>
        </div>

        {galleryLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="aspect-[4/3] rounded-2xl bg-neutral-100 animate-pulse" />
            ))}
          </div>
        ) : gallery.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50 p-12 text-center">
            <div className="mx-auto grid size-16 place-content-center rounded-full bg-neutral-100 text-neutral-400 mb-3">
              <svg className="size-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="m21 15-5-5L5 21" />
              </svg>
            </div>
            <p className="font-semibold text-neutral-500">Belum ada foto dokumentasi</p>
            <p className="text-xs text-neutral-400 mt-1">Admin akan menambahkan foto kegiatan segera</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setLightboxIndex(idx)}
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              >
                <Image
                  src={item.image_url}
                  alt={item.caption || "Dokumentasi Dorm Care"}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {item.caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 pt-8 translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200">
                    <p className="text-xs font-semibold text-white text-left">{item.caption}</p>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && gallery[lightboxIndex] && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 grid size-10 place-content-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
          >
            <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>

          {lightboxIndex > 0 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex - 1); }}
              className="absolute left-4 grid size-10 place-content-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
            >
              <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="m15 18-6-6 6-6" /></svg>
            </button>
          )}
          {lightboxIndex < gallery.length - 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex + 1); }}
              className="absolute right-4 grid size-10 place-content-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
            >
              <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="m9 18 6-6-6-6" /></svg>
            </button>
          )}

          <div className="relative max-h-[85vh] max-w-4xl w-full aspect-[4/3]">
            <Image
              src={gallery[lightboxIndex].image_url}
              alt={gallery[lightboxIndex].caption || "Dokumentasi Dorm Care"}
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>
          {gallery[lightboxIndex].caption && (
            <p className="absolute bottom-8 text-white/80 text-sm font-medium">{gallery[lightboxIndex].caption}</p>
          )}
        </div>
      )}

      {/* Timeline / Perjalanan */}
      <section className="pt-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="section-label mb-2">Perjalanan</p>
          <h2 className="font-display text-3xl font-bold text-neutral-900">Cerita di balik Dorm Care</h2>
        </div>
        <div className="relative mx-auto max-w-2xl">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-neutral-200 md:left-1/2 md:-ml-px" />
          {timeline.map((item, idx) => (
            <div key={item.year} className={`relative flex gap-6 pb-10 ${idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
              <div className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-primary text-[10px] font-bold text-white shadow-sm">
                {idx + 1}
              </div>
              <div className="flex-1 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-widest text-brand-primary mb-1">{item.year}</p>
                <p className="text-sm font-medium text-neutral-800">{item.event}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Kontak */}
      <section className="pt-20">
        <div className="rounded-3xl bg-neutral-900 px-6 py-12 text-white sm:px-12 relative overflow-hidden">
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-brand-primary/20 blur-[80px]" />
          
          <div className="relative z-10 text-center max-w-2xl mx-auto mb-10">
            <p className="section-label text-brand-accent mb-2">Hubungi Kami</p>
            <h2 className="font-display text-3xl font-bold text-white">Punya pertanyaan atau saran?</h2>
          </div>

          <div className="relative z-10 grid gap-4 sm:grid-cols-3 max-w-3xl mx-auto">
            <a
              href={`https://wa.me/${whatsappContact.nomor}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-2xl bg-green-500/20 border border-green-500/30 px-5 py-4 text-white transition hover:bg-green-500/30"
            >
              <Phone className="size-5 text-green-400" />
              <div>
                <p className="text-xs font-bold text-green-300">WhatsApp</p>
                <p className="text-sm font-bold">Chat Langsung</p>
              </div>
            </a>
            <a
              href={whatsappContact.instagram}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-2xl bg-pink-500/20 border border-pink-500/30 px-5 py-4 text-white transition hover:bg-pink-500/30"
            >
              <InstagramIcon className="size-5 text-pink-400" />
              <div>
                <p className="text-xs font-bold text-pink-300">Instagram</p>
                <p className="text-sm font-bold">@dormcare.sub</p>
              </div>
            </a>
            <a
              href={`mailto:${whatsappContact.email}`}
              className="flex items-center gap-3 rounded-2xl bg-blue-500/20 border border-blue-500/30 px-5 py-4 text-white transition hover:bg-blue-500/30"
            >
              <Mail className="size-5 text-blue-400" />
              <div>
                <p className="text-xs font-bold text-blue-300">Email</p>
                <p className="text-sm font-bold">{whatsappContact.email}</p>
              </div>
            </a>
          </div>

          <div className="relative z-10 mt-8 flex items-center justify-center gap-2 text-sm text-neutral-400">
            <MapPin className="size-4" />
            <span>{whatsappContact.area} • {whatsappContact.jamOperasional}</span>
          </div>
        </div>
      </section>

      {/* Google Maps Embed */}
      <section className="pt-10">
        <div className="overflow-hidden rounded-2xl border border-neutral-200 shadow-sm">
          <iframe
            title="Lokasi Dorm Care - Sukolilo, Surabaya"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15830.5!2d112.787!3d-7.289!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7fa11b19dfa69%3A0x1038f9ba3fbb1a0!2sSukolilo%2C%20Surabaya!5e0!3m2!1sid!2sid!4v1713100000000!5m2!1sid!2sid"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="pt-20 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="section-label mb-2">FAQ</p>
          <h2 className="font-display text-3xl font-bold text-neutral-900">Pertanyaan yang sering ditanyakan</h2>
        </div>
        <div className="mx-auto max-w-3xl space-y-4">
          {faqCatalog.map((faq) => (
            <div key={faq.id} className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                className="flex w-full cursor-pointer items-center justify-between p-5 text-left text-[15px] font-bold text-neutral-900"
              >
                {faq.pertanyaan}
                <ChevronRight className={`size-5 text-neutral-400 transition-transform shrink-0 ${openFaq === faq.id ? "rotate-90 text-brand-primary" : ""}`} />
              </button>
              {openFaq === faq.id && (
                <div className="border-t border-neutral-100 px-5 pb-5 pt-3 text-sm leading-relaxed text-neutral-600 animate-fade-in">
                  {faq.jawaban}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
