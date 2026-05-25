'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Download, TrendingUp, TrendingDown, DollarSign, ShoppingCart, Percent, Star, AlertTriangle, ChevronUp, ChevronDown, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { AdminNav } from '@/components/admin-nav';
import { formatRupiah } from '@/lib/utils';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

const AdminReportCharts = dynamic(() => import('@/components/admin-report-charts'), {
  ssr: false,
  loading: () => (
    <section className="space-y-6">
      <div className="h-64 animate-pulse rounded-3xl border border-neutral-200 bg-neutral-100" />
      <div className="h-64 animate-pulse rounded-3xl border border-neutral-200 bg-neutral-100" />
    </section>
  ),
});

type DailyReportItem = { hari: string; pesanan: number; pendapatan: number };
type StatusDistributionItem = { name: string; value: number };

export default function AdminLaporanPage() {
  const [loading, setLoading] = useState(true);
  const [reportDaily, setReportDaily] = useState<DailyReportItem[]>([]);
  const [statusData, setStatusData] = useState<StatusDistributionItem[]>([]);
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('7d');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    setLoading(true);

    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Gagal mengambil data: ' + error.message);
      setLoading(false);
      return;
    }

    if (orders) {
      setAllOrders(orders);

      // Build daily report
      const dailyMap: Record<string, { pesanan: number; pendapatan: number }> = {};
      const statusCount: Record<string, number> = {};

      for (const o of orders) {
        // Daily grouping
        const day = new Date(o.created_at).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' });
        if (!dailyMap[day]) dailyMap[day] = { pesanan: 0, pendapatan: 0 };
        dailyMap[day].pesanan += 1;
        dailyMap[day].pendapatan += o.total_amount || 0;

        // Status distribution
        const statusLabel = o.status.replace(/_/g, ' ');
        statusCount[statusLabel] = (statusCount[statusLabel] || 0) + 1;
      }

      // Convert to sorted array (last N days)
      const days = Object.entries(dailyMap)
        .map(([hari, data]) => ({ hari, ...data }))
        .slice(-14); // Last 14 days

      setReportDaily(days);

      setStatusData(
        Object.entries(statusCount).map(([name, value]) => ({ name, value }))
      );
    }
    setLoading(false);
  };

  // Compute metrics
  const metrics = useMemo(() => {
    if (allOrders.length === 0) return null;

    const totalRevenue = allOrders.reduce((s, o) => s + (o.total_amount || 0), 0);
    const totalOrders = allOrders.length;
    const avgOrderValue = totalOrders / totalRevenue;
    const completedOrders = allOrders.filter(o => o.status === 'completed').length;
    const cancelledOrders = allOrders.filter(o => o.status === 'cancelled').length;
    const completionRate = (completedOrders / totalOrders * 100);
    const cancellationRate = (cancelledOrders / totalOrders * 100);

    // Most popular service
    const serviceCount: Record<string, number> = {};
    for (const o of allOrders) {
      const name = o.service_name || 'Unknown';
      serviceCount[name] = (serviceCount[name] || 0) + 1;
    }
    const topService = Object.entries(serviceCount).sort((a, b) => b[1] - a[1])[0];

    // Busiest day
    const dayCount: Record<string, number> = {};
    for (const o of allOrders) {
      const day = new Date(o.created_at).toLocaleDateString('id-ID', { weekday: 'long' });
      dayCount[day] = (dayCount[day] || 0) + 1;
    }
    const busiestDay = Object.entries(dayCount).sort((a, b) => b[1] - a[1])[0];

    // Revenue this month vs last month
    const now = new Date();
    const thisMonth = allOrders.filter(o => {
      const d = new Date(o.created_at);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const lastMonth = allOrders.filter(o => {
      const d = new Date(o.created_at);
      const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return d.getMonth() === lastMonthDate.getMonth() && d.getFullYear() === lastMonthDate.getFullYear();
    });

    const thisMonthRevenue = thisMonth.reduce((s, o) => s + (o.total_amount || 0), 0);
    const lastMonthRevenue = lastMonth.reduce((s, o) => s + (o.total_amount || 0), 0);
    const revenueGrowth = lastMonthRevenue > 0 ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100) : 0;

    return {
      totalRevenue,
      totalOrders,
      avgOrderValue,
      completedOrders,
      cancelledOrders,
      completionRate,
      cancellationRate,
      topService,
      busiestDay,
      thisMonthRevenue,
      lastMonthRevenue,
      revenueGrowth,
    };
  }, [allOrders]);

  const handleExportCSV = () => {
    if (allOrders.length === 0) {
      toast.error('Tidak ada data untuk diexport.');
      return;
    }

    const headers = [
      'Order ID', 'Pelanggan', 'Layanan', 'Harga Layanan', 'Diskon',
      'Total', 'Status', 'Alamat', 'Area', 'Jadwal Tanggal', 'Jadwal Waktu',
      'Catatan', 'Kode Promo', 'Mitra', 'Dibuat Pada', 'Diperbarui Pada'
    ];

    const rows = allOrders.map((o) => [
      o.order_number || '-',
      o.user_id || '-',
      o.service_name || '-',
      String(o.service_price || 0),
      String(o.discount_amount || 0),
      String(o.total_amount || 0),
      o.status || '-',
      o.address || '-',
      o.area || '-',
      o.scheduled_date || '-',
      o.scheduled_time || '-',
      o.notes || '-',
      o.promo_code || '-',
      o.mitra_name || '-',
      new Date(o.created_at).toLocaleString('id-ID'),
      new Date(o.updated_at).toLocaleString('id-ID'),
    ]);

    // BOM for Excel UTF-8
    const BOM = '﻿';
    const csv = BOM + [headers.join(','), ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `laporan-dorm-care-${new Date().toISOString().split('T')[0]}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success('CSV berhasil diexport!');
  };

  if (loading) {
    return (
      <div className="pb-20 pt-10">
        <section className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8">
          <p className="section-label">Admin Dorm Care</p>
          <h1 className="h2-title mt-2 text-neutral-900">Laporan Operasional</h1>
        </section>
        <AdminNav />
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="size-10 animate-spin rounded-full border-4 border-neutral-200 border-t-brand-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 pt-10">
      {/* Header */}
      <section className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="section-label">Admin Dorm Care</p>
            <h1 className="h2-title mt-2 text-neutral-900">Laporan Operasional</h1>
            <p className="mt-2 text-neutral-600">Analisis performa pesanan, pendapatan, dan metrik bisnis.</p>
          </div>
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-primary-dark transition"
          >
            <Download className="size-4" />
            Export CSV Lengkap
          </button>
        </div>
      </section>

      <AdminNav />

      {/* Key Metrics */}
      {metrics && (
        <>
          <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <article className="rounded-2xl border border-neutral-200 bg-white p-5">
              <div className="flex items-center gap-2 text-green-600 mb-1">
                <DollarSign className="size-5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Total Pendapatan</span>
              </div>
              <p className="text-3xl font-black text-neutral-900">{formatRupiah(metrics.totalRevenue)}</p>
              <p className="text-xs text-neutral-500 mt-1">
                {metrics.revenueGrowth >= 0 ? (
                  <span className="text-green-600 inline-flex items-center gap-0.5"><ChevronUp className="size-3" /> +{metrics.revenueGrowth.toFixed(1)}%</span>
                ) : (
                  <span className="text-red-600 inline-flex items-center gap-0.5"><ChevronDown className="size-3" /> {metrics.revenueGrowth.toFixed(1)}%</span>
                )}
                {' '}vs bulan lalu
              </p>
            </article>

            <article className="rounded-2xl border border-neutral-200 bg-white p-5">
              <div className="flex items-center gap-2 text-blue-600 mb-1">
                <ShoppingCart className="size-5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Total Pesanan</span>
              </div>
              <p className="text-3xl font-black text-neutral-900">{metrics.totalOrders}</p>
              <p className="text-xs text-neutral-500 mt-1">Rata-rata {formatRupiah(metrics.totalRevenue / Math.max(metrics.totalOrders, 1))} / order</p>
            </article>

            <article className="rounded-2xl border border-neutral-200 bg-white p-5">
              <div className="flex items-center gap-2 text-brand-primary mb-1">
                <Percent className="size-5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Tingkat Selesai</span>
              </div>
              <p className="text-3xl font-black text-neutral-900">{metrics.completionRate.toFixed(1)}%</p>
              <p className="text-xs text-neutral-500 mt-1">{metrics.completedOrders} dari {metrics.totalOrders} order selesai</p>
            </article>

            <article className="rounded-2xl border border-neutral-200 bg-white p-5">
              <div className="flex items-center gap-2 text-red-500 mb-1">
                <AlertTriangle className="size-5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Tingkat Batal</span>
              </div>
              <p className="text-3xl font-black text-neutral-900">{metrics.cancellationRate.toFixed(1)}%</p>
              <p className="text-xs text-neutral-500 mt-1">{metrics.cancelledOrders} order dibatalkan</p>
            </article>
          </section>

          {/* Business Insights */}
          <section className="rounded-3xl border border-neutral-200 bg-white p-6">
            <h2 className="font-heading text-xl font-black text-neutral-900 mb-4">Insight Bisnis & Strategi</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="size-5 text-amber-600" />
                  <p className="text-sm font-bold text-amber-900">Layanan Terpopuler</p>
                </div>
                <p className="text-2xl font-black text-amber-800">{metrics.topService?.[0] || '-'}</p>
                <p className="text-xs text-amber-700 mt-1">{metrics.topService?.[1]} pesanan — Pertimbangkan untuk bundling atau upsell.</p>
              </div>

              <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="size-5 text-blue-600" />
                  <p className="text-sm font-bold text-blue-900">Hari Tersibuk</p>
                </div>
                <p className="text-2xl font-black text-blue-800">{metrics.busiestDay?.[0] || '-'}</p>
                <p className="text-xs text-blue-700 mt-1">{metrics.busiestDay?.[1]} pesanan — Alokasikan lebih banyak mitra di hari ini.</p>
              </div>

              <div className="rounded-xl border border-green-200 bg-green-50/50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="size-5 text-green-600" />
                  <p className="text-sm font-bold text-green-900">Rekomendasi Strategi</p>
                </div>
                <ul className="space-y-1 text-xs text-green-800">
                  {metrics.cancellationRate > 20 && (
                    <li>• Tingkat pembatalan tinggi ({metrics.cancellationRate.toFixed(0)}%) — tinjau ulang proses booking.</li>
                  )}
                  {metrics.completionRate < 70 && (
                    <li>• Completion rate rendah — perbaiki follow-up ke pelanggan.</li>
                  )}
                  {metrics.revenueGrowth < 0 && (
                    <li>• Pendapatan turun — pertimbangkan promo atau diskon bundling.</li>
                  )}
                  <li>• Fokuskan pemasaran di hari {metrics.busiestDay?.[0] || '-'}.</li>
                  <li>• Rata-rata order {formatRupiah(metrics.totalRevenue / Math.max(metrics.totalOrders, 1))} — targetkan upsell paket premium.</li>
                </ul>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Charts */}
      {reportDaily.length > 0 ? (
        <AdminReportCharts reportDaily={reportDaily} statusData={statusData} />
      ) : (
        <section className="rounded-3xl border border-neutral-200 bg-white p-12 text-center">
          <DollarSign className="size-12 text-neutral-300 mx-auto mb-4" />
          <p className="text-neutral-500 font-semibold">Belum ada data untuk ditampilkan.</p>
        </section>
      )}

      {/* Status Summary Table */}
      {statusData.length > 0 && (
        <section className="rounded-3xl border border-neutral-200 bg-white p-6">
          <h2 className="font-heading text-xl font-black text-neutral-900 mb-4">Ringkasan Status Pesanan</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left p-3 bg-neutral-50 border-b border-neutral-200 font-bold text-neutral-500 text-xs uppercase tracking-wider">Status</th>
                  <th className="text-right p-3 bg-neutral-50 border-b border-neutral-200 font-bold text-neutral-500 text-xs uppercase tracking-wider">Jumlah</th>
                  <th className="text-right p-3 bg-neutral-50 border-b border-neutral-200 font-bold text-neutral-500 text-xs uppercase tracking-wider">Persentase</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {statusData.map((s) => (
                  <tr key={s.name}>
                    <td className="p-3 font-semibold text-neutral-900 capitalize">{s.name.replace(/_/g, ' ')}</td>
                    <td className="p-3 text-right font-bold text-neutral-900">{s.value}</td>
                    <td className="p-3 text-right text-neutral-600">
                      {((s.value / Math.max(allOrders.length, 1)) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
