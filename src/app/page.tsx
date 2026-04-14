"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, CheckCircle2, ChevronRight, PlayCircle, ShieldCheck, Sparkles, Star, Target, X, Zap } from "lucide-react";

import { ServiceCard } from "@/components/service-card";
import {
  faqCatalog,
  howItWorks,
  launchBanner,
  membershipCatalog,
  serviceCatalog,
  testimonials,
  trustStats,
} from "@/data/site-data";
import {
  ActivityIcon,

  CalendarIcon,
  CardIcon,
  ChecklistIcon,
  WhatsappIcon,
} from "@/components/ui/brand-icons";
import { RatingStars } from "@/components/ui/rating-stars";

const iconByStep = {
  check: ChecklistIcon,
  calendar: CalendarIcon,
  card: CardIcon,
  message: WhatsappIcon,
  activity: ActivityIcon,
} as const;


function CountUpStat({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState("0");
  const animated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          // Parse numeric part
          const numericMatch = value.match(/(\d+)/);
          if (!numericMatch) {
            setDisplay(value);
            return;
          }
          const target = parseInt(numericMatch[1]);
          const prefix = value.slice(0, value.indexOf(numericMatch[1]));
          const suffix = value.slice(value.indexOf(numericMatch[1]) + numericMatch[1].length);
          const duration = 1500;
          const start = performance.now();

          const tick = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(target * eased);
            setDisplay(`${prefix}${current}${suffix}`);
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <article ref={ref} className="text-center">
      <p className="font-display text-4xl font-extrabold text-white">{display}</p>
      <p className="mt-2 text-xs font-bold uppercase tracking-widest text-neutral-400">{label}</p>
    </article>
  );
}

