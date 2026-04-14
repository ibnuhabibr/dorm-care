"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { ArrowRight, Calculator, Search, SlidersHorizontal, TicketPercent } from "lucide-react";

import { ServiceCard } from "@/components/service-card";
import { promoCatalog, serviceCatalog, type ServiceCategory } from "@/data/site-data";


const sections: Array<{ key: "semua" | ServiceCategory; title: string; description: string }> = [
  { key: "semua", title: "Semua Layanan", description: "Lihat seluruh katalog layanan Dorm Care" },
  { key: "utama", title: "Layanan Utama", description: "Paket harian yang paling sering dipesan" },
  { key: "paket", title: "Paket Bersama", description: "Bundling untuk hasil maksimal dan lebih hemat" },
  { key: "lainnya", title: "Layanan Lain", description: "Kebutuhan tambahan di luar paket utama" },
];

export default function LayananPage() {
  const [activeTab, setActiveTab] = useState<(typeof sections)[number]["key"]>("semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"default" | "murah" | "mahal">("default");

  const sectionRefs = useRef<Record<(typeof sections)[number]["key"], HTMLElement | null>>({
    semua: null,
    utama: null,
    paket: null,
    lainnya: null,
  });

  const setSectionRef = (key: (typeof sections)[number]["key"]) => (el: HTMLElement | null) => {
    sectionRefs.current[key] = el;
  };

  const scrollToSection = (key: (typeof sections)[number]["key"]) => {
    setActiveTab(key);
    const target = sectionRefs.current[key];
    if (target) {
      const y = target.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const listByCategory = (category: ServiceCategory) => serviceCatalog.filter((service) => service.kategori === category);

  const filteredAndSorted = useMemo(() => {
    let result = serviceCatalog.filter((s) =>
      !searchQuery ||
      s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.deskripsi.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (sortBy === "murah") result = [...result].sort((a, b) => a.hargaMin - b.hargaMin);
    if (sortBy === "mahal") result = [...result].sort((a, b) => b.hargaMin - a.hargaMin);
    return result;
  }, [searchQuery, sortBy]);

  return (
    <div className="pb-20 pt-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-neutral-900 px-6 py-16 text-white sm:px-12 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-neutral-800 via-neutral-900 to-neutral-900 -z-10" />
        <div className="absolute -bottom-12 -right-12 h-64 w-64 rounded-full bg-brand-primary/20 blur-[80px] pointer-events-none" />
        
        <div className="relative z-10">
          <p className="text-[11px] font-bold uppercase tracking-widest text-brand-primary mb-3">Katalog Layanan</p>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white leading-tight">Pilih layanan yang <br/><span className="text-brand-primary">cocok untukmu</span></h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-neutral-300">
            Semua paket dirancang untuk gaya hidup mahasiswa Surabaya: cepat, praktis, dan terjangkau tanpa perlu repot antre.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-3 xl:w-4/5 border-t border-white/10 pt-8">
            {promoCatalog.slice(0, 3).map((promo) => (
              <article key={promo.id} className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md transition hover:bg-white/10 hover:border-brand-primary/50">
                {/* Accent glow on hover */}
                <div className="absolute -inset-x-4 -inset-y-4 z-0 opacity-0 bg-brand-primary/10 blur-xl transition-opacity hover:opacity-100 group-hover:opacity-100" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="grid size-6 place-content-center rounded-full bg-brand-accent/20 text-[10px] text-brand-accent">
                      <TicketPercent className="size-3" />
                    </span>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-brand-accent">{promo.kode}</p>
                  </div>
                  <h3 className="font-display text-base font-bold text-white mb-1">{promo.nama}</h3>
                  <p className="text-xs text-neutral-400 line-clamp-2">{promo.deskripsi}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs Selection Sticky Dropdown / Header */}
      <section className="sticky top-24 z-40 mt-8 mb-10 overflow-x-auto hide-scrollbar sm:overflow-visible">
        <div className="flex w-max min-w-full gap-2 rounded-2xl border border-neutral-200/60 bg-white/80 p-2 shadow-sm backdrop-blur-xl">
          {sections.map((section) => (
            <button
              key={section.key}
              type="button"
              onClick={() => scrollToSection(section.key)}
              className={`flex-1 rounded-xl px-5 py-2.5 text-sm font-bold transition-all ${
                activeTab === section.key
                  ? "bg-brand-primary text-white shadow-md shadow-brand-primary/20"
                  : "bg-transparent text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
              }`}
            >
              {section.title}
            </button>
          ))}
        </div>
      </section>

      {/* Search + Sort */}
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari layanan... (contoh: deep clean, laundry)"
            className="h-11 w-full rounded-xl border border-neutral-200 bg-white pl-10 pr-4 text-sm outline-none ring-brand-primary/30 transition focus:border-brand-primary focus:ring-2"
          />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-4 text-neutral-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "default" | "murah" | "mahal")}
            className="rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm font-semibold text-neutral-700 outline-none"
          >
            <option value="default">Urutan Default</option>
            <option value="murah">Harga Termurah</option>
            <option value="mahal">Harga Termahal</option>
          </select>
        </div>
      </div>

      {/* Sections Content */}
      <section ref={setSectionRef("semua")} className="pt-8 scroll-mt-36">
        <div className="mb-8">
          <h2 className="font-display text-3xl font-bold text-neutral-900">Semua layanan</h2>
          <p className="mt-2 text-sm text-neutral-500">{sections[0].description}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredAndSorted.length > 0 ? (
            filteredAndSorted.map((service) => (
              <ServiceCard key={service.id} item={service} />
            ))
          ) : (
            <div className="col-span-3 py-12 text-center">
              <p className="text-neutral-500 text-sm">Tidak ada layanan yang cocok dengan pencarian &quot;{searchQuery}&quot;</p>
            </div>
          )}
        </div>
      </section>
      
      {/* Visual Divider */}
      <div className="my-16 h-px w-full bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />

      <section ref={setSectionRef("utama")} className="scroll-mt-36">
        <div className="mb-8 text-center max-w-xl mx-auto">
          <p className="text-[11px] font-bold uppercase tracking-widest text-brand-primary mb-2">Paling Sering Dipesan</p>
          <h2 className="font-display text-3xl font-bold text-neutral-900">Layanan Utama</h2>
          <p className="mt-3 text-sm text-neutral-500">{sections[1].description}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {listByCategory("utama").map((service) => (
            <ServiceCard key={service.id} item={service} />
          ))}
        </div>
      </section>
      
      {/* Visual Divider */}
      <div className="my-16 h-px w-full bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />

      <section ref={setSectionRef("paket")} className="scroll-mt-36">
        <div className="mb-8 text-center max-w-xl mx-auto">
          <p className="text-[11px] font-bold uppercase tracking-widest text-brand-primary mb-2">Penawaran Spesial</p>
          <h2 className="font-display text-3xl font-bold text-neutral-900">Paket Bersama</h2>
          <p className="mt-3 text-sm text-neutral-500">{sections[2].description}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 bg-brand-primary-light/20 p-6 md:p-8 rounded-3xl border border-brand-primary/10">
          {listByCategory("paket").map((service) => (
            <ServiceCard key={service.id} item={service} />
          ))}
        </div>
      </section>
      
      {/* Visual Divider */}
      <div className="my-16 h-px w-full bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />

      <section ref={setSectionRef("lainnya")} className="scroll-mt-36">
        <div className="mb-8">
          <h2 className="font-display text-2xl font-bold text-neutral-900">Layanan Lain</h2>
          <p className="mt-2 text-sm text-neutral-500">{sections[3].description}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {listByCategory("lainnya").map((service) => (
            <ServiceCard key={service.id} item={service} />
          ))}
        </div>
      </section>
      
      {/* CTA Kalkulator */}
      <section className="relative mt-24 rounded-3xl bg-surface-muted px-8 py-12 shadow-sm border border-neutral-200 overflow-hidden text-center md:text-left flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        <div className="absolute top-0 right-0 p-16 -mr-8 -mt-8 bg-brand-primary-light/50 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <div className="inline-flex size-12 items-center justify-center rounded-xl bg-white shadow-sm border border-neutral-200 mb-4 text-brand-primary md:mb-6">
            <Calculator className="size-6" />
          </div>
          <h2 className="font-display text-2xl font-bold text-neutral-900 mb-2">Simulasikan Estimasi Biaya</h2>
          <p className="text-sm text-neutral-600 max-w-md">Kalkulator khusus belum tersedia, langsung buat pesanan untuk melihat detail rinci harga dan diskon yang Anda dapatkan di halaman checkout.</p>
        </div>
        
        <div className="relative z-10 flex shrink-0">
          <Link
            href="/booking"
            className="flex items-center justify-center w-full md:w-auto gap-3 rounded-full bg-neutral-900 px-8 py-4 text-sm font-bold text-white shadow-lg transition-all hover:bg-brand-primary hover:shadow-brand-primary/30"
          >
            Lanjut ke Pemesanan <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

    </div>
  );
}
