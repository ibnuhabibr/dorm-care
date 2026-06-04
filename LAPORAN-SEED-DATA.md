# Laporan Seed Data — Dorm Care

**Tanggal Generate:** 4 Juni 2026
**Tujuan:** Data dummy realistis untuk demo akhir proyek kampus

---

## Ringkasan

| Metrik | Nilai |
|--------|-------|
| Total Pengguna | 40 (seed) + 32 (existing) = 72 |
| Pengguna dengan Pesanan | 55 (76.4%) |
| Total Pesanan | 144 |
| Total Pendapatan | Rp 4.140.300 |
| Rentang Tanggal | 14 April — 6 Juni 2026 |

---

## Profil Pengguna Seed

40 pengguna dibuat dengan data realistis:
- **Nama:** Indonesia (Ahmad Fauzi, Anisa Rahmawati, Budi Santoso, dll.)
- **Tahun Lahir:** 1995–2005
- **Domisili:** Area Sukolilo dan sekitarnya (Keputih, Gebang, Manyar, Mulyosari, Menur, Nginden, Semolowaru, Klampis, Medokan)
- **Email:** `user01@dormcare.test` s/d `user40@dormcare.test`
- **Password:** `password123` (seragam untuk testing)

### Pengguna Tanpa Pesanan (11 dari 40 ≈ 27.5%)
Sengaja dibuat untuk menunjukkan pengguna terdaftar yang belum melakukan pemesanan.

---

## Distribusi Pesanan per Layanan

| Layanan | Harga | Jumlah | % |
|---------|-------|--------|------|
| Pro Basic Clean | Rp 35.000 | 36 | 25.0% |
| Basic Clean | Rp 20.000 | 29 | 20.1% |
| Jasa Laundry (5 km) | Rp 15.000 | 23 | 16.0% |
| Deep Clean | Rp 50.000 | 16 | 11.1% |
| Sahabat Manis | Rp 38.000 | 12 | 8.3% |
| Pembersihan Kipas | Rp 7.000 | 10 | 6.9% |
| Extra Deep Clean | Rp 63.000 | 9 | 6.3% |
| Jasa Laundry (10 km) | Rp 30.000 | 5 | 3.5% |
| Sahabat Akrab | Rp 68.000 | 2 | 1.4% |
| Special Clean (10 km) | Rp 93.000 | 2 | 1.4% |

**Layanan mahal tanpa pesanan:** Soulmate (Rp 100.000), Chemistry (Rp 120.000), Kasih Sayang 5 km (Rp 150.000), Kasih Sayang 10 km (Rp 180.000) — sesuai requirements.

---

## Status Pesanan

| Status | Jumlah |
|--------|--------|
| Completed | 80 |
| In Progress | 16 |
| On The Way | 16 |
| Pending Confirmation | 14 |
| Confirmed | 8 |
| Cancelled | 10 |

---

## Pelanggan Teratas

| Nama | Pesanan | Total Belanja | Level |
|------|---------|---------------|-------|
| Ahmad Fauzi | 10 | Rp 304.500 | Silver |
| Anisa Rahmawati | 8 | Rp 201.200 | Silver |
| Rizky Pratama | 11 | Rp 187.300 | Bronze |
| Umar Bakri | 4 | Rp 143.000 | Bronze |
| Dimas Ardiansyah | 10 | Rp 128.000 | Bronze |

---

## Karakteristik Data

1. **Waktu natural:** Jam pemesanan menghindari kelipatan 5 dan 10 menit (contoh: 08:13, 09:37, 14:22)
2. **Repeat orders:** 10 power users masing-masing 6-10 pesanan; 19 regular users masing-masing 1-3 pesanan
3. **Distribusi layanan:** Layanan terjangkau (< Rp 50.000) mendominasi; 4-5 layanan termahal hampir tidak ada pesanan
4. **Distribusi tanggal:** Merata sepanjang 14 April — 31 Mei 2026 dengan sedikit kluster di akhir pekan
5. **Promo:** ~15% pesanan menggunakan kode promo (DORMCARE15, HEMAT10) dengan diskon 10-15%

---

## Catatan Teknis

- Script: `scripts/seed-data.cjs`
- Data di-generate via Supabase REST API dengan service role key
- Test user sebelumnya (pola `user##@dormcare.test`) dihapus sebelum seed ulang
- Pengguna existing (email real) tidak tersentuh
- `service_id` di-set null karena ID string dari katalog tidak match UUID di tabel services

---

## Cara Menjalankan Ulang

```bash
npm install
node scripts/seed-data.cjs
```

Script aman dijalankan berulang kali — hanya menghapus data test user, bukan data real.
