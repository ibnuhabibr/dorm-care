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
    color: "from-amber-50 to-amber-100/50 border-amber-200 text-amber-900",
    iconColor: "text-amber-600 bg-amber-100",
  },
  {
    title: "Garansi Layanan",
    desc: "Dorm Care memberikan garansi pengerjaan ulang gratis jika hasil pembersihan tidak sesuai standar. Klaim harus dilaporkan dalam 24 jam.",
    icon: Shield,
    color: "from-green-50 to-green-100/50 border-green-200 text-green-900",
    iconColor: "text-green-600 bg-green-100",
  },
  {
    title: "Jam Operasional",
    desc: "Layanan tersedia setiap hari pukul 08.00–20.00 WIB (Senin–Jumat) dan 08.00–17.00 WIB (Sabtu). Hari Minggu & tanggal merah libur.",
    icon: Clock,
    color: "from-blue-50 to-blue-100/50 border-blue-200 text-blue-900",
    iconColor: "text-blue-600 bg-blue-100",
  },
  {
    title: "Keamanan & Privasi",
    desc: "Semua mitra Dorm Care telah terverifikasi identitas dan background check. Data pribadi pelanggan dijaga ketat sesuai kebijakan privasi.",
    icon: CheckCircle2,
    color: "from-brand-primary-light/50 to-brand-primary-light/80 border-brand-primary/20 text-neutral-900",
    iconColor: "text-brand-primary bg-white shadow-sm",
  },
];

export default function PanduanPage() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const miniFaq = faqCatalog.slice(0, 6);

  return (
    <div className="pb-24 pt-10 antialiased selection:bg-brand-primary/20 bg-neutral-50/50">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        
        {/* Dynamic Minimalist Hero */}
        <section className="relative overflow-hidden rounded-3xl bg-neutral-900 px-6 py-16 text-white sm:px-12 shadow-2xl mb-16">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-neutral-800 via-neutral-900 to-neutral-900 -z-10" />
          <div className="absolute -left-32 -bottom-32 h-96 w-96 rounded-full bg-brand-primary/20 blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-primary/30 bg-brand-primary/10 px-3 py-1.5 backdrop-blur-sm mb-6">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-primary opacity-75"></span>
                <span className="relative inline-flex size-2 rounded-full bg-brand-primary"></span>
              </span>
              <p className="text-[11px] font-bold uppercase tracking-widest text-brand-primary-light">
                Panduan Booking Lengkap
              </p>
            </span>
            <h1 className="font-display text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl text-white mb-6">
              Kemudahan pesan layanan dalam genggaman.
            </h1>
            <p className="text-lg leading-relaxed text-neutral-400 mb-8 max-w-xl">
              Ikuti alur sederhana berikut agar pesanan masuk lebih cepat dan jadwal asrama kamu terjamin bebas dari bentrok antrian.
            </p>
            
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/booking" className="rounded-xl border border-transparent bg-brand-primary px-8 py-3.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(14,166,115,0.3)] transition hover:-translate-y-0.5 hover:bg-brand-primary-dark">
                Mulai Booking
              </Link>
              <Link href="/layanan" className="rounded-xl border border-neutral-700 bg-white/5 backdrop-blur-sm px-8 py-3.5 text-sm font-bold text-white transition hover:bg-white/10 hover:border-neutral-500">
                Eksplor Layanan
              </Link>
            </div>
          </div>
        </section>

        {/* Bento Grid Timeline */}
        <section className="mb-16">
          <div className="mb-8 text-center max-w-2xl mx-auto">
            <p className="text-[11px] font-bold uppercase tracking-widest text-brand-primary mb-2">Timeline Visual</p>
            <h2 className="font-display text-3xl font-bold text-neutral-900 md:text-4xl">Alur Kerja Cerdas</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {howItWorks.map((step, idx) => {
              const Icon = stepVisual[step.icon as keyof typeof stepVisual];
              // Buat card pertama dan terakhir lebih lebar bergaya bento
              const isLarge = idx === 0 || idx === 3;
              
              return (
                <div key={step.id} className={`group relative overflow-hidden rounded-3xl border border-neutral-200/60 bg-white p-8 shadow-sm transition hover:shadow-xl hover:border-brand-primary/30 ${isLarge ? 'lg:col-span-2' : 'lg:col-span-1'}`}>
                  <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-brand-primary-light/20 blur-3xl transition group-hover:bg-brand-primary/20" />
                  
                  <div className="relative z-10 flex items-start gap-5">
                    <div className="grid size-14 shrink-0 place-content-center rounded-2xl bg-brand-primary-light/50 text-brand-primary group-hover:scale-110 transition-transform duration-300">
                      <Icon className="size-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="flex size-6 items-center justify-center rounded-full bg-neutral-900 text-[10px] font-bold text-white">
                          0{idx + 1}
                        </span>
                        <h3 className="font-display text-lg font-bold text-neutral-900">{step.title}</h3>
                      </div>
                      <p className="text-sm leading-relaxed text-neutral-500">{step.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Kebijakan Layanan */}
        <section className="mb-16">
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-brand-primary mb-2">Kebijakan Layanan</p>
              <h2 className="font-display text-3xl font-bold text-neutral-900">Yang perlu kamu ketahui</h2>
            </div>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            {kebijakanItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className={`relative overflow-hidden rounded-3xl border p-6 sm:p-8 bg-gradient-to-br transition hover:-translate-y-1 hover:shadow-md ${item.color}`}>
                  <div className={`mb-5 inline-flex p-3 rounded-2xl ${item.iconColor}`}>
                    <Icon className="size-6" />
                  </div>
                  <h3 className="font-display text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-sm leading-relaxed opacity-90">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-10">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold text-neutral-900">Pertanyaan Populer</h2>
          </div>
          <div className="mx-auto max-w-3xl space-y-3">
            {miniFaq.map((item) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:border-brand-primary/30"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === item.id ? null : item.id)}
                  className="flex w-full items-center justify-between p-5 text-left transition select-none outline-none"
                >
                  <span className="font-bold text-neutral-900 pr-5">{item.pertanyaan}</span>
                  <div className={`grid size-8 shrink-0 place-content-center rounded-full transition-colors duration-300 ${openFaq === item.id ? "bg-brand-primary text-white" : "bg-neutral-100 text-neutral-500"}`}>
                     <ChevronRight className={`size-4 transition-transform duration-300 ${openFaq === item.id ? "rotate-90" : ""}`} />
                  </div>
                </button>
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                    openFaq === item.id ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 pb-5 pt-0 text-sm leading-relaxed text-neutral-500">
                      {item.jawaban}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
