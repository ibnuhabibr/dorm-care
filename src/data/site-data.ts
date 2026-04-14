export type UserRole = "user" | "admin";

export type MembershipLevel = "bronze" | "silver" | "gold";

export type ServiceCategory = "utama" | "paket" | "lainnya";

export type ServiceBadge = "TERLARIS" | "HEMAT" | "PREMIUM" | "BUNDLING";

export type ServiceItem = {
  id: string;
  nama: string;
  deskripsi: string;
  fitur: string[];
  kategori: ServiceCategory;
  hargaMin: number;
  hargaMax?: number;
  badge?: ServiceBadge;
  icon: "sparkles" | "spray-can" | "bath" | "shirt" | "fan" | "truck";
};

export type PromoItem = {
  id: string;
  nama: string;
  kode: string;
  deskripsi: string;
  tipe: "persen" | "nominal";
  nilai: number;
  minTransaksi: number;
  berlakuSampai: string;
  kategori: "diskon" | "member" | "bundle";
  aktif: boolean;
};

export type OrderStatus = "pending" | "diterima" | "menuju" | "dikerjakan" | "selesai" | "dibatalkan";

export type OrderTimelineItem = {
  jam: string;
  aktivitas: string;
};

export type OrderItem = {
  id: string;
  orderId: string;
  namaUser: string;
  noHp: string;
  layananId: string;
  layananNama: string;
  tanggal: string;
  total: number;
  metodePembayaran: "qris" | "ewallet" | "transfer";
  status: OrderStatus;
  mitra: string;
  alamat: string;
  catatan: string;
  timeline: OrderTimelineItem[];
};

export type TestimoniItem = {
  id: string;
  nama: string;
  role: string;
  layanan: string;
  rating: number;
  ulasan: string;
};

export type FaqItem = {
  id: string;
  kategori: "layanan" | "pembayaran" | "jadwal" | "area" | "akun";
  pertanyaan: string;
  jawaban: string;
};

export type MembershipCard = {
  level: MembershipLevel;
  title: string;
  subtitle: string;
  benefit: string[];
};

export type AdminUser = {
  id: string;
  nama: string;
  email: string;
  noHp: string;
  membership: MembershipLevel;
  totalOrder: number;
  totalBelanja: number;
  aktif: boolean;
  bergabung: string;
};

export type NotificationItem = {
  id: string;
  judul: string;
  pesan: string;
  waktu: string;
  kategori: "promo" | "order" | "akun";
  sudahDibaca: boolean;
};

export const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/layanan", label: "Layanan" },
  { href: "/panduan", label: "Panduan" },
  { href: "/riwayat", label: "Riwayat" },
  { href: "/promo", label: "Promo" },
  { href: "/tentang", label: "Tentang" },
  { href: "/kontak", label: "Kontak" },
] as const;

export const launchBanner = {
  text: "Soft Launch Surabaya: Diskon 15% untuk 150 order pertama! Kode: DORMCARE15",
  gradientFrom: "#0E7490",
  gradientTo: "#14B8A6",
};

export const trustStats = [
  { value: "150+", label: "Order Pertama Tersedia" },
  { value: "5 Jenis", label: "Paket Layanan" },
  { value: "24/7", label: "Customer Support" },
  { value: "Sukolilo", label: "Area Operasional" },
];

export const howItWorks = [
  {
    id: 1,
    title: "Pilih Layanan & Paket",
    desc: "Buka halaman Layanan dan pilih paket kebersihan yang cocok dengan kondisi kamarmu (misalnya: Daily Cleaning untuk pembersihan dasar, atau Deep Cleaning untuk pembersihan menyeluruh).",
    icon: "check",
  },
  {
    id: 2,
    title: "Tentukan Jadwal & Lokasi",
    desc: "Tentukan hari dan jam yang paling nyaman untukmu. Masukkan alamat lengkap kos atau asrama beserta detail kamar agar tim kami mudah menemukannya.",
    icon: "calendar",
  },
  {
    id: 3,
    title: "Selesaikan Pembayaran",
    desc: "Lakukan pembayaran melalui metode yang tersedia (Transfer Bank, QRIS, atau E-Wallet). Pesananmu akan segera diproses setelah pembayaran terverifikasi.",
    icon: "card",
  },
  {
    id: 4,
    title: "Konfirmasi & Notifikasi",
    desc: "Kamu akan menerima pesan konfirmasi otomatis melalui WhatsApp yang berisi detail pesanan dan nama mitra kebersihan yang akan bertugas.",
    icon: "message",
  },
  {
    id: 5,
    title: "Pantau Status Pesanan",
    desc: "Tim Dorm Care akan datang sesuai jadwal. Pantau progres pengerjaan secara real-time dari halaman Riwayat Pesanan hingga kamar bersih sempurna.",
    icon: "activity",
  },
];

