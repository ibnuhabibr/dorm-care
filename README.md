# Dorm Care Web Prototype

Prototype website Dorm Care berbasis Next.js untuk validasi alur bisnis jasa kebersihan area Surabaya.

## Stack

- Next.js App Router + React + TypeScript
- Tailwind CSS
- Supabase (Auth + PostgreSQL)
- API Route untuk chatbot dan notifikasi WhatsApp prototype
- Siap deploy frontend ke Vercel

## Fitur yang sudah dibangun

- Homepage modern dengan promo, rekomendasi UX lanjutan, dan CTA booking
- Halaman layanan lengkap sesuai pricelist dan paket bundling
- Halaman About, Contact, Panduan, Terms
- Halaman transaksi prototype (QRIS, E-Wallet, transfer bank)
- Halaman riwayat layanan dan status booking
- Halaman profil user dengan tier Bronze, Silver, Gold
- Auth page login/signup email + Google OAuth (Supabase)
- Sidebar chatbot 24/7 + endpoint API chat
- Admin panel prototype untuk dashboard, update status order, dan CRUD layanan

## Menjalankan project

1. Install dependency

```bash
npm install
```

2. Duplikat file environment

```bash
cp .env.example .env.local
```

3. Isi environment Supabase dan DeepSeek di file env

4. Jalankan development server

```bash
npm run dev
```

5. Buka http://localhost:3000

## Struktur penting

- src/app: semua route halaman dan API
- src/components: komponen UI reusable
- src/data/site-data.ts: sumber data layanan, harga, FAQ, membership, dan seed order
- src/lib/supabase/client.ts: inisialisasi Supabase browser client
- public/chatbot-memory.json: memory intent chatbot (prototype)

## Catatan implementasi bisnis

- Untuk fase awal, kombinasi login Email + Google disarankan.
- Nomor WhatsApp tetap dikumpulkan sebagai metadata akun untuk notifikasi booking.
- Halaman panduan sebaiknya tetap terpisah agar onboarding user baru lebih cepat.
- Payment gateway saat ini statis sesuai kebutuhan purwarupa.

## Deploy

- Frontend: Vercel
- Backend lanjutan (opsional): VPS untuk webhook, worker notifikasi, dan service admin internal
