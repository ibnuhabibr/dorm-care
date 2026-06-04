/**
 * LAPORAN KOMPREHENSIF — Dorm Care
 *
 * Export data lengkap pesanan, pelanggan, dan rekapitulasi ke CSV.
 *
 * Output files:
 *   - laporan-pesanan.csv       — Detail setiap pesanan
 *   - laporan-pelanggan.csv     — Data pelanggan + ringkasan belanja
 *   - laporan-rekapitulasi.csv  — Ringkasan layanan, revenue, membership
 *
 * Usage: node scripts/export-laporan.cjs
 */

const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

const SUPABASE_URL = "https://jnxpjjbotcipauflkkch.supabase.co";
const SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpueHBqamJvdGNpcGF1Zmxra2NoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjEwOTcxMSwiZXhwIjoyMDkxNjg1NzExfQ.20vwSMD6yzxp1UZG15voVrwfJfefzcXKcQsEJ-Ebe-Y";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ─────────────────────────────────
// HELPERS
// ─────────────────────────────────
function formatRupiah(n) {
  return `Rp ${Number(n).toLocaleString("id-ID")}`;
}

function formatDate(d) {
  if (!d) return "-";
  return new Date(d).toLocaleDateString("id-ID", {
    day: "2-digit", month: "long", year: "numeric",
  });
}