export const serviceCatalog: ServiceItem[] = [
  {
    id: "svc-basic-clean",
    nama: "Basic Clean",
    deskripsi: "Pembersihan cepat untuk kamar harian.",
    fitur: ["Menyapu area utama", "Mengepel lantai", "Rapikan area kasur"],
    kategori: "utama",
    hargaMin: 20000,
    badge: "HEMAT",
    icon: "sparkles",
  },
  {
    id: "svc-pro-basic-clean",
    nama: "Pro Basic Clean",
    deskripsi: "Paket favorit untuk kamar + kamar mandi.",
    fitur: [
      "Menyapu + mengepel",
      "1 kamar mandi",
      "Vakum tempat tidur",
      "Room spray gratis member baru 1 bulan",
    ],
    kategori: "utama",
    hargaMin: 35000,
    badge: "TERLARIS",
    icon: "spray-can",
  },
  {
    id: "svc-deep-clean",
    nama: "Deep Clean",
    deskripsi: "Pembersihan mendalam sampai sudut kecil.",
    fitur: [
      "Menyapu + mengepel",
      "1 kamar mandi",
      "Vakum tempat tidur",
      "Sela-sela sudut",
      "Room spray",
      "Pengelapan",
    ],
    kategori: "utama",
    hargaMin: 50000,
    badge: "PREMIUM",
    icon: "bath",
  },
  {
    id: "svc-extra-deep-clean",
    nama: "Extra Deep Clean",
    deskripsi: "Deep clean + tambahan cuci piring.",
    fitur: ["Semua fitur Deep Clean", "Cuci piring maksimal 10 piring"],
    kategori: "utama",
    hargaMin: 63000,
    icon: "sparkles",
  },
  {
    id: "svc-special-clean-5",
    nama: "Special Clean (5 km)",
    deskripsi: "Cleaning + laundry antar jemput radius 5 km.",
    fitur: ["Paket deep clean", "Laundry antar jemput", "Radius 5 km"],
    kategori: "utama",
    hargaMin: 78000,
    badge: "BUNDLING",
    icon: "truck",
  },
  {
    id: "svc-special-clean-10",
    nama: "Special Clean (10 km)",
    deskripsi: "Cleaning + laundry antar jemput radius 10 km.",
    fitur: ["Paket deep clean", "Laundry antar jemput", "Radius 10 km"],
    kategori: "utama",
    hargaMin: 93000,
    badge: "BUNDLING",
    icon: "truck",
  },
  {
    id: "svc-laundry-5",
    nama: "Jasa Laundry (5 km)",
    deskripsi: "Layanan antar jemput laundry radius 5 km.",
    fitur: ["Antar jemput", "Lipat rapi", "Update status via WhatsApp"],
    kategori: "utama",
    hargaMin: 15000,
    icon: "shirt",
  },
  {
    id: "svc-laundry-10",
    nama: "Jasa Laundry (10 km)",
    deskripsi: "Layanan antar jemput laundry radius 10 km.",
    fitur: ["Antar jemput", "Lipat rapi", "Jangkauan 10 km"],
    kategori: "utama",
    hargaMin: 30000,
    icon: "shirt",
  },
  {
    id: "svc-fan-clean",
    nama: "Pembersihan Kipas",
    deskripsi: "Pembersihan kipas agar udara lebih sehat.",
    fitur: ["Pembersihan baling-baling", "Lap body kipas", "Cek debu sisa"],
    kategori: "utama",
    hargaMin: 7000,
    icon: "fan",
  },
  {
    id: "pkg-sahabat-manis",
    nama: "Sahabat Manis",
    deskripsi: "Bundling hemat untuk area bersama.",
    fitur: ["1 Kamar Mandi", "2 Kamar Tidur", "Menyapu + mengepel"],
    kategori: "paket",
    hargaMin: 38000,
    hargaMax: 40000,
    badge: "BUNDLING",
    icon: "sparkles",
  },
  {
    id: "pkg-sahabat-akrab",
    nama: "Sahabat Akrab",
    deskripsi: "Paket kebersihan barengan paling populer.",
    fitur: ["2 Kamar Mandi", "2 Kamar Tidur", "2x vakum tempat tidur"],
    kategori: "paket",
    hargaMin: 68000,
    hargaMax: 70000,
    badge: "TERLARIS",
    icon: "sparkles",
  },
  {
    id: "pkg-soulmate",
    nama: "Soulmate",
    deskripsi: "Paket lengkap 2 kamar untuk hasil maksimal.",
    fitur: ["2 Kamar Mandi, 2 Kamar Tidur", "2x vakum", "2x room spray", "2x pengelapan"],
    kategori: "paket",
    hargaMin: 100000,
    badge: "PREMIUM",
    icon: "spray-can",
  },
  {
    id: "pkg-chemistry",
    nama: "Chemistry",
    deskripsi: "Soulmate + cuci piring + free kipas.",
    fitur: ["Fitur Soulmate", "Cuci 20 piring", "Free pembersihan kipas 1x"],
    kategori: "paket",
    hargaMin: 120000,
    badge: "PREMIUM",
    icon: "sparkles",
  },
  {
    id: "pkg-kasih-sayang-5",
    nama: "Kasih Sayang (5 km)",
    deskripsi: "Chemistry + 2x laundry radius 5 km.",
    fitur: ["Fitur Chemistry", "2x jasa laundry", "Radius 5 km"],
    kategori: "paket",
    hargaMin: 150000,
    badge: "BUNDLING",
    icon: "truck",
  },
  {
    id: "pkg-kasih-sayang-10",
    nama: "Kasih Sayang (10 km)",
    deskripsi: "Chemistry + 2x laundry radius 10 km.",
    fitur: ["Fitur Chemistry", "2x jasa laundry", "Radius 10 km"],
    kategori: "paket",
    hargaMin: 180000,
    badge: "BUNDLING",
    icon: "truck",
  },
  {
    id: "svc-gentle-clean",
    nama: "Gentle Clean",
    deskripsi: "Paket very deep untuk kamar dan area tambahan.",
    fitur: [
      "Menyapu + mengepel",
      "Vakum karpet & kasur",
      "Pembersihan kipas",
      "Cuci piring",
      "Pengangkutan sampah",
    ],
    kategori: "lainnya",
    hargaMin: 150000,
    hargaMax: 250000,
    badge: "PREMIUM",
    icon: "bath",
  },
  {
    id: "svc-jastip",
    nama: "Paket Jastip",
    deskripsi: "Jasa titip merchant favorit sekitar kampus.",
    fitur: ["Familia, McD, KFC, Belkop, Kopken", "Area PENS dan PPNS", "Tarif mulai 2.000/km"],
    kategori: "lainnya",
    hargaMin: 2000,
    badge: "HEMAT",
    icon: "truck",
  },
];

