/* eslint-disable */
const fs = require('fs');
const path = require('path');

const adminDir = path.join(__dirname, 'src', 'app', 'admin');

const pages = [
  {
    path: path.join(adminDir, 'page.tsx'),
    content: `"use client";

import { ShoppingBag, Users, DollarSign, Activity, ChevronRight, CheckCircle2, Clock, XCircle } from "lucide-react";
import Link from "next/link";

// Mock data
const stats = [
  { label: "Total Pesanan", value: "1,248", trend: "+12%", color: "text-blue-600", bg: "bg-blue-50", icon: ShoppingBag },
  { label: "Total Pengguna", value: "3,412", trend: "+5%", color: "text-brand-primary", bg: "bg-brand-primary-light/20", icon: Users },
  { label: "Pendapatan Bulan Ini", value: "Rp 45.2M", trend: "+18%", color: "text-green-600", bg: "bg-green-50", icon: DollarSign },
  { label: "Pesanan Aktif", value: "24", trend: "", color: "text-orange-500", bg: "bg-amber-50", icon: Activity },
];

const recentOrders = [
  { id: "ORD-001", customer: "Budi Santoso", service: "Deep Cleaning", status: "AKTIF", date: "14 Apr 2026", amount: "Rp 125.000" },
  { id: "ORD-002", customer: "Siti Rahma", service: "Cuci AC Standar", status: "SELESAI", date: "14 Apr 2026", amount: "Rp 75.000" },
  { id: "ORD-003", customer: "Andi Wijaya", service: "Setrika Bulanan", status: "DIBATALKAN", date: "13 Apr 2026", amount: "Rp 150.000" },
  { id: "ORD-004", customer: "Rina Kumala", service: "Deep Cleaning", status: "SELESAI", date: "13 Apr 2026", amount: "Rp 125.000" },
];

export default function AdminDashboardPage() {
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "AKTIF": return <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-600 border border-blue-100"><Clock className="size-3" /> Aktif</span>;
      case "SELESAI": return <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary-light/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-primary border border-brand-primary-light/20"><CheckCircle2 className="size-3" /> Selesai</span>;
      case "DIBATALKAN": return <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-error border border-red-100"><XCircle className="size-3" /> Batal</span>;
      default: return null;
    }
  };

  return (
    <div className="pb-24 pt-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-neutral-900 mb-1">Dashboard Admin</h1>
          <p className="text-neutral-500 text-sm">Ringkasan aktivitas dan performa operasional Dorm Care.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm relative overflow-hidden group hover:border-brand-primary/30 transition-colors">
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className={\`w-10 h-10 rounded-xl \${stat.bg} \${stat.color} flex items-center justify-center\`}>
                <stat.icon className="size-5" />
              </div>
              {stat.trend && (
                <span className={\`text-xs font-bold \${stat.trend.startsWith('+') ? 'text-brand-primary' : 'text-error'}\`}>
                  {stat.trend}
                </span>
              )}
            </div>
            
            <div className="relative z-10">
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">{stat.label}</p>
              <p className="font-display text-2xl font-extrabold text-neutral-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-neutral-200 shadow-sm p-6 flex flex-col">
           <div className="flex items-center justify-between mb-6">
             <h2 className="font-display text-lg font-bold text-neutral-900">Pesanan Terbaru</h2>
             <Link href="/admin/pesanan" className="text-xs font-bold text-brand-primary hover:underline flex items-center">
               Kelola Pesanan <ChevronRight className="size-3 ml-1" />
             </Link>
           </div>

           <div className="overflow-x-auto">
             <table className="w-full text-sm text-left">
               <thead>
                 <tr>
                   <th className="bg-neutral-50 border-y border-neutral-200 p-4 font-bold text-neutral-500 rounded-tl-xl text-xs uppercase tracking-wider">ID</th>
                   <th className="bg-neutral-50 border-y border-neutral-200 p-4 font-bold text-neutral-500 text-xs uppercase tracking-wider">Pelanggan</th>
                   <th className="bg-neutral-50 border-y border-neutral-200 p-4 font-bold text-neutral-500 text-xs uppercase tracking-wider">Layanan</th>
                   <th className="bg-neutral-50 border-y border-neutral-200 p-4 font-bold text-neutral-500 text-xs uppercase tracking-wider">Status</th>
                   <th className="bg-neutral-50 border-y border-neutral-200 p-4 font-bold text-neutral-500 rounded-tr-xl text-right text-xs uppercase tracking-wider">Nominal</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-neutral-100">
                 {recentOrders.map((order, idx) => (
                   <tr key={idx} className="hover:bg-neutral-50 transition">
                     <td className="p-4 font-mono text-xs text-neutral-500">{order.id}</td>
                     <td className="p-4 font-bold text-neutral-900">{order.customer}</td>
                     <td className="p-4 text-neutral-600">{order.service}</td>
                     <td className="p-4">{getStatusBadge(order.status)}</td>
                     <td className="p-4 text-right font-extrabold text-neutral-900">{order.amount}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>

        <div className="bg-gradient-to-br from-brand-primary to-brand-primary-dark rounded-3xl border border-brand-primary shadow-brand p-8 text-white flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="relative z-10 text-center">
            <h2 className="font-display text-2xl font-extrabold mb-2">Tarik Laporan</h2>
            <p className="text-white/80 text-sm mb-6">Unduh rekap operasional bulan ini dalam format CSV atau PDF.</p>
            <button className="w-full bg-white text-brand-primary font-bold py-3 rounded-xl hover:bg-neutral-50 transition">
              Cetak Laporan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
`
  },
  {
    path: path.join(adminDir, 'pesanan', 'page.tsx'),
    content: `"use client";

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
`
  }
];

if (!fs.existsSync(path.join(adminDir, 'pesanan'))) {
  fs.mkdirSync(path.join(adminDir, 'pesanan'), { recursive: true });
}

pages.forEach(page => {
  fs.writeFileSync(page.path, page.content);
  console.log("Updated: " + page.path);
});
