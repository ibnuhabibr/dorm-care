"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, PlayCircle, Shield, AlertTriangle, Clock, CheckCircle2 } from "lucide-react";

import { faqCatalog, howItWorks } from "@/data/site-data";
import { ActivityIcon, CalendarIcon, CardIcon, ChecklistIcon, WhatsappIcon } from "@/components/ui/brand-icons";

const stepVisual = {
  check: ChecklistIcon,
  calendar: CalendarIcon,
  card: CardIcon,
  message: WhatsappIcon,
  activity: ActivityIcon,
} as const;

const kebijakanItems = [
  {
    title: "Pembatalan Pesanan",
    desc: "Pembatalan gratis jika dilakukan minimal 2 jam sebelum jadwal. Pembatalan mendadak (<1 jam) dikenakan biaya 30% dari total layanan.",
    icon: AlertTriangle,
    color: "bg-amber-50 border-amber-200 text-amber-900",
    iconColor: "text-amber-600",
  },
  {
    title: "Garansi Layanan",
    desc: "Dorm Care memberikan garansi pengerjaan ulang gratis jika hasil pembersihan tidak sesuai standar. Klaim harus dilaporkan dalam 24 jam.",
    icon: Shield,
    color: "bg-green-50 border-green-200 text-green-900",
    iconColor: "text-green-600",
  },
  {
    title: "Jam Operasional",
    desc: "Layanan tersedia setiap hari pukul 08.00–20.00 WIB (Senin–Jumat) dan 08.00–17.00 WIB (Sabtu). Hari Minggu & tanggal merah libur.",
    icon: Clock,
    color: "bg-blue-50 border-blue-200 text-blue-900",
    iconColor: "text-blue-600",
  },
  {
    title: "Keamanan & Privasi",
    desc: "Semua mitra Dorm Care telah terverifikasi identitas dan background check. Data pribadi pelanggan dijaga ketat sesuai kebijakan privasi.",
    icon: CheckCircle2,
    color: "bg-brand-primary-light border-brand-primary/20 text-neutral-900",
    iconColor: "text-brand-primary",
  },
];

export default function PanduanPage() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const miniFaq = faqCatalog.slice(0, 6);

  return (
    <div className="pb-20 pt-10">
      {/* Hero */}
      <section className="grid gap-6 rounded-3xl border border-neutral-200 bg-white p-6 sm:p-10 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="section-label">Panduan booking</p>
          <h1 className="hero-title mt-3 text-neutral-900">
            Cara pesan layanan Dorm Care, tanpa bingung
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-neutral-600 sm:text-base">
            Ikuti langkah sederhana berikut agar pesanan masuk lebih cepat dan jadwal kalian aman dari bentrok antrian.
          </p>
          <div className="mt-6 flex gap-3">
            <Link
              href="/booking"
              className="rounded-xl bg-brand-primary px-6 py-2.5 text-sm font-bold text-white transition hover:bg-brand-primary-dark btn-press"
            >
              Coba Booking
            </Link>
            <Link
              href="/layanan"
              className="rounded-xl border border-neutral-200 px-6 py-2.5 text-sm font-bold text-neutral-700 transition hover:bg-neutral-50"
            >
              Lihat Layanan
            </Link>
          </div>
        </div>
        <div className="rounded-2xl border border-brand-primary/20 bg-brand-primary-light p-6">
          <div className="mx-auto flex max-w-xs items-center justify-between">
            <div className="space-y-2">
              <div className="h-2 w-20 rounded-full bg-brand-primary/40" />
              <div className="h-2 w-14 rounded-full bg-brand-primary-light" />
              <div className="h-2 w-24 rounded-full bg-brand-primary/40" />
            </div>
            <div className="grid size-24 place-content-center rounded-2xl bg-white text-brand-primary shadow-sm">
              <ChecklistIcon className="size-12" />
            </div>
          </div>
          <p className="mt-4 text-center text-sm font-semibold text-brand-primary-dark">
            Mockup aplikasi booking di smartphone
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="pt-14">
        <div className="mb-6">
          <p className="section-label">Timeline visual</p>
          <h2 className="h2-title mt-2 text-neutral-900">
            Alur dari pilih layanan sampai order selesai
          </h2>
        </div>

        <div className="relative space-y-6">
          <div className="absolute left-6 top-0 hidden h-full w-0.5 bg-neutral-200 md:block" />
          {howItWorks.map((step) => {
            const Icon = stepVisual[step.icon as keyof typeof stepVisual];
            return (
              <article
                key={step.id}
                className="grid gap-4 rounded-2xl border border-neutral-200 bg-white p-5 md:grid-cols-[60px_1fr] md:items-center"
              >
                <div className="font-heading grid size-12 place-content-center rounded-xl bg-brand-primary text-lg font-bold text-white">
                  {step.id}
                </div>
                <div>
                  <h3 className="h3-title text-neutral-900">{step.title}</h3>
                  <p className="mt-2 text-sm text-neutral-600">{step.desc}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>


      {/* Kebijakan */}
      <section className="pt-14">
        <div className="mb-6">
          <p className="section-label">Kebijakan Layanan</p>
          <h2 className="h2-title mt-2 text-neutral-900">Yang perlu kamu ketahui</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {kebijakanItems.map((item) => (
            <article
              key={item.title}
              className={`rounded-2xl border p-5 ${item.color}`}
            >
              <div className="mb-3 flex items-center gap-3">
                <div className={`grid size-9 place-content-center rounded-xl bg-white/80 ${item.iconColor}`}>
                  <item.icon className="size-4" />
                </div>
                <h3 className="font-display text-base font-bold">{item.title}</h3>
              </div>
              <p className="text-sm leading-relaxed opacity-90">{item.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="pt-14">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="h2-title text-neutral-900">FAQ Panduan</h2>
          <Link
            href="/tentang#faq"
            className="flex items-center gap-1 text-sm font-bold text-brand-primary hover:text-brand-primary-dark transition"
          >
            Lihat Semua <ChevronRight className="size-4" />
          </Link>
        </div>
        <div className="space-y-3">
          {miniFaq.map((faq) => (
            <details
              key={faq.id}
              open={openFaq === faq.id}
              onToggle={(e) => {
                if ((e.target as HTMLDetailsElement).open) setOpenFaq(faq.id);
                else if (openFaq === faq.id) setOpenFaq(null);
              }}
              className="group rounded-2xl border border-neutral-200 bg-white p-5 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer items-center justify-between text-sm font-bold text-neutral-900">
                {faq.pertanyaan}
                <ChevronRight className="size-4 shrink-0 text-neutral-400 transition-transform group-open:rotate-90 group-open:text-brand-primary" />
              </summary>
              <p className="mt-3 border-t border-neutral-100 pt-3 text-sm leading-relaxed text-neutral-600">
                {faq.jawaban}
              </p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
