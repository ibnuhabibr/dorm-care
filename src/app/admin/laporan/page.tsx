"use client";

import dynamic from "next/dynamic";

import { AdminNav } from "@/components/admin-nav";
import { orderCatalog, reportDaily } from "@/data/site-data";
import { formatRupiah } from "@/lib/utils";

const AdminReportCharts = dynamic(() => import("@/components/admin-report-charts"), {
  ssr: false,
  loading: () => (
    <section className="space-y-6">
      <div className="h-64 animate-pulse rounded-3xl border border-neutral-200 bg-neutral-100" />
      <div className="h-64 animate-pulse rounded-3xl border border-neutral-200 bg-neutral-100" />
    </section>
  ),
});

export default function AdminLaporanPage() {
  const totalPendapatan = reportDaily.reduce((sum, item) => sum + item.pendapatan, 0);
  const totalPesanan = reportDaily.reduce((sum, item) => sum + item.pesanan, 0);

  const statusData = [
    { name: "Pending", value: orderCatalog.filter((item) => item.status === "pending").length },
    { name: "Diterima", value: orderCatalog.filter((item) => item.status === "diterima").length },
    { name: "Menuju", value: orderCatalog.filter((item) => item.status === "menuju").length },
    { name: "Dikerjakan", value: orderCatalog.filter((item) => item.status === "dikerjakan").length },
    { name: "Selesai", value: orderCatalog.filter((item) => item.status === "selesai").length },
    { name: "Dibatalkan", value: orderCatalog.filter((item) => item.status === "dibatalkan").length },
  ];

  const handleExport = () => {
    const headers = ["hari", "pesanan", "pendapatan"];
    const rows = reportDaily.map((item) => [item.hari, String(item.pesanan), String(item.pendapatan)]);
    const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "laporan-dorm-care.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-20 pt-10">
      <section className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="section-label">Admin Dorm Care</p>
            <h1 className="h2-title mt-2 text-neutral-900">Laporan Operasional</h1>
            <p className="mt-2 text-neutral-600">Analisis performa pesanan dan pendapatan mingguan.</p>
          </div>
          <button
            type="button"
            onClick={handleExport}
            className="rounded-xl bg-brand-primary px-4 py-2 text-sm font-bold text-white hover:bg-brand-primary-dark"
          >
            Export CSV
          </button>
        </div>
      </section>

      <AdminNav />

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-neutral-200 bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-neutral-500">Total Pendapatan</p>
          <p className="mt-2 text-3xl font-black text-neutral-900">{formatRupiah(totalPendapatan)}</p>
        </article>
        <article className="rounded-2xl border border-neutral-200 bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-neutral-500">Total Pesanan</p>
          <p className="mt-2 text-3xl font-black text-neutral-900">{totalPesanan}</p>
        </article>
      </section>

      <AdminReportCharts reportDaily={reportDaily} statusData={statusData} />
    </div>
  );
}
