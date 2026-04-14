-- ============================================
-- DORM CARE DATA SEED
-- ============================================
-- Run this SQL in Supabase Dashboard > SQL Editor AFTER schema.sql
-- ============================================

-- 1. SEED SERVICES (17 layanan)
INSERT INTO services (name, description, category, price_min, icon, features, badge, sort_order, is_active) VALUES
-- Layanan Utama
('Basic Clean', 'Pembersihan cepat untuk kamar harian.', 'utama', 20000, 'sparkles', ARRAY['Menyapu area utama', 'Mengepel lantai', 'Rapikan area kasur'], 'HEMAT', 1, true),
('Pro Basic Clean', 'Paket favorit untuk kamar + kamar mandi.', 'utama', 35000, 'spray-can', ARRAY['Menyapu + mengepel', '1 kamar mandi', 'Vakum tempat tidur', 'Room spray gratis member baru 1 bulan'], 'TERLARIS', 2, true),
('Deep Clean', 'Pembersihan mendalam sampai sudut kecil.', 'utama', 50000, 'bath', ARRAY['Menyapu + mengepel', '1 kamar mandi', 'Vakum tempat tidur', 'Sela-sela sudut', 'Room spray', 'Pengelapan'], 'PREMIUM', 3, true),
('Extra Deep Clean', 'Deep clean + tambahan cuci piring.', 'utama', 63000, 'sparkles', ARRAY['Semua fitur Deep Clean', 'Cuci piring maksimal 10 piring'], NULL, 4, true),
('Special Clean (5 km)', 'Cleaning + laundry antar jemput radius 5 km.', 'utama', 78000, 'truck', ARRAY['Paket deep clean', 'Laundry antar jemput', 'Radius 5 km'], 'BUNDLING', 5, true),
('Special Clean (10 km)', 'Cleaning + laundry antar jemput radius 10 km.', 'utama', 93000, 'truck', ARRAY['Paket deep clean', 'Laundry antar jemput', 'Radius 10 km'], 'BUNDLING', 6, true),
('Jasa Laundry (5 km)', 'Layanan antar jemput laundry radius 5 km.', 'utama', 15000, 'shirt', ARRAY['Antar jemput', 'Lipat rapi', 'Update status via WhatsApp'], NULL, 7, true),
('Jasa Laundry (10 km)', 'Layanan antar jemput laundry radius 10 km.', 'utama', 30000, 'shirt', ARRAY['Antar jemput', 'Lipat rapi', 'Jangkauan 10 km'], NULL, 8, true),
('Pembersihan Kipas', 'Pembersihan kipas agar udara lebih sehat.', 'utama', 7000, 'fan', ARRAY['Pembersihan baling-baling', 'Lap body kipas', 'Cek debu sisa'], NULL, 9, true),

-- Paket Bundling
('Sahabat Manis', 'Bundling hemat untuk area bersama.', 'bundling', 38000, 'sparkles', ARRAY['1 Kamar Mandi', '2 Kamar Tidur', 'Menyapu + mengepel'], 'BUNDLING', 10, true),
('Sahabat Akrab', 'Paket kebersihan barengan paling populer.', 'bundling', 68000, 'sparkles', ARRAY['2 Kamar Mandi', '2 Kamar Tidur', '2x vakum tempat tidur'], 'TERLARIS', 11, true),
('Soulmate', 'Paket lengkap 2 kamar untuk hasil maksimal.', 'bundling', 100000, 'spray-can', ARRAY['2 Kamar Mandi, 2 Kamar Tidur', '2x vakum', '2x room spray', '2x pengelapan'], 'PREMIUM', 12, true),
('Chemistry', 'Soulmate + cuci piring + free kipas.', 'bundling', 120000, 'sparkles', ARRAY['Fitur Soulmate', 'Cuci 20 piring', 'Free pembersihan kipas 1x'], 'PREMIUM', 13, true),
('Kasih Sayang (5 km)', 'Chemistry + 2x laundry radius 5 km.', 'bundling', 150000, 'truck', ARRAY['Fitur Chemistry', '2x jasa laundry', 'Radius 5 km'], 'BUNDLING', 14, true),
('Kasih Sayang (10 km)', 'Chemistry + 2x laundry radius 10 km.', 'bundling', 180000, 'truck', ARRAY['Fitur Chemistry', '2x jasa laundry', 'Radius 10 km'], 'BUNDLING', 15, true),

-- Layanan Lainnya
('Gentle Clean', 'Paket very deep untuk kamar dan area tambahan.', 'lainnya', 150000, 'bath', ARRAY['Menyapu + mengepel', 'Vakum karpet & kasur', 'Pembersihan kipas', 'Cuci piring', 'Pengangkutan sampah'], 'PREMIUM', 16, true),
('Paket Jastip', 'Jasa titip merchant favorit sekitar kampus.', 'lainnya', 2000, 'truck', ARRAY['Familia, McD, KFC, Belkop, Kopken', 'Area PENS dan PPNS', 'Tarif mulai 2.000/km'], 'HEMAT', 17, true);

