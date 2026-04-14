"use client";

import { useMemo } from "react";
import { ShoppingBag, Users, DollarSign, Activity, ChevronRight, CheckCircle2, Clock, XCircle, TrendingUp } from "lucide-react";
import Link from "next/link";

import { AdminNav } from "@/components/admin-nav";
import { orderCatalog, adminUsers, reportDaily } from "@/data/site-data";
import { formatRupiah } from "@/lib/utils";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export default function AdminDashboardPage() {
  const [dbStats, setDbStats] = useState({ totalOrders: 0, totalUsers: 0, totalRevenue: 0, activeOrders: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) return;

      // Fetch Profiles count
      const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      
      // Fetch Orders stats
      const { data: orders } = await supabase.from('orders').select('status, total_amount, id, order_number, profiles(first_name, last_name, phone), service_name, created_at').order('created_at', { ascending: false });
      
      if (orders) {
        const activeCount = orders.filter(o => !["completed", "cancelled"].includes(o.status)).length;
        const totalRev = orders.filter(o => o.status === "completed").reduce((sum, o) => sum + (o.total_amount || 0), 0);
        
        setDbStats({
          totalOrders: orders.length,
          totalUsers: userCount || 0,
          totalRevenue: totalRev,
          activeOrders: activeCount
        });

        // Map recent orders for display
        const mappedRecent = orders.slice(0, 5).map((d: any) => {
          const mapStatus: Record<string, string> = {
            'pending_confirmation': 'pending',
            'confirmed': 'diterima',
            'on_the_way': 'menuju',
            'in_progress': 'dikerjakan',
            'completed': 'selesai',
            'cancelled': 'dibatalkan'
          };
          return {
            id: d.order_number,
            namaUser: d.profiles ? (Array.isArray(d.profiles) ? `${d.profiles[0]?.first_name} ${d.profiles[0]?.last_name || ''}`.trim() : `${d.profiles?.first_name} ${d.profiles?.last_name || ''}`.trim()) : "Unknown",
            layananNama: d.service_name,
            total: d.total_amount,
            status: mapStatus[d.status] || 'pending'
          };
        });
        setRecentOrders(mappedRecent);
      }
      setIsLoading(false);
    };

    void fetchData();
  }, []);

  const stats = [
    { label: "Total Pesanan", value: String(dbStats.totalOrders), trend: "-", color: "text-blue-600", bg: "bg-blue-50", icon: ShoppingBag },
    { label: "Total Pengguna", value: String(dbStats.totalUsers), trend: "-", color: "text-brand-primary", bg: "bg-brand-primary-light/20", icon: Users },
    { label: "Total Pendapatan (Selesai)", value: formatRupiah(dbStats.totalRevenue), trend: "-", color: "text-green-600", bg: "bg-green-50", icon: DollarSign },
    { label: "Pesanan Aktif", value: String(dbStats.activeOrders), trend: "-", color: "text-orange-500", bg: "bg-amber-50", icon: Activity },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
      case "diterima":
      case "menuju":
      case "dikerjakan":
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-600 border border-blue-100"><Clock className="size-3" /> {status}</span>;
      case "selesai":
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary-light/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-primary border border-brand-primary-light/20"><CheckCircle2 className="size-3" /> Selesai</span>;
      case "dibatalkan":
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-error border border-red-100"><XCircle className="size-3" /> Batal</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 pb-20 pt-10">
      <section className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8">
        <p className="section-label">Admin Dorm Care</p>
        <h1 className="h2-title mt-2 text-neutral-900">Dashboard</h1>
        <p className="mt-2 text-neutral-600">Ringkasan aktivitas dan performa operasional Dorm Care.</p>
      </section>

      <AdminNav />

      {/* Stats Grid */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <article key={stat.label} className="group relative overflow-hidden rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:border-brand-primary/30">
            <div className="relative z-10 mb-4 flex items-center justify-between">
              <div className={`flex size-10 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="size-5" />
              </div>
              {stat.trend && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-primary">
                  <TrendingUp className="size-3" />
                  {stat.trend}
                </span>
              )}
            </div>
            <div className="relative z-10">
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">{stat.label}</p>
              <p className="font-display text-2xl font-extrabold text-neutral-900">{stat.value}</p>
            </div>
          </article>
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Orders */}
        <article className="flex flex-col rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-neutral-900">Pesanan Terbaru</h2>
            <Link href="/admin/pesanan" className="inline-flex items-center text-xs font-bold text-brand-primary hover:underline">
              Kelola Pesanan <ChevronRight className="ml-1 size-3" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr>
                  <th className="rounded-tl-xl border-y border-neutral-200 bg-neutral-50 p-4 text-xs font-bold uppercase tracking-wider text-neutral-500">ID</th>
                  <th className="border-y border-neutral-200 bg-neutral-50 p-4 text-xs font-bold uppercase tracking-wider text-neutral-500">Pelanggan</th>
                  <th className="border-y border-neutral-200 bg-neutral-50 p-4 text-xs font-bold uppercase tracking-wider text-neutral-500">Layanan</th>
                  <th className="border-y border-neutral-200 bg-neutral-50 p-4 text-xs font-bold uppercase tracking-wider text-neutral-500">Status</th>
                  <th className="rounded-tr-xl border-y border-neutral-200 bg-neutral-50 p-4 text-right text-xs font-bold uppercase tracking-wider text-neutral-500">Nominal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="transition hover:bg-neutral-50">
                    <td className="p-4 font-mono text-xs text-neutral-500">{order.id}</td>
                    <td className="p-4 font-bold text-neutral-900">{order.namaUser}</td>
                    <td className="p-4 text-neutral-600">{order.layananNama}</td>
                    <td className="p-4">{getStatusBadge(order.status)}</td>
                    <td className="p-4 text-right font-extrabold text-neutral-900">{formatRupiah(order.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        {/* Quick Actions */}
        <div className="space-y-6">
          <article className="relative overflow-hidden rounded-3xl border border-brand-primary bg-gradient-to-br from-brand-primary to-brand-primary-dark p-8 text-white shadow-brand">
            <div className="absolute -right-4 -top-4 size-32 rounded-full bg-white/10 blur-2xl" />
            <div className="relative z-10 text-center">
              <h2 className="font-display text-2xl font-extrabold mb-2">Tarik Laporan</h2>
              <p className="text-sm text-white/80 mb-6">Unduh rekap operasional dalam format CSV.</p>
              <Link href="/admin/laporan" className="block w-full rounded-xl bg-white py-3 text-center font-bold text-brand-primary transition hover:bg-neutral-50">
                Buka Laporan
              </Link>
            </div>
          </article>

          <article className="rounded-3xl border border-neutral-200 bg-white p-6">
            <h3 className="font-display font-bold text-neutral-900 mb-4">Menu Cepat</h3>
            <div className="space-y-2">
              {[
                { href: "/admin/layanan", label: "Tambah Layanan Baru" },
                { href: "/admin/promo", label: "Buat Promo Baru" },
                { href: "/admin/konten", label: "Kelola FAQ & Testimoni" },
                { href: "/admin/pengguna", label: "Kelola Pengguna" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between rounded-xl border border-neutral-200 px-4 py-3 text-sm font-semibold text-neutral-700 transition hover:border-brand-primary/30 hover:text-brand-primary-dark"
                >
                  {item.label}
                  <ChevronRight className="size-4 text-neutral-400" />
                </Link>
              ))}
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