export const promoCatalog: PromoItem[] = [
  {
    id: "promo-launch",
    nama: "Soft Launch Surabaya",
    kode: "DORMCARE15",
    deskripsi: "Diskon 15% untuk 150 order pertama area Surabaya.",
    tipe: "persen",
    nilai: 15,
    minTransaksi: 30000,
    berlakuSampai: "2026-05-01T23:59:59+07:00",
    kategori: "diskon",
    aktif: true,
  },
  {
    id: "promo-kos-hemat",
    nama: "Anak Kos Hemat",
    kode: "ANKOS10",
    deskripsi: "Potongan Rp 10.000 untuk transaksi minimal Rp 60.000.",
    tipe: "nominal",
    nilai: 10000,
    minTransaksi: 60000,
    berlakuSampai: "2026-04-30T23:59:59+07:00",
    kategori: "diskon",
    aktif: true,
  },
  {
    id: "promo-bundle",
    nama: "Bundling Ceria",
    kode: "BUNDLING8",
    deskripsi: "Diskon 8% untuk semua paket bersama.",
    tipe: "persen",
    nilai: 8,
    minTransaksi: 100000,
    berlakuSampai: "2026-05-15T23:59:59+07:00",
    kategori: "bundle",
    aktif: true,
  },
  {
    id: "promo-member-silver",
    nama: "Silver Welcome",
    kode: "SILVER5",
    deskripsi: "Khusus member Silver: diskon 5% layanan utama.",
    tipe: "persen",
    nilai: 5,
    minTransaksi: 0,
    berlakuSampai: "2026-06-01T23:59:59+07:00",
    kategori: "member",
    aktif: true,
  },
];