-- 2. SEED PROMO CODES (4 promo)
INSERT INTO promo_codes (code, name, description, type, value, min_transaction, max_uses, applicable_level, starts_at, expires_at, is_active) VALUES
('DORMCARE15', 'Soft Launch Surabaya', 'Diskon 15% untuk 150 order pertama area Surabaya.', 'percentage', 15, 30000, 150, NULL, NOW(), NOW() + INTERVAL '30 days', true),
('ANKOS10', 'Anak Kos Hemat', 'Potongan Rp 10.000 untuk transaksi minimal Rp 60.000.', 'nominal', 10000, 60000, NULL, NULL, NOW(), NOW() + INTERVAL '20 days', true),
('BUNDLING8', 'Bundling Ceria', 'Diskon 8% untuk semua paket bersama.', 'percentage', 8, 100000, NULL, NULL, NOW(), NOW() + INTERVAL '40 days', true),
('SILVER5', 'Silver Welcome', 'Khusus member Silver: diskon 5% layanan utama.', 'percentage', 5, 0, NULL, 'silver', NOW(), NOW() + INTERVAL '50 days', true);

-- 3. SEED FAQs (10 pertanyaan)
INSERT INTO faqs (question, answer, category, sort_order, is_active) VALUES
('Dorm Care melayani area mana saja saat ini?', 'Untuk fase peluncuran, Dorm Care melayani area Surabaya dengan fokus operasional di Kecamatan Sukolilo dan sekitarnya.', 'layanan', 1, true),
('Apakah saya perlu menyiapkan alat kebersihan?', 'Tidak perlu. Tim Dorm Care membawa alat standar kebersihan. Jika ada preferensi cairan tertentu, bisa ditulis di catatan pesanan.', 'layanan', 2, true),
('Pembayaran di website ini asli atau simulasi?', 'Saat ini pembayaran masih prototype/simulasi, tetapi alurnya dibuat realistis agar siap untuk integrasi gateway final.', 'pembayaran', 3, true),
('Berapa minimal waktu booking sebelum layanan dimulai?', 'Disarankan booking minimal 1 jam sebelum jadwal agar tim kami bisa menyiapkan slot dan personel terbaik.', 'jadwal', 4, true),
('Kalau mendadak ada kelas dan harus reschedule bagaimana?', 'Reschedule bisa dilakukan dari halaman riwayat selama status masih pending, diterima, atau menuju lokasi.', 'jadwal', 5, true),
('Apakah ada biaya tambahan berdasarkan jarak?', 'Ada untuk layanan tertentu seperti special clean dan laundry antar-jemput, dengan opsi radius 5 km dan 10 km.', 'area', 6, true),
('Kenapa nomor WhatsApp wajib diisi saat daftar?', 'Nomor WhatsApp dipakai untuk notifikasi booking, update status order, dan komunikasi cepat jika ada perubahan jadwal.', 'akun', 7, true),
('Bisakah login dengan Google tanpa isi form panjang?', 'Bisa. Google OAuth tersedia untuk login cepat. Namun user tetap diminta melengkapi nomor WhatsApp saat pertama kali masuk.', 'akun', 8, true),
('Apakah bisa bayar lewat QRIS dan e-wallet nasional?', 'Bisa, tersedia simulasi QRIS, GoPay, ShopeePay, DANA, dan transfer bank nasional di halaman transaksi.', 'pembayaran', 9, true),
('Bagaimana kualitas mitra pembersihan Dorm Care?', 'Setiap mitra melalui proses onboarding SOP kebersihan, etika layanan, dan evaluasi berkala melalui rating pengguna.', 'layanan', 10, true);

-- 4. SEED TESTIMONIALS (6 testimoni)
INSERT INTO testimonials (name, member_level, rating, comment, service_used, is_visible) VALUES
('Rizki M.', 'bronze', 5, 'Enak banget buat anak kos. Tinggal booking, tim datang tepat waktu, kamar langsung rapi tanpa ribet.', 'Pro Basic Clean', true),
('Putri K.', 'bronze', 5, 'Layanannya profesional dan terjangkau. Kamar yang tadinya jorok jadi berkilau dalam hitungan jam!', 'Deep Clean', true),
('Ahmad R.', 'silver', 5, 'Support mereka responsif banget di WhatsApp. Pernah ada perubahan jadwal, langsung disiapin slot baru tanpa drama.', 'Special Clean (5 km)', true),
('Sinta D.', 'silver', 4, 'Bundling package-nya worth it. Hemat waktu dan biaya, apalagi sekarang jadi Silver member dapat diskon lagi!', 'Kasih Sayang (5 km)', true),
('Budi W.', 'gold', 5, 'Top banget! Tim profesional, hasil memuaskan, dan benefit Gold-nya benar-benar berguna. Rekomen untuk teman-teman!', 'Chemistry', true),
('Nina C.', 'bronze', 5, 'Pertama kali pakai, langsung terpesona. Tidak ada yang terlewat, detail banget, dan harganya wajar.', 'Extra Deep Clean', true);

-- 5. SEED ADMIN USER (optional - creates via auth manually usually)
-- Note: You need to create admin user via Supabase Auth Dashboard first, then run:
-- UPDATE profiles SET role = 'admin' WHERE email = 'admin@dormcare.id';
