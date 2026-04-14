"use client";

import { useState, useEffect } from "react";
import { User, Shield, Bell, Award, CheckCircle2, ChevronRight, LogOut, Camera, Lock, KeyRound } from "lucide-react";
import toast from "react-hot-toast";
import { useSessionStore } from "@/state/session-store";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const tabs = [
  { id: "personal", label: "Informasi Pribadi", icon: User },
  { id: "security", label: "Keamanan", icon: Shield },
  { id: "notifications", label: "Notifikasi", icon: Bell },
  { id: "membership", label: "Level & Benefit", icon: Award },
];

export default function ProfilPage() {
  const router = useRouter();
  const { user, clearUser } = useSessionStore();
  const [activeTab, setActiveTab] = useState("personal");

  // Base profile data
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Stats from PG
  const [stats, setStats] = useState({
    level: "Bronze",
    totalOrders: 0,
    totalSpent: "Rp 0",
    joinDate: "Loading...",
    nextLevelCriteria: 5,
    benefits: ["Room spray gratis 1x"]
  });

  useEffect(() => {
    if (user) {
      const parts = user.nama.split(" ");
      setFirstName(parts[0] || "");
      setLastName(parts.slice(1).join(" ") || "");
      setPhone(user.noHp || "");
      setEmail(user.email || "");

      const fetchStats = async () => {
        const supabase = getSupabaseBrowserClient();
        if (!supabase) return;

        const { data } = await supabase
          .from("profiles")
          .select("member_level, total_orders, total_spent, created_at")
          .eq("id", user.id)
          .single();

        if (data) {
          const levelMap: Record<string, string> = {
            bronze: "Bronze",
            silver: "Silver",
            gold: "Gold"
          };
          const tOrders = data.total_orders || 0;
          let nextLevel = 5 - tOrders;
          if (data.member_level === "silver") nextLevel = 15 - tOrders;
          if (data.member_level === "gold") nextLevel = 0;

          setStats({
            level: levelMap[data.member_level] || "Bronze",
            totalOrders: tOrders,
            totalSpent: `Rp ${(data.total_spent || 0).toLocaleString("id-ID")}`,
            joinDate: new Date(data.created_at).toLocaleDateString("id-ID", { month: "long", year: "numeric" }),
            nextLevelCriteria: Math.max(0, nextLevel),
            benefits: data.member_level === "gold" ? ["Diskon otomatis", "Prioritas jadwal"] : ["Room spray gratis"]
          });
        }
      };

      if (user.id) {
        void fetchStats();
      }
    }
  }, [user]);

  // Tab 2: Security
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Tab 3: Notifications
  const [notifWa, setNotifWa] = useState(true);
  const [notifEmail, setNotifEmail] = useState(false);
  const [notifReminder, setNotifReminder] = useState(true);

  const initial = firstName ? firstName.charAt(0) : "U";

  const handleSavePersonal = async () => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase || !user?.id) {
      toast.error("Sistem database tidak terhubung.");
      return;
    }
    
    // Save to profiles table
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      first_name: firstName,
      last_name: lastName,
      phone: phone
    });

    if (error) {
      toast.error("Gagal menyimpan ke database: " + error.message);
      return;
    }

    // Update Zustand local store
    useSessionStore.getState().updateUser({
      nama: `${firstName} ${lastName}`.trim(),
      noHp: phone
    });

    // Sync metadata to auth.users for consistency
    await supabase.auth.updateUser({
      data: {
        first_name: firstName,
        last_name: lastName,
        whatsapp: phone
      }
    });

    toast.success("Informasi pribadi berhasil diperbarui!");
  };

  const handleSaveSecurity = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Konfirmasi password tidak cocok!");
      return;
    }
    const supabase = getSupabaseBrowserClient();
    if (supabase) {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        toast.error("Gagal mengubah password: " + error.message);
        return;
      }
    }
    toast.success("Password berhasil diubah!");
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleLogout = async () => {
    const supabase = getSupabaseBrowserClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    clearUser();
    toast.success("Berhasil keluar.");
    router.push("/");
  };

  return (
    <div className="pb-24 pt-8 bg-surface-base min-h-screen">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">

        {/* Header (Mobile Only) */}
        <div className="mb-6 lg:hidden">
          <h1 className="font-display text-3xl font-extrabold text-neutral-900">Profil Saya</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* SIDEBAR */}
          <aside className="w-full lg:w-[320px] shrink-0 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-neutral-200 text-center shadow-sm">
              <div className="relative inline-block mb-4">
                <div className="size-24 rounded-full bg-brand-primary text-white font-display text-4xl font-bold flex items-center justify-center shadow-[0_8px_24px_rgba(14,166,115,0.3)] mx-auto">
                  {initial}
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full border border-neutral-200 text-neutral-600 hover:text-brand-primary shadow-sm transition">
                  <Camera className="size-4" />
                </button>
              </div>
              <h2 className="font-display text-xl font-bold text-neutral-900">{firstName} {lastName}</h2>
              <p className="text-sm text-neutral-500 mb-6">{email}</p>

              <div className="bg-gradient-to-br from-[#CD7F32] to-[#B87333] rounded-2xl p-5 text-white text-left relative overflow-hidden mb-6">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 blur-[30px] rounded-full" />
                 <div className="flex items-center gap-3 mb-4">
                   <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                     <Award className="size-6 text-white drop-shadow-sm" />
                   </div>
                   <div>
                     <p className="text-[10px] font-bold uppercase tracking-widest text-white/80">Member Level</p>
                     <p className="font-display font-bold text-xl drop-shadow-sm">{stats.level}</p>
                   </div>
                 </div>

                 <div className="space-y-2 mb-4">
                   <div className="flex justify-between text-xs font-bold text-white/90">
                     <span>Progress</span>
                     <span>{stats.nextLevelCriteria} pesanan lagi</span>
                   </div>
                   <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden">
                     <div className="bg-white h-full w-[60%] rounded-full relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent w-full scan-line" />
                     </div>
                   </div>
                   <p className="text-[10px] text-white/70">Menuju Silver Member</p>
                 </div>

                 <div className="pt-3 border-t border-white/20">
                   <p className="text-[10px] font-bold uppercase tracking-widest text-white/80 mb-2">Benefit Aktif</p>
                   <ul className="text-xs space-y-1">
                     {stats.benefits.map((b, i) => (
                       <li key={i} className="flex items-center gap-1.5"><CheckCircle2 className="size-3" /> {b}</li>
                     ))}
                   </ul>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-left">
                <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-100">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">Pesanan</p>
                  <p className="font-display text-lg font-extrabold text-neutral-900">{stats.totalOrders}</p>
                </div>
                <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-100">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">Pengeluaran</p>
                  <p className="font-display text-lg font-extrabold text-neutral-900">{stats.totalSpent}</p>
                </div>
              </div>
              <p className="text-[10px] text-neutral-400 mt-4">Bergabung sejak {stats.joinDate}</p>
            </div>

            <button 
              onClick={handleLogout}
              className="w-full flex justify-between items-center bg-white rounded-2xl p-4 border border-red-100 text-error font-bold shadow-sm hover:bg-red-50 transition"
            >
              <span className="flex items-center gap-3"><LogOut className="size-5" /> Keluar Akun</span>
              <ChevronRight className="size-4 opacity-50" />
            </button>
          </aside>

          {/* MAIN CONTENT */}
          <div className="flex-1 w-full bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
            
            {/* Tabs Header */}
            <div className="flex border-b border-neutral-200 overflow-x-auto hide-scrollbar">
              {tabs.map(tab => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-all ${
                      isActive ? "border-brand-primary text-brand-primary bg-brand-primary-light/5" : "border-transparent text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
                    }`}
                  >
                    <Icon className={`size-4 ${isActive ? "text-brand-primary" : "text-neutral-400"}`} /> {tab.label}
                  </button>
                )
              })}
            </div>

            {/* Tab content wrapper */}
            <div className="p-6 md:p-10 animate-fade-in min-h-[500px]">
              
              {activeTab === "personal" && (
                <div className="max-w-2xl">
                  <div className="mb-8">
                    <h2 className="font-display text-2xl font-bold text-neutral-900 mb-2">Informasi Pribadi</h2>
                    <p className="text-sm text-neutral-500">Perbarui detail profil kamu dan informasi kontak WhatsApp.</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-5 mb-5">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2 block">Nama Depan</label>
                      <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm outline-none transition focus:border-brand-primary focus:bg-white focus:ring-4 focus:ring-brand-primary/10" />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2 block">Nama Belakang</label>
                      <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm outline-none transition focus:border-brand-primary focus:bg-white focus:ring-4 focus:ring-brand-primary/10" />
                    </div>
                  </div>

                  <div className="mb-5">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2 block">No Handphone (WhatsApp)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-neutral-500 border-r border-neutral-200 pr-3">+62</span>
                      <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-3 pl-[3.5rem] pr-4 text-sm outline-none transition focus:border-brand-primary focus:bg-white focus:ring-4 focus:ring-brand-primary/10" />
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-1.5 ml-1">Order dan notifikasi akan dikirimkan ke nomor WA ini.</p>
                  </div>

                  <div className="mb-8">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2 block">Alamat Email</label>
                    <input type="email" value={email} disabled className="w-full rounded-xl border border-neutral-100 bg-neutral-100 px-4 py-3 text-sm outline-none text-neutral-500 cursor-not-allowed" />
                    <p className="text-[11px] text-brand-accent mt-1.5 ml-1 flex items-center gap-1"><Lock className="size-3" /> Email ditautkan dari akun Google</p>
                  </div>

                  <button onClick={handleSavePersonal} className="rounded-xl bg-brand-primary text-white text-sm font-bold px-8 py-3.5 shadow-brand transition hover:bg-brand-primary-dark">
                    Simpan Perubahan
                  </button>
                </div>
              )}

              {activeTab === "security" && (
                <div className="max-w-xl">
                  <div className="mb-8">
                    <h2 className="font-display text-2xl font-bold text-neutral-900 mb-2">Keamanan Akun</h2>
                    <p className="text-sm text-neutral-500">Amankan akun dengan memperbarui kata sandi secara berkala.</p>
                  </div>

                  <div className="space-y-5 mb-8">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2 flex items-center gap-2"><KeyRound className="size-3" /> Password Lama</label>
                      <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm outline-none transition focus:border-brand-primary focus:bg-white focus:ring-4 focus:ring-brand-primary/10" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2 block">Password Baru</label>
                        <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm outline-none transition focus:border-brand-primary focus:bg-white focus:ring-4 focus:ring-brand-primary/10" />
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2 block">Konfirmasi Password Baru</label>
                        <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm outline-none transition focus:border-brand-primary focus:bg-white focus:ring-4 focus:ring-brand-primary/10" />
                      </div>
                    </div>
                  </div>

                  {/* Password requirement hints */}
                  <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 mb-8">
                     <p className="text-xs font-bold text-blue-900 mb-2 uppercase tracking-wide">Syarat Kata Sandi Unik</p>
                     <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside ml-4 marker:text-blue-300">
                       <li>Minimal 8 karakter</li>
                       <li>Mengandung paling sedikit 1 huruf besar & 1 angka</li>
                     </ul>
                  </div>

                  <button onClick={handleSaveSecurity} className="rounded-xl bg-brand-primary text-white text-sm font-bold px-8 py-3.5 shadow-brand transition hover:bg-brand-primary-dark">
                    Perbarui Password
                  </button>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="max-w-2xl">
                  <div className="mb-8">
                    <h2 className="font-display text-2xl font-bold text-neutral-900 mb-2">Pengaturan Notifikasi</h2>
                    <p className="text-sm text-neutral-500">Pilih info apa saja yang ingin kamu terima dari Dorm Care.</p>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center justify-between p-5 border border-neutral-200 rounded-2xl hover:bg-neutral-50 transition cursor-pointer">
                      <div>
                        <p className="font-bold text-neutral-900 mb-0.5">Notifikasi WhatsApp (Penting)</p>
                        <p className="text-xs text-neutral-500">Pembaruan status pesanan, invoice, dan saat mitra menuju lokasi kos.</p>
                      </div>
                      <div className="relative">
                        <input type="checkbox" className="peer sr-only" checked={notifWa} onChange={() => setNotifWa(!notifWa)} />
                        <div className="h-6 w-11 rounded-full bg-neutral-200 transition peer-checked:bg-brand-primary"></div>
                        <div className="absolute left-[2px] top-[2px] h-5 w-5 rounded-full bg-white transition peer-checked:translate-x-full"></div>
                      </div>
                    </label>

                    <label className="flex items-center justify-between p-5 border border-neutral-200 rounded-2xl hover:bg-neutral-50 transition cursor-pointer">
                      <div>
                        <p className="font-bold text-neutral-900 mb-0.5">Pengingat Jadwal Pembersihan</p>
                        <p className="text-xs text-neutral-500">Dapatkan notifikasi H-1 sebelum mitra Dorm Care membersihkan kamar.</p>
                      </div>
                      <div className="relative">
                        <input type="checkbox" className="peer sr-only" checked={notifReminder} onChange={() => setNotifReminder(!notifReminder)} />
                        <div className="h-6 w-11 rounded-full bg-neutral-200 transition peer-checked:bg-brand-primary"></div>
                        <div className="absolute left-[2px] top-[2px] h-5 w-5 rounded-full bg-white transition peer-checked:translate-x-full"></div>
                      </div>
                    </label>

                    <label className="flex items-center justify-between p-5 border border-neutral-200 rounded-2xl hover:bg-neutral-50 transition cursor-pointer opacity-70">
                      <div>
                        <p className="font-bold text-neutral-900 mb-0.5">Email Promosi (Newsletter)</p>
                        <p className="text-xs text-neutral-500">Promo khusus bulanan, event mahasiswa, dan update fitur baru.</p>
                      </div>
                      <div className="relative">
                        <input type="checkbox" className="peer sr-only" checked={notifEmail} onChange={() => setNotifEmail(!notifEmail)} />
                        <div className="h-6 w-11 rounded-full bg-neutral-200 transition peer-checked:bg-brand-primary"></div>
                        <div className="absolute left-[2px] top-[2px] h-5 w-5 rounded-full bg-white transition peer-checked:translate-x-full"></div>
                      </div>
                    </label>
                  </div>
                  
                  <div className="mt-8 text-right">
                    <p className="text-xs text-brand-primary font-bold">Semua perubahan otomatis tersimpan.</p>
                  </div>
                </div>
              )}

              {activeTab === "membership" && (
                <div className="w-full">
                  <div className="mb-6">
                    <h2 className="font-display text-2xl font-bold text-neutral-900 mb-2">Detail Level Member</h2>
                    <p className="text-sm text-neutral-500 max-w-2xl">Makin sering memesan layanan Dorm Care, makin banyak benefit dan voucher diskon yang terbuka buatmu.</p>
                  </div>

                  <div className="overflow-x-auto pb-4">
                    <table className="w-full min-w-[700px] border-collapse text-sm text-left">
                      <thead>
                        <tr>
                          <th className="bg-neutral-50 border-y border-neutral-200 p-4 font-bold text-neutral-900 rounded-tl-2xl">Benefit Eksklusif</th>
                          <th className="bg-gradient-to-b from-[#CD7F32]/10 to-transparent border-t border-[#CD7F32]/20 p-4 text-center">
                            <span className="block font-display font-extrabold text-[#A0522D] text-lg">Bronze</span>
                            <span className="text-[10px] font-bold uppercase text-[#CD7F32] tracking-wider">0-5 Pesanan</span>
                          </th>
                          <th className="bg-gradient-to-b from-neutral-200/50 to-transparent border-t border-neutral-300 p-4 text-center">
                             <span className="block font-display font-extrabold text-neutral-700 text-lg">Silver</span>
                             <span className="text-[10px] font-bold uppercase text-neutral-500 tracking-wider">6-15 Pesanan</span>
                          </th>
                          <th className="bg-gradient-to-b from-[#FFD700]/10 to-transparent border-t border-[#FFD700]/30 p-4 text-center rounded-tr-2xl">
                             <span className="block font-display font-extrabold text-[#D4AF37] text-lg">Gold</span>
                             <span className="text-[10px] font-bold uppercase text-[#D4AF37] tracking-wider">16+ Pesanan</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100">
                        <tr>
                          <td className="p-4 font-medium text-neutral-800">Room Spray Premium</td>
                          <td className="p-4 text-center font-bold text-neutral-500">1x / bln</td>
                          <td className="p-4 text-center font-bold text-brand-primary">2x / bln</td>
                          <td className="p-4 text-center font-extrabold text-brand-primary">Layanan Apapun</td>
                        </tr>
                        <tr>
                          <td className="p-4 font-medium text-neutral-800">Prioritas Jadwal Sibuk</td>
                          <td className="p-4 text-center text-neutral-300">-</td>
                          <td className="p-4 text-center text-brand-primary"><CheckCircle2 className="size-5 mx-auto" /></td>
                          <td className="p-4 text-center text-brand-primary"><CheckCircle2 className="size-5 mx-auto" /></td>
                        </tr>
                        <tr>
                          <td className="p-4 font-medium text-neutral-800">Diskon Layanan Utama</td>
                          <td className="p-4 text-center text-neutral-300">-</td>
                          <td className="p-4 text-center font-bold text-brand-primary">5%</td>
                          <td className="p-4 text-center font-extrabold text-brand-primary">10%</td>
                        </tr>
                        <tr>
                          <td className="p-4 font-medium text-neutral-800">Gratis Cuci Kipas Angin</td>
                          <td className="p-4 text-center text-neutral-300">-</td>
                          <td className="p-4 text-center text-neutral-300">-</td>
                          <td className="p-4 text-center font-extrabold text-brand-primary">1x / bln</td>
                        </tr>
                        <tr>
                          <td className="p-4 font-medium text-neutral-800">Layanan Hotline 24/7</td>
                          <td className="p-4 text-center text-neutral-300">-</td>
                          <td className="p-4 text-center text-neutral-300">-</td>
                          <td className="p-4 text-center text-brand-primary"><CheckCircle2 className="size-5 mx-auto" /></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