export const faqCatalog: FaqItem[] = [
  {
    id: "faq-1",
    kategori: "layanan",
    pertanyaan: "Dorm Care melayani area mana saja saat ini?",
    jawaban:
      "Untuk fase peluncuran, Dorm Care melayani area Surabaya dengan fokus operasional di Kecamatan Sukolilo dan sekitarnya.",
  },
  {
    id: "faq-2",
    kategori: "layanan",
    pertanyaan: "Apakah saya perlu menyiapkan alat kebersihan?",
    jawaban:
      "Tidak perlu. Tim Dorm Care membawa alat standar kebersihan. Jika ada preferensi cairan tertentu, bisa ditulis di catatan pesanan.",
  },
  {
    id: "faq-3",
    kategori: "pembayaran",
    pertanyaan: "Pembayaran di website ini asli atau simulasi?",
    jawaban:
      "Saat ini pembayaran masih prototype/simulasi, tetapi alurnya dibuat realistis agar siap untuk integrasi gateway final.",
  },
  {
    id: "faq-4",
    kategori: "jadwal",
    pertanyaan: "Berapa minimal waktu booking sebelum layanan dimulai?",
    jawaban:
      "Disarankan booking minimal 1 jam sebelum jadwal agar tim kami bisa menyiapkan slot dan personel terbaik.",
  },
  {
    id: "faq-5",
    kategori: "jadwal",
    pertanyaan: "Kalau mendadak ada kelas dan harus reschedule bagaimana?",
    jawaban:
      "Reschedule bisa dilakukan dari halaman riwayat selama status masih pending, diterima, atau menuju lokasi.",
  },
  {
    id: "faq-6",
    kategori: "area",
    pertanyaan: "Apakah ada biaya tambahan berdasarkan jarak?",
    jawaban:
      "Ada untuk layanan tertentu seperti special clean dan laundry antar-jemput, dengan opsi radius 5 km dan 10 km.",
  },
  {
    id: "faq-7",
    kategori: "akun",
    pertanyaan: "Kenapa nomor WhatsApp wajib diisi saat daftar?",
    jawaban:
      "Nomor WhatsApp dipakai untuk notifikasi booking, update status order, dan komunikasi cepat jika ada perubahan jadwal.",
  },
  {
    id: "faq-8",
    kategori: "akun",
    pertanyaan: "Bisakah login dengan Google tanpa isi form panjang?",
    jawaban:
      "Bisa. Google OAuth tersedia untuk login cepat. Namun user tetap diminta melengkapi nomor WhatsApp saat pertama kali masuk.",
  },
  {
    id: "faq-9",
    kategori: "pembayaran",
    pertanyaan: "Apakah bisa bayar lewat QRIS dan e-wallet nasional?",
    jawaban:
      "Bisa, tersedia simulasi QRIS, GoPay, ShopeePay, DANA, dan transfer bank nasional di halaman transaksi.",
  },
  {
    id: "faq-10",
    kategori: "layanan",
    pertanyaan: "Bagaimana kualitas mitra pembersihan Dorm Care?",
    jawaban:
      "Setiap mitra melalui proses onboarding SOP kebersihan, etika layanan, dan evaluasi berkala melalui rating pengguna.",
  },
];

export const membershipCatalog: MembershipCard[] = [
  {
    level: "bronze",
    title: "Bronze",
    subtitle: "Pelanggan baru",
    benefit: ["Room spray gratis bulan pertama", "Akses promo launch", "Notifikasi prioritas standar"],
  },
  {
    level: "silver",
    title: "Silver",
    subtitle: "Untuk 5+ order",
    benefit: ["Prioritas jadwal", "Diskon 5% layanan utama", "Voucher referral bulanan"],
  },
  {
    level: "gold",
    title: "Gold",
    subtitle: "Untuk 15+ order",
    benefit: ["Diskon 10% layanan utama", "Free pembersihan kipas/bulan", "Hotline admin prioritas"],
  },
];

