'use client';

import { useMemo, useEffect, useState, useRef } from 'react';
import { ShoppingBag, Users, DollarSign, Activity, ChevronRight, CheckCircle2, Clock, XCircle, TrendingUp, TrendingDown, Star, AlertTriangle, ArrowUp, ArrowDown, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AdminNav } from '@/components/admin-nav';
import { formatRupiah } from '@/lib/utils';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

// Animated counter hook
function useCountUp(end: number, duration = 1000, start = true) {
  const [value, setValue] = useState(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    if (!start || end === 0) { setValue(0); return; }
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out
      setValue(Math.round(eased * end));
      if (progress < 1) raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf.current);
  }, [end, duration, start]);

  return value;
}

export default function AdminDashboardPage() {
  const [dbStats, setDbStats] = useState({ totalOrders: 0, totalUsers: 0, totalRevenue: 0, activeOrders: 0,
    completedOrders: 0, cancelledOrders: 0, pendingOrders: 0,
    thisWeekRevenue: 0, lastWeekRevenue: 0, thisWeekOrders: 0, lastWeekOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [topServices, setTopServices] = useState<Array<{ name: string; count: number; revenue: number }>>([]);
  const [dailyRevenue, setDailyRevenue] = useState<Array<{ day: string; amount: number }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statsReady, setStatsReady] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) return;

      // Fetch all data
      const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      const { data: orders } = await supabase.from('orders').select('*').order('created_at', { ascending: false });

      if (orders) {
        const activeCount = orders.filter(o => !['completed', 'cancelled'].includes(o.status)).length;
        const completedCount = orders.filter(o => o.status === 'completed').length;
        const cancelledCount = orders.filter(o => o.status === 'cancelled').length;
        const pendingCount = orders.filter(o => o.status === 'pending_confirmation').length;
        const totalRev = orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + (o.total_amount || 0), 0);

        // This week vs last week
        const now = new Date();
        const startOfThisWeek = new Date(now);
        startOfThisWeek.setDate(now.getDate() - now.getDay());
        startOfThisWeek.setHours(0, 0, 0, 0);
        const startOfLastWeek = new Date(startOfThisWeek);
        startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

        const thisWeek = orders.filter(o => new Date(o.created_at) >= startOfThisWeek);
        const lastWeek = orders.filter(o => {
          const d = new Date(o.created_at);
          return d >= startOfLastWeek && d < startOfThisWeek;
        });

        const thisWeekRev = thisWeek.reduce((s, o) => s + (o.total_amount || 0), 0);
        const lastWeekRev = lastWeek.reduce((s, o) => s + (o.total_amount || 0), 0);

        // Daily revenue for last 7 days
        const dailyMap: Record<string, number> = {};
        for (let i = 6; i >= 0; i--) {
          const d = new Date(now);
          d.setDate(d.getDate() - i);
          const key = d.toLocaleDateString('id-ID', { weekday: 'short' });
          dailyMap[key] = 0;
        }
        for (const o of orders) {
          const d = new Date(o.created_at);
          const diff = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
          if (diff >= 0 && diff <= 6) {
            const key = d.toLocaleDateString('id-ID', { weekday: 'short' });
            dailyMap[key] = (dailyMap[key] || 0) + (o.total_amount || 0);
          }
        }
        const dailyArr = Object.entries(dailyMap).map(([day, amount]) => ({ day, amount }));

        // Top services
        const serviceMap: Record<string, { count: number; revenue: number }> = {};
        for (const o of orders) {
          const name = o.service_name || 'Unknown';
          if (!serviceMap[name]) serviceMap[name] = { count: 0, revenue: 0 };
          serviceMap[name].count++;
          serviceMap[name].revenue += o.total_amount || 0;
        }
        const topSvcs = Object.entries(serviceMap)
          .sort((a, b) => b[1].revenue - a[1].revenue)
          .slice(0, 5)
          .map(([name, data]) => ({ name, ...data }));

        setDbStats({
          totalOrders: orders.length,
          totalUsers: userCount || 0,
          totalRevenue: totalRev,
          activeOrders: activeCount,
          completedOrders: completedCount,
          cancelledOrders: cancelledCount,
          pendingOrders: pendingCount,
          thisWeekRevenue: thisWeekRev,
          lastWeekRevenue: lastWeekRev,
          thisWeekOrders: thisWeek.length,
          lastWeekOrders: lastWeek.length,
        });

        setTopServices(topSvcs);
        setDailyRevenue(dailyArr);

        // Recent orders
        const mappedRecent = orders.slice(0, 5).map((d: any) => {
          const mapStatus: Record<string, string> = {
            'pending_confirmation': 'pending',
            'confirmed': 'diterima',
            'on_the_way': 'menuju',
            'in_progress': 'dikerjakan',
            'completed': 'selesai',
            'cancelled': 'dibatalkan',
          };
          return {
            id: d.order_number,
            dbId: d.id,
            namaUser: d.profiles ? `${d.profiles?.first_name || ''} ${d.profiles?.last_name || ''}`.trim() || 'Unknown' : 'Unknown',
            layananNama: d.service_name,
            total: d.total_amount,
            status: mapStatus[d.status] || 'pending',
            date: new Date(d.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
          };
        });
        setRecentOrders(mappedRecent);
      }

      setIsLoading(false);
      // Start counting after a brief delay so the initial render with 0s is done
      setTimeout(() => setStatsReady(true), 300);
    };

    fetchData();
  }, []);

  const animatedOrders = useCountUp(dbStats.totalOrders, 1200, statsReady);
  const animatedUsers = useCountUp(dbStats.totalUsers, 1200, statsReady);
  const animatedActive = useCountUp(dbStats.activeOrders, 1200, statsReady);

  const revGrowth = dbStats.lastWeekRevenue > 0
    ? ((dbStats.thisWeekRevenue - dbStats.lastWeekRevenue) / dbStats.lastWeekRevenue * 100)
    : 0;

  const maxDailyRev = Math.max(...dailyRevenue.map(d => d.amount), 1);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-yellow-700 border border-yellow-200"><Clock className="size-3" /> Pending</span>;
      case 'diterima': return <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-700 border border-blue-200"><CheckCircle2 className="size-3" /> Diterima</span>;
      case 'menuju': return <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-orange-700 border border-orange-200"><Activity className="size-3" /> Menuju</span>;
      case 'dikerjakan': return <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary-light/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-primary border border-brand-primary/20"><Loader2 className="size-3 animate-spin" /> Dikerjakan</span>;
      case 'selesai': return <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-green-700 border border-green-200"><CheckCircle2 className="size-3" /> Selesai</span>;
      case 'dibatalkan': return <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-red-600 border border-red-100"><XCircle className="size-3" /> Batal</span>;
      default: return null;
    }
  };

  // Pulse animation for active orders
  const PulseDot = () => (
    <span className="relative flex size-2">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
      <span className="relative inline-flex size-2 rounded-full bg-green-500" />
    </span>
  );

  return (
    <div className="space-y-6 pb-20 pt-10">
      {/* Header */}
      <motion.section
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="section-label">Admin Dorm Care</p>
            <h1 className="h2-title mt-2 text-neutral-900">Dashboard Monitoring</h1>
            <p className="mt-2 text-neutral-600">Ringkasan aktivitas, performa bisnis, dan insight ekonomi real-time.</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-500">
            <PulseDot />
            Live monitoring
          </div>
        </div>
      </motion.section>

      <AdminNav />

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-3xl border border-neutral-200 bg-white p-6 animate-pulse">
              <div className="h-10 w-10 rounded-xl bg-neutral-200 mb-4" />
              <div className="h-4 w-24 bg-neutral-200 rounded mb-2" />
              <div className="h-8 w-32 bg-neutral-200 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="group relative overflow-hidden rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm hover:border-blue-300 transition-colors"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full opacity-50" />
              <div className="relative z-10 mb-4 flex items-center justify-between">
                <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <ShoppingBag className="size-5" />
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-green-600">
                  <TrendingUp className="size-3" />
                  +{dbStats.totalOrders > 0 ? ((dbStats.thisWeekOrders / Math.max(dbStats.lastWeekOrders, 1) * 100) - 100).toFixed(0) : 0}%
                </span>
              </div>
              <div className="relative z-10">
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">Total Pesanan</p>
                <p className="font-display text-2xl font-extrabold text-neutral-900">{animatedOrders.toLocaleString()}</p>
              </div>
            </motion.article>

            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="group relative overflow-hidden rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm hover:border-brand-primary/30 transition-colors"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary-light/20 rounded-bl-full opacity-50" />
              <div className="relative z-10 mb-4 flex items-center justify-between">
                <div className="flex size-10 items-center justify-center rounded-xl bg-brand-primary-light/20 text-brand-primary">
                  <Users className="size-5" />
                </div>
              </div>
              <div className="relative z-10">
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">Total Pengguna</p>
                <p className="font-display text-2xl font-extrabold text-neutral-900">{animatedUsers.toLocaleString()}</p>
              </div>
            </motion.article>

            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="group relative overflow-hidden rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm hover:border-green-300 transition-colors"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-full opacity-50" />
              <div className="relative z-10 mb-4 flex items-center justify-between">
                <div className="flex size-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <DollarSign className="size-5" />
                </div>
                <span className={`inline-flex items-center gap-1 text-xs font-bold ${revGrowth >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {revGrowth >= 0 ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />}
                  {Math.abs(revGrowth).toFixed(0)}%
                </span>
              </div>
              <div className="relative z-10">
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">Pendapatan (Minggu Ini)</p>
                <p className="font-display text-2xl font-extrabold text-neutral-900">{formatRupiah(dbStats.thisWeekRevenue)}</p>
              </div>
            </motion.article>

            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="group relative overflow-hidden rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm hover:border-orange-300 transition-colors"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full opacity-50" />
              <div className="relative z-10 mb-4 flex items-center justify-between">
                <div className="flex size-10 items-center justify-center rounded-xl bg-amber-50 text-orange-500">
                  <Activity className="size-5" />
                </div>
                <PulseDot />
              </div>
              <div className="relative z-10">
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">Pesanan Aktif</p>
                <p className="font-display text-2xl font-extrabold text-neutral-900">{animatedActive.toLocaleString()}</p>
              </div>
            </motion.article>
          </section>

          {/* Mini Revenue Chart */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-3xl border border-neutral-200 bg-white p-6"
          >
            <h2 className="font-display text-lg font-bold text-neutral-900 mb-4">Pendapatan 7 Hari Terakhir</h2>
            <div className="flex items-end gap-3 h-40">
              {dailyRevenue.map((d, i) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(d.amount / maxDailyRev) * 100}%` }}
                    transition={{ delay: 0.5 + i * 0.05, duration: 0.6, ease: 'easeOut' }}
                    className="w-full max-w-[48px] rounded-t-lg bg-gradient-to-t from-brand-primary to-brand-primary-light/60 min-h-[4px]"
                  />
                  <span className="text-[10px] font-semibold text-neutral-500">{d.day}</span>
                </div>
              ))}
            </div>
          </motion.section>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Recent Orders */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="flex flex-col rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm lg:col-span-2"
            >
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
                        <td className="p-4">
                          <Link href={`/admin/pesanan/${order.id}`} className="font-mono text-xs text-brand-primary hover:underline font-bold">
                            {order.id}
                          </Link>
                        </td>
                        <td className="p-4 font-bold text-neutral-900">{order.namaUser}</td>
                        <td className="p-4 text-neutral-600">{order.layananNama}</td>
                        <td className="p-4">{getStatusBadge(order.status)}</td>
                        <td className="p-4 text-right font-extrabold text-neutral-900">{formatRupiah(order.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.article>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Pending Alert */}
              {dbStats.pendingOrders > 0 && (
                <motion.article
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="rounded-3xl border border-yellow-200 bg-yellow-50 p-5"
                >
                  <div className="flex items-center gap-2 text-yellow-800 mb-2">
                    <AlertTriangle className="size-5" />
                    <h3 className="font-bold text-sm">Perlu Perhatian</h3>
                  </div>
                  <p className="text-3xl font-black text-yellow-900">{dbStats.pendingOrders}</p>
                  <p className="text-xs text-yellow-700 mt-1">Pesanan menunggu konfirmasi</p>
                  <Link
                    href="/admin/pesanan"
                    className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-yellow-800 hover:underline"
                  >
                    Proses sekarang <ChevronRight className="size-3" />
                  </Link>
                </motion.article>
              )}

              {/* Top Services */}
              <motion.article
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 }}
                className="rounded-3xl border border-neutral-200 bg-white p-5"
              >
                <h3 className="font-display font-bold text-neutral-900 mb-4">Top 5 Layanan</h3>
                <div className="space-y-2">
                  {topServices.map((svc, i) => (
                    <div key={svc.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className={`size-5 rounded-md flex items-center justify-center text-[10px] font-bold ${i === 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-neutral-100 text-neutral-500'}`}>
                          {i + 1}
                        </span>
                        <span className="font-semibold text-neutral-800 text-xs truncate max-w-[140px]">{svc.name}</span>
                      </div>
                      <span className="text-xs font-bold text-neutral-600">{formatRupiah(svc.revenue)}</span>
                    </div>
                  ))}
                </div>
              </motion.article>

              {/* Quick Actions */}
              <motion.article
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="relative overflow-hidden rounded-3xl border border-brand-primary bg-gradient-to-br from-brand-primary to-brand-primary-dark p-8 text-white shadow-brand"
              >
                <div className="absolute -right-4 -top-4 size-32 rounded-full bg-white/10 blur-2xl" />
                <div className="relative z-10 text-center">
                  <h2 className="font-display text-2xl font-extrabold mb-2">Tarik Laporan</h2>
                  <p className="text-sm text-white/80 mb-6">Unduh rekap operasional dalam format CSV.</p>
                  <Link href="/admin/laporan" className="block w-full rounded-xl bg-white py-3 text-center font-bold text-brand-primary transition hover:bg-neutral-50">
                    Buka Laporan
                  </Link>
                </div>
              </motion.article>

              {/* Menu Cepat */}
              <motion.article
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 }}
                className="rounded-3xl border border-neutral-200 bg-white p-6"
              >
                <h3 className="font-display font-bold text-neutral-900 mb-4">Menu Cepat</h3>
                <div className="space-y-2">
                  {[
                    { href: '/admin/layanan', label: 'Tambah Layanan Baru' },
                    { href: '/admin/promo', label: 'Buat Promo Baru' },
                    { href: '/admin/konten', label: 'Kelola FAQ & Testimoni' },
                    { href: '/admin/pengguna', label: 'Kelola Pengguna' },
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
              </motion.article>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
