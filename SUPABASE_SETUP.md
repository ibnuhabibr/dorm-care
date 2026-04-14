# 📚 Dorm Care Database Setup Guide

## Prerequisites
- Supabase project sudah dibuat (https://supabase.com)
- Environment variables sudah di-set:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Step 1: Run Schema Migration

1. Buka Supabase Dashboard → pilih project → SQL Editor
2. Buat query baru ("New Query")
3. Copy-paste seluruh isi dari `supabase/schema.sql`
4. Klik "Run" atau tekan `Ctrl+Enter`
5. Tunggu sampai selesai (tidak ada error)

**Expected Output:** Semua tables dibuat, indexes dibuat, RLS policies diterapkan, functions & triggers dijalankan.

## Step 2: Seed Initial Data

1. Di SQL Editor, buat query baru lagi
2. Copy-paste seluruh isi dari `supabase/seed.sql`
3. Klik "Run"
4. Tunggu sampai selesai

**Expected Output:** 17 services, 4 promos, 10 FAQs, 6 testimonials sudah created.

## Step 3: Create Admin User (Manual)

1. Buka Supabase Dashboard → "Authentication" → "Users" tab
2. Klik "+ Create new user" 
3. Input email: `admin@dormcare.id` (atau sesuai preferensi)
4. Input password: (strong password)
5. Confirm password
6. Un-check "Auto confirm user"
7. Klik "Create user"
8. Copy user ID (lihat kolom "User ID")

## Step 4: Set Admin Role

1. Buka SQL Editor
2. Run query:
```sql
UPDATE profiles 
SET role = 'admins' 
WHERE id = 'a04e3a6e-5f03-47ad-bd18-ab6c24d2a4e4';
```

## Step 5: Verify Database

Untuk memverifikasi semua berjalan baik, run query ini:

```sql
SELECT 
  (SELECT COUNT(*) FROM services) as total_services,
  (SELECT COUNT(*) FROM promo_codes) as total_promos,
  (SELECT COUNT(*) FROM faqs) as total_faqs,
  (SELECT COUNT(*) FROM testimonials) as total_testimonials,
  (SELECT COUNT(*) FROM profiles WHERE role = 'admin') as total_admins;
```

**Expected Output:**
```
total_services | total_promos | total_faqs | total_testimonials | total_admins
      17       |      4       |     10     |          6         |      1
```

## Troubleshooting

### Error: `permissions denied for relation profiles`
→ Masalah RLS policies. Re-run `schema.sql` portion yang memuat RLS policies.

### Error: `duplicate key value violates unique constraint`
→ Data sudah ada. Bisa skip seed, atau clear tables terlebih dahulu:
```sql
TRUNCATE TABLE services CASCADE;
TRUNCATE TABLE promo_codes CASCADE;
TRUNCATE TABLE faqs CASCADE;
TRUNCATE TABLE testimonials CASCADE;
```

### Tables tidak muncul di UI Supabase Dashboard
→ Coba refresh browser. Kadang dashboard tertinggal.

### Still having issues?
→ Lihat Supabase Dashboard → "Logs" untuk error details yang lebih akurat.

---

## Database Architecture Summary

### Tables (9):
1. **profiles** - Extended auth.users dengan member level, role, stats
2. **services** - Semua layanan (17 items)
3. **promo_codes** - Kode promo aktif
4. **orders** - Order history dengan status tracking
5. **transactions** - Payment records
6. **notifications** - User notifications (real-time)
7. **contact_messages** - Form kontak submissions
8. **faqs** - FAQ content
9. **testimonials** - User testimonials

### Key Features:
- ✅ RLS policies untuk security per-user data
- ✅ Automatic timestamp tracking (created_at, updated_at)
- ✅ Member level auto-upgrade saat order completed
- ✅ Profile auto-create saat user signup
- ✅ Comprehensive indexes untuk performance

---

## Next Steps
1. Setelah database ready, lanjut ke implementasi booking flow
2. Pastikan Supabase client sudah connected (cek `src/lib/supabase/client.ts`)
3. Test connection dengan simple query dari app
