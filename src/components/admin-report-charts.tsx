"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatRupiah } from "@/lib/utils";

type DailyReportItem = {
  hari: string;
  pesanan: number;
  pendapatan: number;
};

type StatusDistributionItem = {
  name: string;
  value: number;
};

type AdminReportChartsProps = {
  reportDaily: DailyReportItem[];
  statusData: StatusDistributionItem[];
};

const pieColors = ["#0e7490", "#14b8a6", "#f59e0b", "#10b981", "#ef4444", "#64748b"];

export default function AdminReportCharts({ reportDaily, statusData }: AdminReportChartsProps) {
  return (
    <>
      <section className="grid gap-6 lg:grid-cols-12">
        <article className="rounded-3xl border border-neutral-200 bg-white p-4 sm:p-6 lg:col-span-7">
          <h2 className="font-heading text-xl font-black text-neutral-900">Trend Pendapatan Harian</h2>
          <div className="mt-4 h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={reportDaily}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="hari" />
                <YAxis />
                <Tooltip formatter={(value) => formatRupiah(Number(value ?? 0))} />
                <Legend />
                <Line type="monotone" dataKey="pendapatan" stroke="#0e7490" strokeWidth={3} name="Pendapatan" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-3xl border border-neutral-200 bg-white p-4 sm:p-6 lg:col-span-5">
          <h2 className="font-heading text-xl font-black text-neutral-900">Distribusi Status Order</h2>
          <div className="mt-4 h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={110} innerRadius={60}>
                  {statusData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>

      <section className="rounded-3xl border border-neutral-200 bg-white p-4 sm:p-6">
        <h2 className="font-heading text-xl font-black text-neutral-900">Jumlah Pesanan Harian</h2>
        <div className="mt-4 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={reportDaily}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="hari" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="pesanan" fill="#14b8a6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </>
  );
}
