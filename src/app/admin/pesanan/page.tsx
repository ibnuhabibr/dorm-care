"use client";

import { useMemo, useState, useEffect } from "react";
import { Search, CheckCircle2, Clock, XCircle, Phone, ChevronDown, CheckCheck, Truck, Play, Ban, Receipt, X, ExternalLink, FileText } from "lucide-react";
import toast from "react-hot-toast";

import { AdminNav } from "@/components/admin-nav";
import { type OrderItem } from "@/data/site-data";
import { formatRupiah } from "@/lib/utils";
import Link from "next/link";

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

const bulkActions: Array<{ targetStatus: OrderItem["status"]; label: string; icon: React.ReactNode; class: string }> = [
  { targetStatus: "diterima", label: "Terima", icon: <CheckCheck className="size-3.5" />, class: "bg-blue-500 hover:bg-blue-600 text-white" },
  { targetStatus: "menuju", label: "Menuju Lokasi", icon: <Truck className="size-3.5" />, class: "bg-orange-500 hover:bg-orange-600 text-white" },
  { targetStatus: "dikerjakan", label: "Kerjakan", icon: <Play className="size-3.5" />, class: "bg-brand-primary hover:bg-brand-primary-dark text-white" },
  { targetStatus: "selesai", label: "Selesai", icon: <CheckCircle2 className="size-3.5" />, class: "bg-green-500 hover:bg-green-600 text-white" },
  { targetStatus: "dibatalkan", label: "Batalkan", icon: <Ban className="size-3.5" />, class: "bg-red-500 hover:bg-red-600 text-white" },
];

