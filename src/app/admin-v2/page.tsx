"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search, Upload, CheckCircle2, XCircle, Eye, ImageIcon,
  Filter, ArrowUpDown, Download, LogOut, Shield,
} from "lucide-react";
import toast from "react-hot-toast";
import { formatRupiah } from "@/lib/utils";

type Order = {
  id: string;
  order_number: string;
  user_id: string;
  service_name: string;
  total_amount: number;
  status: string;
  scheduled_date: string;
  scheduled_time: string;
  created_at: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  proof_url?: string;
  transaction_status?: string;
};

export default function AdminV2Page() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("semua");
  const [sortBy, setSortBy] = useState<"date" | "amount" | "status">("date");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewProof, setPreviewProof] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Auth
  useEffect(() => {
    if (sessionStorage.getItem("admin_v2_auth") === "true") {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "dorm-care-admin") {
      sessionStorage.setItem("admin_v2_auth", "true");
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Username atau password salah!");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_v2_auth");
    setIsAuthenticated(false);
  };

  // Fetch orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/data");
      if (!res.ok) throw new Error("Gagal fetch");
      const { orders: allOrders, users } = await res.json();

      // Fetch transactions
      const txRes = await fetch("/api/admin/transactions");
      let transactions: any[] = [];
      if (txRes.ok) {
        const txData = await txRes.json();
        transactions = txData.transactions || [];
      }

      const txByOrder: Record<string, any> = {};
      for (const tx of transactions) {
        txByOrder[tx.order_id] = tx;
      }

      const userById: Record<string, any> = {};
      for (const u of users || []) {
        userById[u.id] = u;
      }

      const enriched = (allOrders || []).map((o: any) => {
        const user = userById[o.user_id] || {};
        const tx = txByOrder[o.id];
        return {
          id: o.id,
          order_number: o.order_number,
          user_id: o.user_id,
          service_name: o.service_name,
          total_amount: o.total_amount,
          status: o.status,
          scheduled_date: o.scheduled_date,
          scheduled_time: o.scheduled_time,
          created_at: o.created_at,
          customer_name: `${user.first_name || ""} ${user.last_name || ""}`.trim() || "-",
          customer_email: user.email || "-",
          customer_phone: user.phone || "-",
          proof_url: tx?.proof_url || null,
          transaction_status: tx?.status || null,
        };
      });

      setOrders(enriched);
    } catch (err) {
      toast.error("Gagal mengambil data pesanan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchOrders();
  }, [isAuthenticated]);

  // Upload proof for selected order
  const handleUploadProof = async () => {
    if (!selectedOrder || !fileRef.current?.files?.[0]) {
      toast.error("Pilih file gambar terlebih dahulu");
      return;
    }

    const file = fileRef.current.files[0];
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 5MB");
      return;
    }

    setUploading(true);
    try {
      // Convert to base64 data URI for storage
      const reader = new FileReader();
      const dataUri = await new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      const res = await fetch("/api/admin/upload-proof", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          orderNumber: selectedOrder.order_number,
          dataUri,
          fileExt: file.name.split(".").pop() || "jpg",
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Upload gagal");
      }

      const result = await res.json();
      toast.success("Bukti pembayaran berhasil diupload!");

      // Update local state
      setOrders((prev) =>
        prev.map((o) =>
          o.id === selectedOrder.id
            ? { ...o, proof_url: result.proofUrl, transaction_status: "verified" }
            : o
        )
      );

      setSelectedOrder((prev) =>
        prev ? { ...prev, proof_url: result.proofUrl, transaction_status: "verified" } : null
      );

      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload gagal");
    } finally {
      setUploading(false);
    }
  };

  // Filter & sort
  const filteredOrders = orders
    .filter((o) => {
      const q = search.toLowerCase();
      const matchSearch =
        o.order_number.toLowerCase().includes(q) ||
        (o.customer_name || "").toLowerCase().includes(q) ||
        o.service_name.toLowerCase().includes(q);
      const matchStatus = statusFilter === "semua" || o.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === "date") return b.created_at.localeCompare(a.created_at);
      if (sortBy === "amount") return b.total_amount - a.total_amount;
      return a.status.localeCompare(b.status);
    });

  const stats = {
    total: orders.length,
    withProof: orders.filter((o) => o.proof_url).length,
    withoutProof: orders.filter((o) => !o.proof_url && o.status !== "cancelled").length,
    completed: orders.filter((o) => o.status === "completed").length,
  };

  // Auth screen
  if (isAuthenticated === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-50">
        <div className="size-8 animate-spin rounded-full border-4 border-brand-primary border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-neutral-50 px-4">
        <div className="w-full max-w-sm rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="grid size-14 place-content-center rounded-2xl bg-brand-primary text-white mb-3">
              <Shield className="size-7" />
            </div>
            <p className="text-lg font-black text-neutral-900">Admin Panel v2</p>
            <p className="mt-1 text-sm text-neutral-500">Manajemen Bukti Pembayaran</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            {authError && (
              <div className="rounded-xl bg-red-50 p-3 text-center text-sm font-semibold text-red-600">
                {authError}
              </div>
            )}
            <input
              type="text" value={username} placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              className="h-11 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none focus:border-brand-primary"
              required
            />
            <input
              type="password" value={password} placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none focus:border-brand-primary"
              required
            />
            <button type="submit" className="w-full rounded-xl bg-brand-primary py-3 text-sm font-bold text-white hover:bg-brand-primary-dark">
              Masuk
            </button>
          </form>
          <div className="mt-6 text-center space-y-2">
            <Link href="/admin" className="text-xs font-semibold text-neutral-500 hover:text-brand-primary block">
              Admin v1
            </Link>
            <Link href="/" className="text-xs text-neutral-400 hover:text-brand-primary block">
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Main admin v2
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-black text-neutral-900">Admin Panel v2</h1>
            <p className="text-xs text-neutral-500 mt-0.5">Manajemen Bukti Pembayaran Pesanan</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin" className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-50">
              Admin v1
            </Link>
            <button onClick={handleLogout} className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100">
              <LogOut className="size-3" /> Keluar
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8 space-y-6">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-4">
          {[
            { label: "Total Pesanan", value: stats.total, color: "text-neutral-900" },
            { label: "Ada Bukti Bayar", value: stats.withProof, color: "text-green-600" },
            { label: "Belum Ada Bukti", value: stats.withoutProof, color: "text-orange-600" },
            { label: "Selesai", value: stats.completed, color: "text-blue-600" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-neutral-200 bg-white p-5">
              <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-sm text-neutral-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
              <input
                type="text" value={search} placeholder="Cari nomor pesanan, pelanggan, layanan..."
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 w-full rounded-xl border border-neutral-200 pl-9 pr-3 text-sm outline-none focus:border-brand-primary"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-xl border border-neutral-200 px-3 text-sm outline-none"
            >
              <option value="semua">Semua Status</option>
              <option value="completed">Selesai</option>
              <option value="cancelled">Dibatalkan</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-10 rounded-xl border border-neutral-200 px-3 text-sm outline-none"
            >
              <option value="date">Terbaru</option>
              <option value="amount">Nominal</option>
              <option value="status">Status</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="mx-auto size-8 animate-spin rounded-full border-4 border-brand-primary border-t-transparent" />
              <p className="text-sm text-neutral-500 mt-3">Memuat data...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50 text-left">
                    <th className="px-5 py-3 text-xs font-bold text-neutral-500 uppercase">No. Pesanan</th>
                    <th className="px-5 py-3 text-xs font-bold text-neutral-500 uppercase">Pelanggan</th>
                    <th className="px-5 py-3 text-xs font-bold text-neutral-500 uppercase">Kontak</th>
                    <th className="px-5 py-3 text-xs font-bold text-neutral-500 uppercase">Waktu</th>
                    <th className="px-5 py-3 text-xs font-bold text-neutral-500 uppercase">Layanan</th>
                    <th className="px-5 py-3 text-xs font-bold text-neutral-500 uppercase">Total</th>
                    <th className="px-5 py-3 text-xs font-bold text-neutral-500 uppercase">Status</th>
                    <th className="px-5 py-3 text-xs font-bold text-neutral-500 uppercase">Bukti Bayar</th>
                    <th className="px-5 py-3 text-xs font-bold text-neutral-500 uppercase">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-neutral-50/50 transition">
                      <td className="px-5 py-3">
                        <p className="font-bold text-neutral-900">{o.order_number}</p>
                        <p className="text-xs text-neutral-400">{new Date(o.created_at).toLocaleDateString("id-ID")}</p>
                      </td>
                      <td className="px-5 py-3">
                        <p className="font-semibold text-neutral-800">{o.customer_name}</p>
                      </td>
                      <td className="px-5 py-3">
                        <p className="text-xs text-neutral-600">{o.customer_email}</p>
                        <p className="text-xs text-neutral-400">{o.customer_phone}</p>
                      </td>
                      <td className="px-5 py-3">
                        <p className="font-semibold text-neutral-800">
                          {new Date(o.scheduled_date).toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                        </p>
                        <p className="text-xs text-neutral-500">
                          Pukul {o.scheduled_time || "-"} WIB
                        </p>
                      </td>
                      <td className="px-5 py-3">
                        <p className="text-neutral-700">{o.service_name}</p>
                      </td>
                      <td className="px-5 py-3 font-bold text-neutral-900">
                        {formatRupiah(o.total_amount)}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                          o.status === "completed" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                        }`}>
                          {o.status === "completed" ? <CheckCircle2 className="size-3" /> : <XCircle className="size-3" />}
                          {o.status === "completed" ? "Selesai" : "Batal"}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        {o.proof_url ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600">
                            <CheckCircle2 className="size-3" /> Ada
                          </span>
                        ) : o.status === "cancelled" ? (
                          <span className="text-xs text-neutral-400">-</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-orange-500">
                            <XCircle className="size-3" /> Belum
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => {
                            setSelectedOrder(o);
                            setPreviewProof(null);
                          }}
                          className="inline-flex items-center gap-1 rounded-lg bg-brand-primary px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-primary-dark transition"
                        >
                          {o.proof_url ? <Eye className="size-3" /> : <Upload className="size-3" />}
                          {o.proof_url ? "Lihat" : "Upload"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredOrders.length === 0 && (
                <div className="p-12 text-center text-neutral-500 text-sm">
                  Tidak ada pesanan ditemukan.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Proof Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setSelectedOrder(null)}>
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-black text-neutral-900">{selectedOrder.order_number}</h3>
                <p className="text-sm text-neutral-500">{selectedOrder.customer_name} · {selectedOrder.service_name} · {formatRupiah(selectedOrder.total_amount)}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="grid size-8 place-content-center rounded-lg hover:bg-neutral-100">
                <XCircle className="size-5 text-neutral-400" />
              </button>
            </div>

            {/* Upload area */}
            {!selectedOrder.proof_url && !previewProof && (
              <div
                onClick={() => fileRef.current?.click()}
                className="cursor-pointer rounded-2xl border-2 border-dashed border-neutral-300 p-10 text-center hover:border-brand-primary hover:bg-brand-primary-light/5 transition"
              >
                <Upload className="mx-auto size-10 text-neutral-400" />
                <p className="mt-3 text-sm font-bold text-neutral-600">Klik untuk upload bukti pembayaran</p>
                <p className="text-xs text-neutral-400 mt-1">JPG, PNG, atau WebP. Maks 5MB.</p>
              </div>
            )}

            {/* Preview */}
            {(selectedOrder.proof_url || previewProof) && (
              <div className="relative aspect-[3/4] max-h-[400px] rounded-2xl overflow-hidden bg-neutral-100 mb-4">
                <Image
                  src={previewProof || selectedOrder.proof_url!}
                  alt="Bukti Pembayaran"
                  fill
                  className="object-contain"
                />
              </div>
            )}

            {/* File selected for upload */}
            {previewProof && (
              <div className="flex gap-3 mt-4">
                <button onClick={handleUploadProof} disabled={uploading} className="flex-1 rounded-xl bg-brand-primary py-2.5 text-sm font-bold text-white hover:bg-brand-primary-dark disabled:opacity-50">
                  {uploading ? "Mengupload..." : "Konfirmasi Upload"}
                </button>
                <button onClick={() => { setPreviewProof(null); if (fileRef.current) fileRef.current.value = ""; }} className="rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-semibold text-neutral-600 hover:bg-neutral-50">
                  Batal
                </button>
              </div>
            )}

            {/* Show existing proof + replace option */}
            {selectedOrder.proof_url && !previewProof && (
              <div className="space-y-3 mt-4">
                <button
                  onClick={() => fileRef.current?.click()}
                  className="w-full rounded-xl border border-neutral-200 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
                >
                  Ganti Bukti Pembayaran
                </button>
              </div>
            )}

            <input
              ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setPreviewProof(URL.createObjectURL(file));
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
