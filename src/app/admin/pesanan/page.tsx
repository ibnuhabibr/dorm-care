"use client";

import { useMemo, useState } from "react";
import { Search, CheckCircle2, Clock, XCircle, Phone, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

import { AdminNav } from "@/components/admin-nav";
import { orderCatalog, type OrderItem } from "@/data/site-data";
import { formatRupiah } from "@/lib/utils";

type StatusKey = "semua" | OrderItem["status"];

const statusOptions: Array<{ key: StatusKey; label: string }> = [
  { key: "semua", label: "Semua Status" },
  { key: "pending", label: "Pending" },
  { key: "diterima", label: "Diterima" },
  { key: "menuju", label: "Menuju Lokasi" },
  { key: "dikerjakan", label: "Dikerjakan" },
  { key: "selesai", label: "Selesai" },
  { key: "dibatalkan", label: "Dibatalkan" },
];

const statusBadge: Record<OrderItem["status"], { class: string; label: string }> = {
  pending: { class: "bg-yellow-50 text-yellow-700 border-yellow-200", label: "Pending" },
  diterima: { class: "bg-blue-50 text-blue-700 border-blue-200", label: "Diterima" },
  menuju: { class: "bg-orange-50 text-orange-700 border-orange-200", label: "Menuju" },
  dikerjakan: { class: "bg-brand-primary-light text-brand-primary-dark border-brand-primary/20", label: "Dikerjakan" },
  selesai: { class: "bg-neutral-100 text-neutral-600 border-neutral-200", label: "Selesai" },
  dibatalkan: { class: "bg-red-50 text-red-600 border-red-200", label: "Dibatalkan" },
};

const nextStatus: Partial<Record<OrderItem["status"], OrderItem["status"]>> = {
  pending: "diterima",
  diterima: "menuju",
  menuju: "dikerjakan",
  dikerjakan: "selesai",
};

export default function AdminPesananPage() {
  const [orders, setOrders] = useState(orderCatalog);
  const [filter, setFilter] = useState<StatusKey>("semua");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchStatus = filter === "semua" || o.status === filter;
      const keyword = search.toLowerCase();
      const matchSearch =
        o.id.toLowerCase().includes(keyword) ||
        o.layanan.toLowerCase().includes(keyword) ||
        o.pelanggan.toLowerCase().includes(keyword);
      return matchStatus && matchSearch;
    });
  }, [orders, filter, search]);

  const summary = useMemo(() => ({
    total: orders.length,
    aktif: orders.filter((o) => !["selesai", "dibatalkan"].includes(o.status)).length,
    selesai: orders.filter((o) => o.status === "selesai").length,
    batal: orders.filter((o) => o.status === "dibatalkan").length,
  }), [orders]);

  const advanceStatus = (id: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        const next = nextStatus[o.status];
        if (!next) {
          toast.error("Status sudah final.");
          return o;
        }
        toast.success(`Status ${o.id} diubah ke ${next}.`);
        return { ...o, status: next };
      }),
    );
  };

  const cancelOrder = (id: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        if (o.status === "selesai" || o.status === "dibatalkan") {
          toast.error("Status sudah final.");
          return o;
        }
        toast.success(`Pesanan ${o.id} dibatalkan.`);
        return { ...o, status: "dibatalkan" as OrderItem["status"] };
      }),
    );
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const bulkAdvance = () => {
    if (selectedIds.length === 0) return toast.error("Pilih pesanan terlebih dahulu.");
    let count = 0;
    setOrders((prev) =>
      prev.map((o) => {
        if (!selectedIds.includes(o.id)) return o;
        const next = nextStatus[o.status];
        if (!next) return o;
        count++;
        return { ...o, status: next };
      }),
    );
    toast.success(`${count} pesanan berhasil dimajukan statusnya.`);
    setSelectedIds([]);
  };

  return (
    <div className="space-y-6 pb-20 pt-10">
      <section className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8">
        <p className="section-label">Admin Dorm Care</p>
        <h1 className="h2-title mt-2 text-neutral-900">Manajemen Pesanan</h1>
        <p className="mt-2 text-neutral-600">Kelola jadwal, assign mitra, dan pantau status layanan.</p>
      </section>

      <AdminNav />

      {/* Stats */}
      <section className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Total Pesanan", value: summary.total },
          { label: "Pesanan Aktif", value: summary.aktif },
          { label: "Selesai", value: summary.selesai },
          { label: "Dibatalkan", value: summary.batal },
        ].map((s) => (
          <article key={s.label} className="rounded-2xl border border-neutral-200 bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-neutral-500">{s.label}</p>
            <p className="mt-2 text-3xl font-black text-neutral-900">{s.value}</p>
          </article>
        ))}
      </section>

      {/* Toolbar */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-4">
        <div className="flex flex-wrap items-center gap-3">
          <label className="relative flex-1 min-w-[200px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari ID, pelanggan, atau layanan..."
              className="h-10 w-full rounded-xl border border-neutral-200 pl-9 pr-3 text-sm outline-none ring-brand-primary/30 focus:ring"
            />
          </label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as StatusKey)}
            className="h-10 rounded-xl border border-neutral-200 px-3 text-sm font-semibold outline-none"
          >
            {statusOptions.map((s) => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={bulkAdvance}
            className="h-10 rounded-xl bg-brand-primary px-4 text-sm font-bold text-white hover:bg-brand-primary-dark transition"
          >
            Majukan status ({selectedIds.length})
          </button>
        </div>
      </section>

      {/* Orders Table */}
      <section className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr>
                <th className="bg-neutral-50 border-b border-neutral-200 p-4 w-10">
                  <input
                    type="checkbox"
                    checked={filtered.length > 0 && filtered.every((o) => selectedIds.includes(o.id))}
                    onChange={() => {
                      const ids = filtered.map((o) => o.id);
                      const allSelected = ids.every((id) => selectedIds.includes(id));
                      setSelectedIds(allSelected ? [] : ids);
                    }}
                    className="size-4 rounded border-neutral-300 text-brand-primary"
                  />
                </th>
                <th className="bg-neutral-50 border-b border-neutral-200 p-4 font-bold text-neutral-500 text-xs uppercase tracking-wider">Pesanan</th>
                <th className="bg-neutral-50 border-b border-neutral-200 p-4 font-bold text-neutral-500 text-xs uppercase tracking-wider">Layanan</th>
                <th className="bg-neutral-50 border-b border-neutral-200 p-4 font-bold text-neutral-500 text-xs uppercase tracking-wider">Jadwal</th>
                <th className="bg-neutral-50 border-b border-neutral-200 p-4 font-bold text-neutral-500 text-xs uppercase tracking-wider">Status</th>
                <th className="bg-neutral-50 border-b border-neutral-200 p-4 font-bold text-neutral-500 text-xs uppercase tracking-wider text-right">Nominal</th>
                <th className="bg-neutral-50 border-b border-neutral-200 p-4 font-bold text-neutral-500 text-xs uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-neutral-500">
                    Tidak ada pesanan yang sesuai dengan filter.
                  </td>
                </tr>
              ) : (
                filtered.map((order) => {
                  const badge = statusBadge[order.status];
                  const canAdvance = !!nextStatus[order.status];
                  return (
                    <tr key={order.id} className="hover:bg-neutral-50 transition">
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(order.id)}
                          onChange={() => toggleSelect(order.id)}
                          className="size-4 rounded border-neutral-300 text-brand-primary"
                        />
                      </td>
                      <td className="p-4">
                        <p className="font-mono text-xs font-bold text-brand-primary">{order.id}</p>
                        <p className="font-bold text-neutral-900 mt-0.5">{order.pelanggan}</p>
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-neutral-900">{order.layanan}</p>
                        {order.mitra && (
                          <p className="text-xs text-neutral-500 mt-0.5">Mitra: <span className="font-semibold">{order.mitra}</span></p>
                        )}
                      </td>
                      <td className="p-4">
                        <p className="text-neutral-900">{order.tanggal}</p>
                        <p className="text-xs text-neutral-500">{order.waktu}</p>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${badge.class}`}>
                          {order.status === "selesai" && <CheckCircle2 className="size-3" />}
                          {order.status === "dikerjakan" && <Clock className="size-3" />}
                          {order.status === "dibatalkan" && <XCircle className="size-3" />}
                          {badge.label}
                        </span>
                      </td>
                      <td className="p-4 text-right font-extrabold text-neutral-900">
                        {formatRupiah(order.total)}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {canAdvance && (
                            <button
                              type="button"
                              onClick={() => advanceStatus(order.id)}
                              className="inline-flex items-center gap-1 rounded-lg bg-brand-primary px-2.5 py-1.5 text-[11px] font-bold text-white hover:bg-brand-primary-dark transition"
                            >
                              <ChevronDown className="size-3 -rotate-90" />
                              {nextStatus[order.status]}
                            </button>
                          )}
                          {order.status !== "selesai" && order.status !== "dibatalkan" && (
                            <button
                              type="button"
                              onClick={() => cancelOrder(order.id)}
                              className="rounded-lg border border-red-200 p-1.5 text-red-500 hover:bg-red-50 transition"
                              title="Batalkan"
                            >
                              <XCircle className="size-3.5" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => toast.success(`Membuka WhatsApp ${order.pelanggan}...`)}
                            className="rounded-lg border border-green-200 bg-green-50 p-1.5 text-green-600 hover:bg-green-100 transition"
                            title="Hubungi via WA"
                          >
                            <Phone className="size-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
