"use client";

import { useState } from "react";
import { Search, Filter, CheckCircle2, Clock, XCircle, MoreHorizontal } from "lucide-react";

const allOrders = [
  { id: "ORD-001", customer: "Budi Santoso", service: "Deep Cleaning + AC", status: "AKTIF", date: "14 Apr 2026", time: "10:00 WIB", amount: "Rp 125.000", payment: "Lunas (QRIS)", mitra: "Agus S." },
  { id: "ORD-002", customer: "Siti Rahma", service: "Cuci AC Standar", status: "SELESAI", date: "14 Apr 2026", time: "13:00 WIB", amount: "Rp 75.000", payment: "Lunas (GoPay)", mitra: "Hendra W." },
  { id: "ORD-003", customer: "Andi Wijaya", service: "Setrika Bulanan", status: "DIBATALKAN", date: "13 Apr 2026", time: "09:00 WIB", amount: "Rp 150.000", payment: "Refunded", mitra: "-" },
  { id: "ORD-004", customer: "Rina Kumala", service: "Daily Cleaning", status: "AKTIF", date: "15 Apr 2026", time: "08:00 WIB", amount: "Rp 50.000", payment: "Belum Lunas (Tunai)", mitra: "Belum Ditentukan" },
  { id: "ORD-005", customer: "Habib", service: "Deep Cleaning", status: "SELESAI", date: "10 Apr 2026", time: "14:00 WIB", amount: "Rp 120.000", payment: "Lunas (OVO)", mitra: "Joko A." },
];

export default function AdminPesananPage() {
  const [filter, setFilter] = useState("SEMUA");
  const [search, setSearch] = useState("");

  const filteredOrders = allOrders.filter(o => 
    (filter === "SEMUA" || o.status === filter) &&
    (o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase()))
  );

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "AKTIF": return <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-600 border border-blue-100"><Clock className="size-3" /> Mengantri</span>;
      case "SELESAI": return <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary-light/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-primary border border-brand-primary-light/20"><CheckCircle2 className="size-3" /> Selesai</span>;
      case "DIBATALKAN": return <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-error border border-red-100"><XCircle className="size-3" /> Dibatalkan</span>;
      default: return null;
    }
  };

  return (
    <div className="pb-24 pt-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-neutral-900 mb-1">Manajemen Pesanan</h1>
          <p className="text-neutral-500 text-sm">Kelola jadwal, assign mitra, dan pantau status layanan terkini.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 size-4" />
            <input 
              type="text" 
              placeholder="Cari ID / Nama..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64 rounded-xl border border-neutral-200 bg-white py-2 pl-9 pr-4 text-sm outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
            />
          </div>
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-xl border border-neutral-200 bg-white py-2 px-4 text-sm font-bold text-neutral-700 outline-none transition hover:bg-neutral-50"
          >
            <option value="SEMUA">Semua Status</option>
            <option value="AKTIF">Aktif / Mengantri</option>
            <option value="SELESAI">Selesai</option>
            <option value="DIBATALKAN">Dibatalkan</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr>
                <th className="bg-neutral-50 border-b border-neutral-200 p-4 font-bold text-neutral-500 text-xs uppercase tracking-wider">Detail Pesanan</th>
                <th className="bg-neutral-50 border-b border-neutral-200 p-4 font-bold text-neutral-500 text-xs uppercase tracking-wider">Layanan & Mitra</th>
                <th className="bg-neutral-50 border-b border-neutral-200 p-4 font-bold text-neutral-500 text-xs uppercase tracking-wider">Jadwal</th>
                <th className="bg-neutral-50 border-b border-neutral-200 p-4 font-bold text-neutral-500 text-xs uppercase tracking-wider">Status & Pembayaran</th>
                <th className="bg-neutral-50 border-b border-neutral-200 p-4 font-bold text-neutral-500 text-xs uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredOrders.map((order, idx) => (
                <tr key={idx} className="hover:bg-neutral-50 transition">
                  <td className="p-4">
                    <p className="font-mono text-xs font-bold text-brand-primary mb-1">{order.id}</p>
                    <p className="font-bold text-neutral-900">{order.customer}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-medium text-neutral-900 mb-1">{order.service}</p>
                    <p className="text-xs text-neutral-500">Mitra: <span className="font-bold text-neutral-700">{order.mitra}</span></p>
                  </td>
                  <td className="p-4">
                    <p className="font-medium text-neutral-900 mb-1">{order.date}</p>
                    <p className="text-xs text-neutral-500">{order.time}</p>
                  </td>
                  <td className="p-4">
                    <div className="mb-2">{getStatusBadge(order.status)}</div>
                    <p className="text-[11px] font-medium text-neutral-500">{order.payment}</p>
                  </td>
                  <td className="p-4 text-right">
                    <button className="p-2 text-neutral-400 hover:text-brand-primary transition rounded-lg hover:bg-brand-primary-light/10">
                      <MoreHorizontal className="size-5" />
                    </button>
                  </td>
                </tr>
              ))}
              
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-neutral-500">
                    Tidak ada pesanan yang sesuai dengan filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
