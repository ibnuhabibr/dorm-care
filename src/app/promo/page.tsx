"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Clock, Copy, Filter, Sparkles, Tag, Ticket } from "lucide-react";
import toast from "react-hot-toast";

import { promoCatalog } from "@/data/site-data";

type FilterType = "semua" | "diskon" | "member" | "bundle";

function useCountdown(targetDate: string) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const target = new Date(targetDate).getTime();
    const tick = () => {
      const now = Date.now();
      const diff = Math.max(target - now, 0);
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
        secs: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return timeLeft;
}

function CountdownBadge({ date }: { date: string }) {
  const { days, hours, mins, secs } = useCountdown(date);
  if (days <= 0 && hours <= 0 && mins <= 0 && secs <= 0) {
    return <span className="text-xs font-bold text-red-500">Kedaluwarsa</span>;
  }
  return (
    <div className="flex items-center gap-1 text-[10px] font-bold text-brand-accent">
      <Clock className="size-3" />
      <span className="tabular-nums">
        {days > 0 ? `${days}h ` : ""}
        {String(hours).padStart(2, "0")}:{String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
      </span>
    </div>
  );
}

export default function PromoPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>("semua");

  const filtered = useMemo(
    () =>
      filter === "semua"
        ? promoCatalog.filter((p) => p.aktif)
        : promoCatalog.filter((p) => p.aktif && p.kategori === filter),
    [filter],
  );

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    toast.success(`Kode ${code} disalin ke clipboard!`);
    setTimeout(() => setCopiedId(null), 3000);
  };

  const colorMap: Record<string, string> = {
    diskon: "from-brand-primary to-brand-primary-dark",
    member: "from-[#F59E0B] to-[#D97706]",
    bundle: "from-blue-500 to-blue-700",
  };

  return (
    <main className="min-h-screen bg-surface-base pb-24 pt-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-10 mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-primary-light/50 px-3 py-1 text-xs font-bold text-brand-primary-dark">
            <Sparkles className="size-3" /> Promosi Spesial
          </div>
          <h1 className="mb-4 font-display text-4xl font-extrabold tracking-tight text-neutral-900">
            Lebih Hemat, Kamar Makin <span className="text-brand-primary">Nyaman</span>
          </h1>
          <p className="text-neutral-500">
            Dapatkan berbagai penawaran menarik dan diskon eksklusif untuk perawatan kamar kos kamu.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8 flex items-center gap-2 overflow-x-auto hide-scrollbar">
          <Filter className="size-4 shrink-0 text-neutral-400" />
          {(["semua", "diskon", "member", "bundle"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`shrink-0 rounded-lg px-4 py-2 text-xs font-bold transition ${
                filter === tab
                  ? "bg-brand-primary text-white"
                  : "border border-neutral-200 bg-white text-neutral-600 hover:border-brand-primary/30"
              }`}
            >
              {tab === "semua"
                ? "Semua Promo"
                : tab === "diskon"
                  ? "Diskon"
                  : tab === "member"
                    ? "Member"
                    : "Bundling"}
            </button>
          ))}
        </div>

        {/* Promo Grid */}
        <div className="grid gap-6">
          {filtered.length > 0 ? (
            filtered.map((promo) => (
              <div
                key={promo.id}
                className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm transition-all duration-300 hover:border-brand-primary/30 md:flex"
              >
                {/* Ticket stub */}
                <div
                  className={`relative flex flex-none flex-col justify-center border-b border-dashed border-neutral-100 p-6 md:w-[280px] md:border-b-0 md:border-r bg-gradient-to-br ${
                    colorMap[promo.kategori] || colorMap.diskon
                  }`}
                >
                  <div className="absolute right-0 top-0 p-4 opacity-20">
                    <Ticket className="size-24 text-white" strokeWidth={1} />
                  </div>
                  <p className="z-10 mb-1 text-[10px] font-bold uppercase tracking-wider text-white/80">
                    Potongan Harga
                  </p>
                  <p className="z-10 mb-2 font-display text-6xl font-extrabold text-white">
                    {promo.tipe === "persen" ? `${promo.nilai}%` : `${(promo.nilai / 1000).toFixed(0)}rb`}
                  </p>
                  <div className="z-10 inline-block rounded-lg bg-white/20 p-2 backdrop-blur-sm">
                    <CountdownBadge date={promo.berlakuSampai} />
                  </div>

                  {/* Punch holes */}
                  <div className="absolute -right-3 -top-3 hidden size-6 rounded-full bg-surface-base md:block" />
                  <div className="absolute -bottom-3 -right-3 hidden size-6 rounded-full bg-surface-base md:block" />
                </div>

                {/* Content */}
                <div className="relative flex flex-1 flex-col justify-between bg-white p-6 md:p-8">
                  <div>
                    <div className="mb-3 flex items-start justify-between gap-4">
                      <h2 className="font-display text-xl font-bold text-neutral-900">
                        {promo.nama}
                      </h2>
                      <span className="shrink-0 rounded bg-neutral-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                        {promo.kategori}
                      </span>
                    </div>
                    <p className="mb-6 text-sm text-neutral-500">{promo.deskripsi}</p>

                    <div className="mb-6 flex flex-wrap gap-3">
                      <div className="flex items-center gap-1.5 rounded-lg bg-neutral-50 px-3 py-1.5 text-xs text-neutral-600">
                        <AlertCircle className="size-3.5 text-neutral-400" />
                        Min. Transaksi{" "}
                        <span className="font-bold text-neutral-900">
                        Rp {promo.minTransaksi?.toLocaleString("id-ID") ?? "0"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 rounded-lg bg-neutral-50 px-3 py-1.5 text-xs text-neutral-600">
                        <Tag className="size-3.5 text-neutral-400" />
                        Berlaku s/d{" "}
                        <span className="font-bold text-neutral-900">
                          {new Date(promo.berlakuSampai).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Code + Copy */}
                  <div className="flex items-center gap-3 border-t border-neutral-100 pt-5">
                    <div className="flex flex-1 items-center justify-between rounded-xl border border-dashed border-neutral-200 bg-neutral-100 px-4 py-3">
                      <span className="font-mono font-bold tracking-wider text-neutral-800">
                        {promo.kode}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(promo.kode, promo.id)}
                      className={`flex h-[46px] items-center gap-2 rounded-xl px-6 text-sm font-bold transition-all btn-press ${
                        copiedId === promo.id
                          ? "bg-neutral-800 text-white"
                          : "bg-brand-primary text-white shadow-sm hover:bg-brand-primary-dark"
                      }`}
                    >
                      {copiedId === promo.id ? (
                        <>
                          <CheckCircle2 className="size-4" /> Disalin
                        </>
                      ) : (
                        <>
                          <Copy className="size-4" /> Salin
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-10 text-center">
              <Tag className="mx-auto mb-4 size-10 text-neutral-400" />
              <h3 className="text-lg font-bold text-neutral-900">Belum ada promo</h3>
              <p className="mt-1 text-sm text-neutral-500">
                Tidak ada promo aktif untuk kategori ini.
              </p>
            </div>
          )}
        </div>

        {/* Terms */}
        <div className="mx-auto mt-12 max-w-xl text-center text-xs text-neutral-400">
          <p>
            *Syarat dan ketentuan berlaku. Dorm Care berhak membatalkan promo jika mendapati
            indikasi kecurangan. Promo tidak dapat digabungkan kecuali disebutkan sebaliknya.
          </p>
        </div>
      </div>
    </main>
  );
}