export const testimonials: TestimoniItem[] = [
  {
    id: "t-1",
    nama: "Rizki M.",
    role: "Mahasiswa ITS",
    layanan: "Pro Basic Clean",
    rating: 5,
    ulasan:
      "Enak banget buat anak kos. Tinggal booking, tim datang tepat waktu, kamar langsung rapi tanpa ribet.",
  },
  {
    id: "t-2",
    nama: "Nabila A.",
    role: "Mahasiswa PENS",
    layanan: "Deep Clean",
    rating: 5,
    ulasan:
      "Bagian sudut kamar yang biasanya kelewat akhirnya bersih. Notifikasi WhatsApp-nya juga jelas.",
  },
  {
    id: "t-3",
    nama: "Fajar D.",
    role: "Mahasiswa PPNS",
    layanan: "Special Clean",
    rating: 5,
    ulasan:
      "Paket cleaning + laundry cocok buat jadwal padat. Admin responsif kalau ada perubahan jam.",
  },
  {
    id: "t-4",
    nama: "Dina S.",
    role: "Mahasiswa UNAIR",
    layanan: "Sahabat Manis",
    rating: 5,
    ulasan:
      "Paket bundling sekamar berdua sangat worth it! Harga hemat, hasilnya bersih. Tinggal duduk manis aja.",
  },
  {
    id: "t-5",
    nama: "Ardi W.",
    role: "Mahasiswa ITS",
    layanan: "Basic Clean",
    rating: 5,
    ulasan:
      "Cuma 20rb lantai udah bersih. Buat yang cuma butuh sapu pel doang, ini solusi paling murah.",
  },
  {
    id: "t-6",
    nama: "Putri K.",
    role: "Mahasiswa PENS",
    layanan: "Chemistry",
    rating: 5,
    ulasan:
      "Kamar, kamar mandi, kipas, piring — semua bersih sekaligus. Gak nyangka selengkap ini!",
  },
];

export const orderCatalog: OrderItem[] = [
  {
    id: "ord-1",
    orderId: "DC-882910",
    namaUser: "Rizki Mahendra",
    noHp: "6281231111001",
    layananId: "svc-deep-clean",
    layananNama: "Deep Clean",
    tanggal: "2026-04-14T09:00:00+07:00",
    total: 150000,
    metodePembayaran: "qris",
    status: "dikerjakan",
    mitra: "Agus P.",
    alamat: "Asrama Mahasiswa Blok C-402, Sukolilo",
    catatan: "Mohon fokus area balkon dan bawah kasur.",
    timeline: [
      { jam: "09:00", aktivitas: "Pesanan diterima sistem" },
      { jam: "09:10", aktivitas: "Mitra berangkat ke lokasi" },
      { jam: "09:35", aktivitas: "Mitra tiba dan mulai pembersihan" },
    ],
  },
  {
    id: "ord-2",
    orderId: "DC-882911",
    namaUser: "Siska Putri",
    noHp: "6281231111002",
    layananId: "svc-pro-basic-clean",
    layananNama: "Pro Basic Clean",
    tanggal: "2026-04-14T13:00:00+07:00",
    total: 35000,
    metodePembayaran: "ewallet",
    status: "menuju",
    mitra: "Maya L.",
    alamat: "Kos Putri Mawar Lt.2 No.8, Sukolilo",
    catatan: "Cuci kamar mandi lebih detail.",
    timeline: [
      { jam: "12:45", aktivitas: "Pesanan dikonfirmasi" },
      { jam: "12:55", aktivitas: "Mitra berangkat ke lokasi" },
    ],
  },
  {
    id: "ord-3",
    orderId: "DC-882912",
    namaUser: "Adit Wicaksono",
    noHp: "6281231111003",
    layananId: "svc-special-clean-5",
    layananNama: "Special Clean (5 km)",
    tanggal: "2026-04-13T10:00:00+07:00",
    total: 78000,
    metodePembayaran: "transfer",
    status: "selesai",
    mitra: "Rina S.",
    alamat: "Kos Harmoni Jl. Teknik Kimia, Sukolilo",
    catatan: "Laundry dicuci terpisah warna putih.",
    timeline: [
      { jam: "09:20", aktivitas: "Pesanan dikonfirmasi" },
      { jam: "09:40", aktivitas: "Mitra menuju lokasi" },
      { jam: "10:00", aktivitas: "Layanan dimulai" },
      { jam: "11:10", aktivitas: "Layanan selesai" },
    ],
  },
  {
    id: "ord-4",
    orderId: "DC-882913",
    namaUser: "Nadia Rahma",
    noHp: "6281231111004",
    layananId: "pkg-sahabat-manis",
    layananNama: "Sahabat Manis",
    tanggal: "2026-04-12T15:00:00+07:00",
    total: 38000,
    metodePembayaran: "qris",
    status: "dibatalkan",
    mitra: "-",
    alamat: "Asrama Putri PENS A-109",
    catatan: "Dibatalkan user karena jadwal ujian mendadak.",
    timeline: [
      { jam: "14:20", aktivitas: "Pesanan diterima" },
      { jam: "14:35", aktivitas: "Pesanan dibatalkan oleh user" },
    ],
  },
];