export default function Homepage() {
  const [showBanner, setShowBanner] = useState(false);
  const [serviceTab, setServiceTab] = useState<"semua" | "utama" | "paket">("semua");

  // Persist banner dismiss in sessionStorage
  useEffect(() => {
    const dismissed = sessionStorage.getItem("dormcare-banner-dismissed");
    if (!dismissed) {
      setTimeout(() => setShowBanner(true), 0);
    }
  }, []);

  const dismissBanner = () => {
    setShowBanner(false);
    sessionStorage.setItem("dormcare-banner-dismissed", "1");
  };

  const shortFaq = useMemo(() => faqCatalog.slice(0, 4), []);
  const filteredServices = useMemo(() => {
    if (serviceTab === "semua") return serviceCatalog.slice(0, 6);
    return serviceCatalog.filter((s) => s.kategori === serviceTab).slice(0, 6);
  }, [serviceTab]);

  return (
    <div className="pb-20">
      {/* Promo Banner */}
      {showBanner && (
        <section
          className="animate-slide-down sticky top-24 z-30 mx-auto mt-6 max-w-[90%] overflow-hidden rounded-2xl bg-brand-accent p-[2px] shadow-lg xl:max-w-4xl"
        >
          <div className="relative flex flex-wrap items-center justify-between gap-4 rounded-xl bg-black/5 px-4 py-3 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <span className="grid size-8 place-content-center rounded-full bg-white/20 text-neutral-900 shadow-sm mix-blend-overlay">
                🎁
              </span>
              <p className="text-[13px] font-bold text-neutral-900 sm:text-sm">
                {launchBanner.text}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/promo"
                className="rounded-lg bg-neutral-900 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-white transition hover:bg-neutral-800"
              >
                Lihat Promo
              </Link>
              <button
                type="button"
                onClick={dismissBanner}
                className="grid size-8 place-content-center rounded-lg text-neutral-700 hover:bg-white/20 hover:text-neutral-900 transition"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Hero Section */}
      <section className="relative grid gap-12 pb-24 pt-16 lg:grid-cols-12 lg:items-center xl:pt-24 mt-4">
        {/* Soft blur accent highlights top left */}
        <div className="absolute left-0 top-0 -z-10 h-[300px] w-[300px] rounded-full bg-brand-primary-light/50 blur-[80px]" />

        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex animate-fade-in items-center gap-2 rounded-full border border-brand-primary/20 bg-brand-primary-light/50 px-3 py-1.5 backdrop-blur-sm">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-primary opacity-75"></span>
              <span className="relative inline-flex size-2.5 rounded-full bg-brand-primary"></span>
            </span>
            <p className="text-[11px] font-bold uppercase tracking-widest text-brand-primary-dark">
              JASA KEBERSIHAN KOS & ASRAMA
            </p>
          </div>
          
          <h1 className="font-display text-5xl font-extrabold leading-[1.1] tracking-tight text-neutral-900 sm:text-6xl xl:text-7xl animate-fade-in-up [animation-delay:100ms]">
            Kamar bersih,
            <br />
            <span className="text-brand-primary">hidup lebih tenang.</span>
          </h1>
          
          <p className="max-w-xl text-lg leading-relaxed text-neutral-600 animate-fade-in-up [animation-delay:200ms]">
            Pesan kapan saja, tim kami datang ke kos-mu. Booking cerdas tanpa antrian bentrok untuk kamu mahasiswa di area Surabaya.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4 animate-fade-in-up [animation-delay:300ms]">
            <Link
              href="/booking"
              className="rounded-full bg-brand-primary px-8 py-3.5 text-[15px] font-bold text-white shadow-brand transition-all hover:bg-brand-primary-dark hover:-translate-y-0.5 active:translate-y-0"
            >
              Pesan Sekarang
            </Link>
            <Link
              href="/layanan"
              className="rounded-full border border-neutral-200 bg-white px-8 py-3.5 text-[15px] font-bold text-neutral-700 shadow-sm transition-all hover:border-neutral-300 hover:bg-neutral-50 active:translate-y-0"
            >
              Lihat Layanan
            </Link>
          </div>

          <div className="flex items-center gap-4 pt-6 animate-fade-in-up [animation-delay:400ms]">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`size-10 rounded-full border-2 border-white bg-neutral-200`} style={{ backgroundImage: `url('https://api.dicebear.com/7.x/notionists/svg?seed=${i}&backgroundColor=e5e7eb')` }} />
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1 text-brand-accent">
                <Star className="size-4 fill-current" />
                <Star className="size-4 fill-current" />
                <Star className="size-4 fill-current" />
                <Star className="size-4 fill-current" />
                <Star className="size-4 fill-current" />
              </div>
              <p className="text-sm font-medium text-neutral-500 mt-0.5"><span className="font-bold text-neutral-800">4.9/5</span> dari 100+ pelanggan</p>
            </div>
          </div>
        </div>

        <div className="relative lg:col-span-5 animate-fade-in-left [animation-delay:300ms] hidden md:block">
          {/* Floating 'Pesanan Aktif' Card */}
          <div className="relative z-10 mx-auto max-w-sm rotate-2 rounded-2xl border border-neutral-200/60 bg-white/80 p-5 shadow-xl shadow-brand-primary/10 backdrop-blur-xl transition hover:rotate-0 hover:scale-105">
            <div className="mb-4 flex items-center justify-between">
              <span className="rounded-full bg-brand-accent-light px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-accent">
                Sedang Dikerjakan
              </span>
              <span className="text-xs font-bold text-neutral-400">ETA 15 Min</span>
            </div>
            <h3 className="font-display text-xl font-bold text-neutral-900">Deep Clean Premium</h3>
            <p className="mt-1 text-sm text-neutral-500">Blok Kos Keputih Utara</p>
            
            <div className="mt-5 space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-brand-primary">Proses Pembersihan</span>
                <span className="text-brand-primary">75%</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-brand-primary-light/50">
                <div className="h-full w-3/4 rounded-full bg-brand-primary shadow-[inset_0_-2px_4px_rgba(0,0,0,0.1)]" />
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3 border-t border-neutral-100 pt-4">
              <div className="grid size-11 place-content-center rounded-full bg-gradient-to-br from-brand-primary to-brand-primary-dark text-sm font-bold text-white shadow-sm">
                AG
              </div>
              <div>
                <p className="text-sm font-bold text-neutral-900">Agung Prasetyo</p>
                <div className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-brand-primary">
                  <ShieldCheck className="size-3" /> Mitra Terverifikasi
                </div>
              </div>
            </div>
          </div>

          {/* Decorative Card Behind */}
          <div className="absolute -bottom-8 -left-4 z-0 h-40 w-64 -rotate-6 rounded-2xl border border-neutral-200/50 bg-white/60 p-5 shadow-lg backdrop-blur-md opacity-80" />
          
          {/* Subtle Notification Badge */}
          <div className="absolute -right-6 top-12 z-20 flex animate-bounce items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 shadow-md">
            <CheckCircle2 className="size-4 text-green-600" />
            <p className="text-xs font-bold text-green-700">Kamar A12 Selesai!</p>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="rounded-3xl bg-neutral-900 px-6 py-12 shadow-2xl relative overflow-hidden mt-8">
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-brand-primary/20 blur-[80px]" />
        <div className="absolute -left-24 -bottom-24 h-64 w-64 rounded-full bg-brand-accent/20 blur-[80px]" />
        
        <div className="relative z-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {trustStats.map((metric) => (
            <CountUpStat key={metric.label} label={metric.label} value={metric.value} />
          ))}
        </div>
      </section>

      {/* Cara Kerja */}
      <section className="pt-28">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-[11px] font-bold uppercase tracking-widest text-brand-primary mb-2">Cara Kerja</p>
          <h2 className="font-display text-3xl font-bold text-neutral-900 md:text-4xl">Bersih dalam 5 langkah mudah</h2>
        </div>
        
        <div className="mt-14 grid gap-6 md:grid-cols-3 lg:grid-cols-5 relative">
          {/* Connector Line For Desktop */}
          <div className="absolute top-10 left-10 right-10 h-0.5 bg-neutral-200 hidden lg:block" />
          
          {howItWorks.map((step, idx) => {
            const Icon = iconByStep[step.icon as keyof typeof iconByStep] || Zap;
            return (
              <article key={step.id} className="relative group">
                <div className="relative z-10 mx-auto flex size-20 items-center justify-center rounded-full border-4 border-surface-base bg-white shadow-md transition-transform group-hover:scale-110 group-hover:border-brand-primary-light">
                  <div className="flex size-14 items-center justify-center rounded-full bg-brand-primary-light/30 text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors">
                    <Icon className="size-6" />
                  </div>
                  <span className="absolute -bottom-2 -right-2 grid size-7 place-content-center rounded-full border-2 border-white bg-neutral-900 text-xs font-bold text-white">
                    {idx + 1}
                  </span>
                </div>
                <div className="mt-6 text-center">
                  <h3 className="text-sm font-bold text-neutral-900">{step.title}</h3>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Layanan Favorit */}
      <section className="pt-28">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-brand-primary mb-2">Layanan Kami</p>
            <h2 className="font-display text-3xl font-bold text-neutral-900 md:text-4xl">Paling sering dipesan</h2>
          </div>
          <Link href="/layanan" className="group flex items-center gap-2 text-sm font-bold text-brand-primary hover:text-brand-primary-dark transition">
            Lihat Semua Layanan <ChevronRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Tab Filter */}
        <div className="mb-8 flex gap-2">
          {(["semua", "utama", "paket"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setServiceTab(tab)}
              className={`rounded-xl px-5 py-2.5 text-sm font-bold transition ${
                serviceTab === tab
                  ? "bg-brand-primary text-white shadow-sm"
                  : "bg-white border border-neutral-200 text-neutral-600 hover:border-brand-primary/30"
              }`}
            >
              {tab === "semua" ? "Semua" : tab === "utama" ? "Layanan Utama" : "Paket Bundling"}
            </button>
          ))}
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} item={service} />
          ))}
        </div>
      </section>

      {/* Member Level Section */}
      <section className="mt-28 rounded-3xl bg-neutral-900 px-6 py-16 text-white sm:px-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-neutral-800 via-neutral-900 to-neutral-900 -z-10" />
        
        <div className="text-center max-w-2xl mx-auto relative z-10">
          <p className="text-[11px] font-bold uppercase tracking-widest text-brand-accent mb-2">Loyalty Program</p>
          <h2 className="font-display text-3xl font-bold text-white md:text-4xl">Makin sering pesan, makin banyak untungnya</h2>
        </div>
        
        <div className="mt-12 grid gap-6 md:grid-cols-3 relative z-10">
          {membershipCatalog.map((membership) => {
            const isGold = membership.level === "gold";
            return (
              <article
                key={membership.level}
                className={`relative overflow-hidden rounded-3xl border p-6 transition-all hover:-translate-y-1 ${
                  isGold
                    ? "border-brand-accent bg-gradient-to-b from-brand-accent/20 to-neutral-900/50 shadow-[0_0_30px_rgba(245,158,11,0.15)]"
                    : membership.level === "silver"
                      ? "border-neutral-500 bg-gradient-to-b from-neutral-700/30 to-neutral-900/50"
                      : "border-brand-primary/40 bg-gradient-to-b from-brand-primary-dark/20 to-neutral-900/50"
                }`}
              >
                {/* Subtle shine effect for gold */}
                {isGold && <div className="absolute inset-0 -top-24 -left-20 w-1/2 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-45" />}

                <div className="relative z-10">
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="font-display text-2xl font-bold capitalize text-white">{membership.title}</h3>
                    {isGold && <Sparkles className="size-6 text-brand-accent" />}
                  </div>
                  <p className="mb-6 text-sm font-medium text-neutral-400 pb-6 border-b border-white/10">{membership.subtitle}</p>
                  
                  <ul className="space-y-4 text-sm text-neutral-200">
                    {membership.benefit.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <div className="rounded-full bg-white/10 p-1 mt-0.5">
                          <CheckCircle2 className={`size-3 ${isGold ? "text-brand-accent" : "text-white"}`} />
                        </div>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
        
        <div className="mt-12 flex justify-center relative z-10">
          <Link
            href="/auth/daftar"
            className="group rounded-full bg-white px-8 py-3.5 text-sm font-bold text-neutral-900 transition hover:bg-neutral-100 hover:shadow-lg"
          >
            Daftar Sekarang, Mulai dari Bronze <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </section>

      {/* Testimoni */}
      <section className="pt-28">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-[11px] font-bold uppercase tracking-widest text-brand-primary mb-2">Ulasan Pelanggan</p>
          <h2 className="font-display text-3xl font-bold text-neutral-900 md:text-4xl">Apa kata mereka tentang kami</h2>
        </div>
        
        {/* Simple flex scroll container for testimonials */}
        <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory pt-4 px-2 -mx-2 hide-scrollbar">
          {testimonials.map((testimonial, idx) => (
            <article key={testimonial.id} className="min-w-[320px] max-w-[340px] snap-center rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:shadow-md">
              <div className="mb-5 flex items-center gap-4">
                <div
                  className="grid size-12 shrink-0 place-content-center rounded-full text-sm font-bold text-white shadow-inner"
                  style={{ background: ["#0EA673", "#F59E0B", "#10B981", "#3B82F6"][idx % 4] }}
                >
                  {testimonial.nama.charAt(0)}
                </div>
                <div>
                  <p className="text-[15px] font-bold text-neutral-900 leading-tight">{testimonial.nama}</p>
                  <p className="text-xs font-medium text-neutral-500 mt-1">{testimonial.role}</p>
                </div>
              </div>
              <RatingStars value={testimonial.rating} />
              <p className="mt-4 text-sm leading-relaxed text-neutral-600 line-clamp-4">&quot;{testimonial.ulasan}&quot;</p>
              <div className="mt-5 inline-block rounded-lg bg-neutral-100 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-600">
                {testimonial.layanan}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* FAQ Singkat */}
      <section className="pt-20">
        <div className="mx-auto max-w-3xl text-center mb-10">
          <h2 className="font-display text-3xl font-bold text-neutral-900">Pertanyaan yang sering ditanyakan</h2>
        </div>
        
        <div className="mx-auto max-w-3xl space-y-4">
          {shortFaq.map((faq) => (
            <details key={faq.id} className="group rounded-2xl border border-neutral-200 bg-white p-5 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between text-[15px] font-bold text-neutral-900">
                {faq.pertanyaan}
                <span className="ml-4 transition group-open:rotate-180">
                  <ChevronRight className="size-5 text-neutral-400 group-open:text-brand-primary group-open:-rotate-90 transition-all" />
                </span>
              </summary>
              <p className="mt-4 border-t border-neutral-100 pt-4 text-sm leading-relaxed text-neutral-600">{faq.jawaban}</p>
            </details>
          ))}
          <div className="mt-8 text-center border-t border-neutral-100 pt-8">
            <Link href="/tentang#faq" className="inline-flex items-center gap-2 text-sm font-bold text-brand-primary hover:text-brand-primary-dark transition">
              Lihat semua FAQ <ChevronRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="mt-20 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-primary-dark to-brand-primary px-6 py-16 text-white text-center relative shadow-xl">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
        
        <div className="relative z-10 mx-auto max-w-2xl">
          <h2 className="font-display text-3xl font-bold md:text-4xl text-white">Siap kamarmu bersih hari ini?</h2>
          <p className="mt-4 text-sm text-brand-primary-light/90 leading-relaxed max-w-xl mx-auto">
            Pilih layanan sesuai kebutuhanmu, booking slot yang tersedia, lalu biarkan tim Dorm Care mengerjakan sisanya untuk kamu.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/booking" className="rounded-full bg-white px-8 py-3.5 text-sm font-bold text-brand-primary-dark shadow-lg transition hover:bg-neutral-50 hover:-translate-y-0.5">
              Pesan Sekarang
            </Link>
            <a
              href="https://wa.me/6282233080680?text=Halo+Dorm+Care,+saya+mau+booking+hari+ini"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-full border-2 border-white/30 bg-white/10 px-8 py-3.5 text-sm font-bold text-white transition hover:bg-white/20 backdrop-blur-sm"
            >
              Chat WhatsApp <ArrowRight className="size-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Required empty div for lucide-react implicit dynamic imports from old code */}
      <div className="hidden">
        <PlayCircle className="size-0" />
        <Target className="size-0" />
      </div>
    </div>
  );
}