import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function AdminPesananPage() {
  const [orders, setOrders] = useState<(OrderItem & { dbId?: string; userId?: string; proofUrl?: string; paymentMethodName?: string })[]>([]);
  const [filter, setFilter] = useState<StatusKey>("semua");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [proofModal, setProofModal] = useState<{ url: string; orderId: string; userName: string } | null>(null);

  // Status mapping
  const dbToAppStatus = (dbStatus: string): OrderItem["status"] => {
    const map: Record<string, OrderItem["status"]> = {
      'pending_confirmation': 'pending',
      'confirmed': 'diterima',
      'on_the_way': 'menuju',
      'in_progress': 'dikerjakan',
      'completed': 'selesai',
      'cancelled': 'dibatalkan'
    };
    return map[dbStatus] || 'pending';
  };

  const appToDbStatus = (appStatus: OrderItem["status"]): string => {
    const map: Record<string, string> = {
      'pending': 'pending_confirmation',
      'diterima': 'confirmed',
      'menuju': 'on_the_way',
      'dikerjakan': 'in_progress',
      'selesai': 'completed',
      'dibatalkan': 'cancelled'
    };
    return map[appStatus] || 'pending_confirmation';
  };

  const fetchOrders = async () => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    setIsLoading(true);

    // Fetch orders with profiles
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        profiles (
          first_name,
          last_name,
          phone
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error("Gagal mengambil pesanan: " + error.message);
      setIsLoading(false);
      return;
    }

    // Fetch all transactions for proof URLs
    let transactionMap: Record<string, { proof_url?: string; payment_method?: string; bank_name?: string }> = {};
    if (data && data.length > 0) {
      const orderIds = data.map((d: any) => d.id);
      const { data: txData } = await supabase
        .from('transactions')
        .select('order_id, proof_url, payment_method, bank_name')
        .in('order_id', orderIds);

      if (txData) {
        for (const tx of txData) {
          transactionMap[tx.order_id] = {
            proof_url: tx.proof_url,
            payment_method: tx.payment_method,
            bank_name: tx.bank_name,
          };
        }
      }
    }

    if (data) {
      const mappedOrders = data.map((d: any) => {
        const tx = transactionMap[d.id];
        return {
          id: d.order_number,
          orderId: d.order_number,
          dbId: d.id,
          userId: d.user_id,
          namaUser: d.profiles ? `${d.profiles.first_name} ${d.profiles.last_name || ''}`.trim() : "Unknown",
          noHp: d.profiles?.phone || d.mitra_phone || "-",
          layananId: d.service_id,
          layananNama: d.service_name,
          total: d.total_amount,
          tanggal: new Date(`${d.scheduled_date}T${d.scheduled_time}`).toLocaleString('id-ID', {day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'}),
          alamat: d.address,
          status: dbToAppStatus(d.status),
          metodePembayaran: "qris" as const,
          mitra: d.mitra_name || "Mencari Mitra...",
          catatan: d.notes || "",
          timeline: [],
          proofUrl: tx?.proof_url,
          paymentMethodName: tx?.bank_name || tx?.payment_method,
        };
      });
      setOrders(mappedOrders);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    void fetchOrders();
  }, []);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchStatus = filter === "semua" || o.status === filter;
      const keyword = search.toLowerCase();
      const matchSearch =
        o.id.toLowerCase().includes(keyword) ||
        o.layananNama.toLowerCase().includes(keyword) ||
        o.namaUser.toLowerCase().includes(keyword);
      return matchStatus && matchSearch;
    });
  }, [orders, filter, search]);

  const summary = useMemo(() => ({
    total: orders.length,
    aktif: orders.filter((o) => !["selesai", "dibatalkan"].includes(o.status)).length,
    selesai: orders.filter((o) => o.status === "selesai").length,
    batal: orders.filter((o) => o.status === "dibatalkan").length,
  }), [orders]);

  const updateOrderStatus = async (dbId: string, newAppStatus: OrderItem["status"]) => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return false;

    const { error } = await supabase
      .from('orders')
      .update({ status: appToDbStatus(newAppStatus) })
      .eq('id', dbId);

    if (error) {
      toast.error("Gagal update status: " + error.message);
      return false;
    }
    return true;
  };

  const advanceStatus = async (id: string, dbId?: string) => {
    const order = orders.find(o => o.id === id);
    if (!order) return;
    
    const next = nextStatus[order.status];
    if (!next) {
      toast.error("Status sudah final.");
      return;
    }

    if (dbId) {
      const success = await updateOrderStatus(dbId, next);
      if (!success) return;
    }

    toast.success(`Status ${id} diubah ke ${next}.`);
    setOrders((prev) =>
      prev.map((o) => o.id === id ? { ...o, status: next } : o)
    );
  };

  const cancelOrder = async (id: string, dbId?: string) => {
    const order = orders.find(o => o.id === id);
    if (!order) return;

    if (order.status === "selesai" || order.status === "dibatalkan") {
      toast.error("Status sudah final.");
      return;
    }

    if (dbId) {
      const success = await updateOrderStatus(dbId, "dibatalkan");
      if (!success) return;
    }

    toast.success(`Pesanan ${id} dibatalkan.`);
    setOrders((prev) =>
      prev.map((o) => o.id === id ? { ...o, status: "dibatalkan" as OrderItem["status"] } : o)
    );
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const bulkSetStatus = async (targetStatus: OrderItem["status"]) => {
    if (selectedIds.length === 0) return toast.error("Pilih pesanan terlebih dahulu.");

    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    const actionLabel = bulkActions.find(a => a.targetStatus === targetStatus)?.label || targetStatus;
    const loading = toast.loading(`Memproses ${selectedIds.length} pesanan...`);

    let count = 0;
    const dbIds: string[] = [];

    for (const id of selectedIds) {
      const order = orders.find(o => o.id === id);
      if (!order || !order.dbId) continue;

      const { error } = await supabase
        .from('orders')
        .update({ status: appToDbStatus(targetStatus) })
        .eq('id', order.dbId);

      if (!error) {
        count++;
        dbIds.push(order.dbId);
      }
    }

    toast.dismiss(loading);

    if (count > 0) {
      setOrders((prev) =>
        prev.map((o) => dbIds.includes(o.dbId!) ? { ...o, status: targetStatus } : o)
      );
      toast.success(`${count} pesanan → "${actionLabel}"`);
      setSelectedIds([]);
    } else {
      toast.error("Gagal memperbarui status.");
    }
  };

  const bulkAdvance = async () => {
    if (selectedIds.length === 0) return toast.error("Pilih pesanan terlebih dahulu.");

    let count = 0;
    for (const id of selectedIds) {
      const order = orders.find(o => o.id === id);
      if (!order) continue;

      const next = nextStatus[order.status];
      if (!next) continue;

      if (order.dbId) {
        await updateOrderStatus(order.dbId, next);
      }
      count++;
    }

    await fetchOrders();
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
      <section className="rounded-2xl border border-neutral-200 bg-white p-4 space-y-4">
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
            disabled={selectedIds.length === 0}
            className="h-10 rounded-xl bg-brand-primary px-4 text-sm font-bold text-white hover:bg-brand-primary-dark transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Majukan ({selectedIds.length})
          </button>
        </div>

        {/* Bulk Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider mr-1">
            Bulk Set Status:
          </span>
          {bulkActions.map((action) => (
            <button
              key={action.targetStatus}
              type="button"
              disabled={selectedIds.length === 0}
              onClick={() => bulkSetStatus(action.targetStatus)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition disabled:opacity-30 disabled:cursor-not-allowed ${action.class}`}
            >
              {action.icon}
              {action.label}
            </button>
          ))}
          {selectedIds.length > 0 && (
            <span className="text-xs text-neutral-500 ml-2">
              {selectedIds.length} pesanan dipilih
            </span>
          )}
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
                        <p className="font-bold text-neutral-900 mt-0.5">{order.namaUser}</p>
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-neutral-900">{order.layananNama}</p>
                        {order.mitra && (
                          <p className="text-xs text-neutral-500 mt-0.5">Mitra: <span className="font-semibold">{order.mitra}</span></p>
                        )}
                      </td>
                      <td className="p-4">
                        <p className="text-neutral-900">{order.tanggal}</p>
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
                              onClick={() => advanceStatus(order.id, order.dbId)}
                              className="inline-flex items-center gap-1 rounded-lg bg-brand-primary px-2.5 py-1.5 text-[11px] font-bold text-white hover:bg-brand-primary-dark transition"
                            >
                              <ChevronDown className="size-3 -rotate-90" />
                              {nextStatus[order.status]}
                            </button>
                          )}
                          {order.status !== "selesai" && order.status !== "dibatalkan" && (
                            <button
                              type="button"
                              onClick={() => cancelOrder(order.id, order.dbId)}
                              className="rounded-lg border border-red-200 p-1.5 text-red-500 hover:bg-red-50 transition"
                              title="Batalkan"
                            >
                              <XCircle className="size-3.5" />
                            </button>
                          )}
                          {order.proofUrl && (
                            <button
                              type="button"
                              onClick={() => setProofModal({ url: order.proofUrl!, orderId: order.id, userName: order.namaUser })}
                              className="rounded-lg border border-blue-200 bg-blue-50 p-1.5 text-blue-600 hover:bg-blue-100 transition"
                              title="Lihat Bukti Pembayaran"
                            >
                              <Receipt className="size-3.5" />
                            </button>
                          )}
                          <Link
                            href={`/admin/pesanan/${order.id}`}
                            className="rounded-lg border border-neutral-200 p-1.5 text-neutral-500 hover:bg-neutral-100 transition"
                            title="Detail Pesanan"
                          >
                            <FileText className="size-3.5" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => toast.success(`Membuka WhatsApp ${order.namaUser}...`)}
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

      {/* Payment Proof Modal */}
      {proofModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setProofModal(null)}
        >
          <div
            className="relative bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div>
                <h3 className="font-bold text-neutral-900">Bukti Pembayaran</h3>
                <p className="text-xs text-neutral-500">
                  {proofModal.orderId} — {proofModal.userName}
                </p>
              </div>
              <button
                onClick={() => setProofModal(null)}
                className="p-2 rounded-lg hover:bg-neutral-100 transition"
              >
                <X className="size-5 text-neutral-500" />
              </button>
            </div>
            <div className="p-6">
              <div className="rounded-xl overflow-hidden border border-neutral-200">
                <img
                  src={proofModal.url}
                  alt="Bukti Pembayaran"
                  className="w-full h-auto object-contain max-h-[60vh]"
                />
              </div>
              <div className="mt-4 flex items-center justify-end gap-2">
                <a
                  href={proofModal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition"
                >
                  <ExternalLink className="size-3.5" />
                  Buka di Tab Baru
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