export const adminUsers: AdminUser[] = [
  {
    id: "usr-1",
    nama: "Rizki Mahendra",
    email: "rizki@kampus.ac.id",
    noHp: "6281231111001",
    membership: "silver",
    totalOrder: 8,
    totalBelanja: 456000,
    aktif: true,
    bergabung: "2026-02-08",
  },
  {
    id: "usr-2",
    nama: "Siska Putri",
    email: "siska@kampus.ac.id",
    noHp: "6281231111002",
    membership: "bronze",
    totalOrder: 3,
    totalBelanja: 121000,
    aktif: true,
    bergabung: "2026-03-02",
  },
  {
    id: "usr-3",
    nama: "Adit Wicaksono",
    email: "adit@kampus.ac.id",
    noHp: "6281231111003",
    membership: "gold",
    totalOrder: 19,
    totalBelanja: 1778000,
    aktif: true,
    bergabung: "2025-12-20",
  },
  {
    id: "usr-4",
    nama: "Nadia Rahma",
    email: "nadia@kampus.ac.id",
    noHp: "6281231111004",
    membership: "bronze",
    totalOrder: 1,
    totalBelanja: 38000,
    aktif: false,
    bergabung: "2026-04-01",
  },
];

export const reportDaily = [
  { hari: "Sen", pesanan: 12, pendapatan: 980000 },
  { hari: "Sel", pesanan: 16, pendapatan: 1230000 },
  { hari: "Rab", pesanan: 14, pendapatan: 1110000 },
  { hari: "Kam", pesanan: 21, pendapatan: 1670000 },
  { hari: "Jum", pesanan: 18, pendapatan: 1450000 },
  { hari: "Sab", pesanan: 24, pendapatan: 1880000 },
  { hari: "Min", pesanan: 15, pendapatan: 1190000 },
];

export const chatbotQuickReplies = [
  "Cara pesan",
  "Daftar harga",
  "Jadwal tersedia",
  "Hubungi admin",
];

export const whatsappContact = {
  nomor: "6281234567890",
  instagram: "https://instagram.com/dormcare",
  email: "contact@dormcare.id",
  area: "Kecamatan Sukolilo, Surabaya",
  jamOperasional: "Senin-Jumat 08.00-20.00, Sabtu 08.00-17.00",
};

export const dashboardNotifications = [
  "3 pesanan menunggu konfirmasi pembayaran.",
  "Promo DORMCARE15 akan berakhir 17 hari lagi.",
  "2 user baru mendaftar dalam 24 jam terakhir.",
];

export const notificationCatalog: NotificationItem[] = [
  {
    id: "notif-1",
    judul: "Order diterima",
    pesan: "Pesanan DC-882910 sudah diterima dan menunggu tim berangkat.",
    waktu: "2026-04-14T09:05:00+07:00",
    kategori: "order",
    sudahDibaca: false,
  },
  {
    id: "notif-2",
    judul: "Promo aktif",
    pesan: "Kode DORMCARE15 masih aktif untuk order berikutnya.",
    waktu: "2026-04-14T08:00:00+07:00",
    kategori: "promo",
    sudahDibaca: false,
  },
  {
    id: "notif-3",
    judul: "Akun berhasil diverifikasi",
    pesan: "Profil kalian sudah lengkap. Notifikasi WhatsApp akan aktif otomatis.",
    waktu: "2026-04-13T18:10:00+07:00",
    kategori: "akun",
    sudahDibaca: true,
  },
  {
    id: "notif-4",
    judul: "Order selesai",
    pesan: "Layanan Special Clean (5 km) selesai. Jangan lupa beri rating ya.",
    waktu: "2026-04-13T11:15:00+07:00",
    kategori: "order",
    sudahDibaca: true,
  },
];