function formatDateTime(d) {
  if (!d) return "-";
  return new Date(d).toLocaleString("id-ID", {
    day: "2-digit", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function csvEscape(val) {
  if (val == null) return "";
  const str = String(val);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function writeCSV(filename, headers, rows) {
  const headerLine = headers.join(",") + "\n";
  const dataLines = rows.map(row =>
    headers.map(h => csvEscape(row[h])).join(",")
  ).join("\n");

  const filepath = path.join(__dirname, "..", filename);
  // Prepend BOM for Excel
  fs.writeFileSync(filepath, "﻿" + headerLine + dataLines, "utf-8");
  console.log(`  ✓ ${filename} (${rows.length} rows)`);
}

// ─────────────────────────────────
// MAIN
// ─────────────────────────────────
async function exportLaporan() {
  console.log("=== DORM CARE — EXPORT LAPORAN KOMPREHENSIF ===\n");

  // Fetch all data
  console.log("Mengambil data...");

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: true });

  const { data: profiles } = await supabase
    .from("profiles")
    .select("*");

  const { data: authUsers } = await supabase.auth.admin.listUsers({ perPage: 500 });

  if (!orders || !profiles) {
    console.error("Gagal mengambil data.");
    return;
  }

  const emailById = {};
  const phoneById = {};
  for (const u of authUsers?.users || []) {
    if (u.id) {
      emailById[u.id] = u.email || "";
      phoneById[u.id] = u.phone || "";
    }
  }

  const profileById = {};
  for (const p of profiles) {
    profileById[p.id] = p;
  }

  console.log(`  Orders: ${orders.length}`);
  console.log(`  Profiles: ${profiles.length}`);
  console.log(`  Auth users: ${authUsers?.users?.length || 0}\n`);

  // ───────────────────────────────
  // 1. LAPORAN PESANAN (DETAIL)
  // ───────────────────────────────
  console.log("1. Membuat laporan-pesanan.csv...");

  const orderHeaders = [
    "No",
    "Nomor Pesanan",
    "Tanggal Pesan",
    "Jam",
    "Status",
    "Nama Pelanggan",
    "Email",
    "No HP",
    "Area",
    "Alamat",
    "Layanan",
    "Harga Layanan",
    "Kode Promo",
    "Diskon",
    "Total Bayar",
    "Rating",
    "Catatan",
  ];

  const orderRows = orders.map((o, i) => {
    const profile = profileById[o.user_id] || {};
    return {
      "No": i + 1,
      "Nomor Pesanan": o.order_number,
      "Tanggal Pesan": formatDate(o.created_at),
      "Jam": o.scheduled_time,
      "Status": o.status,
      "Nama Pelanggan": `${profile.first_name || ""} ${profile.last_name || ""}`.trim() || "-",
      "Email": emailById[o.user_id] || "-",
      "No HP": profile.phone || phoneById[o.user_id] || "-",
      "Area": o.area || "-",
      "Alamat": o.address,
      "Layanan": o.service_name,
      "Harga Layanan": o.service_price,
      "Kode Promo": o.promo_code || "-",
      "Diskon": o.discount_amount || 0,
      "Total Bayar": o.total_amount,
      "Rating": o.rating ? `${o.rating}/5` : "-",
      "Catatan": o.notes || "-",
    };
  });

  writeCSV("laporan-pesanan.csv", orderHeaders, orderRows);

  // ───────────────────────────────
  // 2. LAPORAN PELANGGAN
  // ───────────────────────────────
  console.log("2. Membuat laporan-pelanggan.csv...");

  // Compute stats per user
  const userStats = {};
  for (const o of orders) {
    const uid = o.user_id;
    if (!userStats[uid]) userStats[uid] = {
      orders: [],
      totalSpent: 0,
      completedCount: 0,
      cancelledCount: 0,
    };
    userStats[uid].orders.push(o);
    if (o.status === "completed") {
      userStats[uid].totalSpent += o.total_amount;
      userStats[uid].completedCount++;
    } else if (o.status === "cancelled") {
      userStats[uid].cancelledCount++;
    }
  }

  const pelangganHeaders = [
    "No",
    "Nama Lengkap",
    "Email",
    "No HP",
    "Area",
    "Level Member",
    "Total Pesanan",
    "Pesanan Selesai",
    "Pesanan Dibatalkan",
    "Total Belanja",
    "Rata-rata per Pesanan",
    "Layanan Favorit",
    "Tanggal Bergabung",
  ];

  const pelangganRows = profiles
    .filter(p => userStats[p.id] && userStats[p.id].orders.length > 0)
    .sort((a, b) => (userStats[b.id]?.totalSpent || 0) - (userStats[a.id]?.totalSpent || 0))
    .map((p, i) => {
      const stats = userStats[p.id];
      // Favorit service
      const svcCount = {};
      stats.orders.forEach(o => {
        svcCount[o.service_name] = (svcCount[o.service_name] || 0) + 1;
      });
      const favSvc = Object.entries(svcCount).sort((a, b) => b[1] - a[1])[0];

      return {
        "No": i + 1,
        "Nama Lengkap": `${p.first_name || ""} ${p.last_name || ""}`.trim() || "-",
        "Email": emailById[p.id] || "-",
        "No HP": p.phone || phoneById[p.id] || "-",
        "Area": stats.orders[0]?.area || "-",
        "Level Member": p.member_level || "bronze",
        "Total Pesanan": stats.orders.length,
        "Pesanan Selesai": stats.completedCount,
        "Pesanan Dibatalkan": stats.cancelledCount,
        "Total Belanja": stats.totalSpent,
        "Rata-rata per Pesanan": Math.round(stats.totalSpent / (stats.completedCount || 1)),
        "Layanan Favorit": favSvc ? `${favSvc[0]} (${favSvc[1]}x)` : "-",
        "Tanggal Bergabung": formatDate(p.created_at),
      };
    });

  writeCSV("laporan-pelanggan.csv", pelangganHeaders, pelangganRows);

  // ───────────────────────────────
  // 3. LAPORAN REKAPITULASI
  // ───────────────────────────────
  console.log("3. Membuat laporan-rekapitulasi.csv...");

  const totalRevenue = orders
    .filter(o => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total_amount, 0);

  const completedOrders = orders.filter(o => o.status === "completed");
  const cancelledOrders = orders.filter(o => o.status === "cancelled");

  // By service
  const byService = {};
  for (const o of orders) {
    if (!byService[o.service_name]) {
      byService[o.service_name] = { count: 0, revenue: 0, cancelled: 0 };
    }
    byService[o.service_name].count++;
    if (o.status === "cancelled") {
      byService[o.service_name].cancelled++;
    } else {
      byService[o.service_name].revenue += o.total_amount;
    }
  }

  // By month
  const byMonth = {};
  for (const o of orders) {
    const m = o.scheduled_date?.substring(0, 7); // YYYY-MM
    if (!byMonth[m]) byMonth[m] = { count: 0, revenue: 0, cancelled: 0 };
    byMonth[m].count++;
    if (o.status === "cancelled") {
      byMonth[m].cancelled++;
    } else {
      byMonth[m].revenue += o.total_amount;
    }
  }

  // By area
  const byArea = {};
  for (const o of orders) {
    const a = o.area || "Tidak diketahui";
    if (!byArea[a]) byArea[a] = { count: 0, revenue: 0 };
    byArea[a].count++;
    if (o.status !== "cancelled") byArea[a].revenue += o.total_amount;
  }

  // Membership
  const byMembership = { bronze: 0, silver: 0, gold: 0 };
  for (const p of profiles) {
    const level = p.member_level || "bronze";
    byMembership[level] = (byMembership[level] || 0) + 1;
  }

  // Rating distribution
  const byRating = {};
  for (const o of completedOrders) {
    if (o.rating) {
      byRating[o.rating] = (byRating[o.rating] || 0) + 1;
    }
  }

  const rekapitulasiRows = [
    // Section: Ringkasan Umum
    { "Kategori": "RINGKASAN UMUM", "Metrik": "", "Nilai": "", "Persentase": "" },
    { "Kategori": "", "Metrik": "Total Pesanan", "Nilai": orders.length, "Persentase": "100%" },
    { "Kategori": "", "Metrik": "Pesanan Selesai", "Nilai": completedOrders.length, "Persentase": `${((completedOrders.length / orders.length) * 100).toFixed(1)}%` },
    { "Kategori": "", "Metrik": "Pesanan Dibatalkan", "Nilai": cancelledOrders.length, "Persentase": `${((cancelledOrders.length / orders.length) * 100).toFixed(1)}%` },
    { "Kategori": "", "Metrik": "Total Pendapatan", "Nilai": totalRevenue, "Persentase": formatRupiah(totalRevenue) },
    { "Kategori": "", "Metrik": "Rata-rata per Pesanan", "Nilai": Math.round(totalRevenue / (completedOrders.length || 1)), "Persentase": formatRupiah(Math.round(totalRevenue / (completedOrders.length || 1))) },
    { "Kategori": "", "Metrik": "Total Pelanggan", "Nilai": profiles.length, "Persentase": "" },
    { "Kategori": "", "Metrik": "Pelanggan Aktif (pernah pesan)", "Nilai": Object.keys(userStats).length, "Persentase": `${((Object.keys(userStats).length / profiles.length) * 100).toFixed(1)}%` },
    { "Kategori": "", "Metrik": "", "Nilai": "", "Persentase": "" },

    // Section: Membership
    { "Kategori": "LEVEL MEMBERSHIP", "Metrik": "", "Nilai": "", "Persentase": "" },
    ...Object.entries(byMembership).map(([level, count]) => ({
      "Kategori": "", "Metrik": level.charAt(0).toUpperCase() + level.slice(1), "Nilai": count, "Persentase": `${((count / profiles.length) * 100).toFixed(1)}%`,
    })),
    { "Kategori": "", "Metrik": "", "Nilai": "", "Persentase": "" },

    // Section: By Service
    { "Kategori": "PER LAYANAN", "Metrik": "", "Nilai": "", "Persentase": "" },
    ...Object.entries(byService)
      .sort((a, b) => b[1].revenue - a[1].revenue)
      .map(([svc, stats]) => ({
        "Kategori": "",
        "Metrik": svc,
        "Nilai": `Total: ${stats.count} | Selesai: ${stats.count - stats.cancelled} | Batal: ${stats.cancelled}`,
        "Persentase": formatRupiah(stats.revenue),
      })),
    { "Kategori": "", "Metrik": "", "Nilai": "", "Persentase": "" },

    // Section: By Month
    { "Kategori": "PER BULAN", "Metrik": "", "Nilai": "", "Persentase": "" },
    ...Object.entries(byMonth)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([month, stats]) => {
        const monthNames = { "01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr", "05": "Mei", "06": "Jun" };
        const m = monthNames[month.substring(5)] || month;
        return {
          "Kategori": "",
          "Metrik": `${m} 2026`,
          "Nilai": `Total: ${stats.count} | Selesai: ${stats.count - stats.cancelled} | Batal: ${stats.cancelled}`,
          "Persentase": formatRupiah(stats.revenue),
        };
      }),
    { "Kategori": "", "Metrik": "", "Nilai": "", "Persentase": "" },

    // Section: By Area
    { "Kategori": "PER AREA", "Metrik": "", "Nilai": "", "Persentase": "" },
    ...Object.entries(byArea)
      .sort((a, b) => b[1].revenue - a[1].revenue)
      .map(([area, stats]) => ({
        "Kategori": "",
        "Metrik": area,
        "Nilai": `${stats.count} pesanan`,
        "Persentase": formatRupiah(stats.revenue),
      })),
    { "Kategori": "", "Metrik": "", "Nilai": "", "Persentase": "" },

    // Section: Rating
    { "Kategori": "RATING", "Metrik": "", "Nilai": "", "Persentase": "" },
    ...Object.entries(byRating)
      .sort((a, b) => Number(b[0]) - Number(a[0]))
      .map(([rating, count]) => ({
        "Kategori": "",
        "Metrik": `Bintang ${rating}`,
        "Nilai": count,
        "Persentase": `${((count / completedOrders.filter(o => o.rating).length) * 100).toFixed(1)}%`,
      })),
    { "Kategori": "", "Metrik": "Rata-rata Rating", "Nilai": (completedOrders.filter(o => o.rating).reduce((sum, o) => sum + (o.rating || 0), 0) / (completedOrders.filter(o => o.rating).length || 1)).toFixed(1), "Persentase": "/ 5" },
  ];

  writeCSV("laporan-rekapitulasi.csv", ["Kategori", "Metrik", "Nilai", "Persentase"], rekapitulasiRows);

  // ───────────────────────────────
  // Summary
  // ───────────────────────────────
  console.log("\n======================================");
  console.log("RINGKASAN LAPORAN");
  console.log("======================================");
  console.log(`  Total Pesanan    : ${orders.length}`);
  console.log(`  Pesanan Selesai  : ${completedOrders.length}`);
  console.log(`  Pesanan Batal    : ${cancelledOrders.length}`);
  console.log(`  Total Pendapatan : ${formatRupiah(totalRevenue)}`);
  console.log(`  Total Pelanggan  : ${profiles.length}`);
  console.log(`  Pelanggan Aktif  : ${Object.keys(userStats).length}`);
  console.log("\nFile yang dihasilkan:");
  console.log("  laporan-pesanan.csv      — Detail setiap pesanan");
  console.log("  laporan-pelanggan.csv    — Data pelanggan & ringkasan belanja");
  console.log("  laporan-rekapitulasi.csv — Ringkasan layanan, revenue, area");
  console.log("\n=== EXPORT SELESAI ===");
}

exportLaporan().catch(console.error);
