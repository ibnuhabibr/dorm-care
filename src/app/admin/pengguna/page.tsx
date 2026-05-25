'use client';

import { useMemo, useState, useEffect } from 'react';
import { Search, ShieldCheck, UserCog, Users, Star, TrendingUp, ChevronDown, ChevronUp, Calendar, Clock, Mail, Phone, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { AdminNav } from '@/components/admin-nav';
import { formatRupiah } from '@/lib/utils';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

type MembershipLevel = 'bronze' | 'silver' | 'gold';

interface UserData {
  id: string;
  nama: string;
  email: string;
  noHp: string;
  membership: MembershipLevel;
  totalOrder: number;
  totalBelanja: number;
  aktif: boolean;
  bergabung: string;
  lastOnline: string;
  orders: Array<{ id: string; serviceName: string; total: number; status: string; date: string }>;
}

const levelCycle: MembershipLevel[] = ['bronze', 'silver', 'gold'];

const membershipColor: Record<MembershipLevel, string> = {
  bronze: 'bg-amber-50 text-amber-700 border-amber-200',
  silver: 'bg-slate-100 text-slate-700 border-slate-200',
  gold: 'bg-yellow-50 text-yellow-700 border-yellow-200',
};

export default function AdminPenggunaPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [search, setSearch] = useState('');
  const [membership, setMembership] = useState<'semua' | MembershipLevel>('semua');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    setLoading(true);

    // Fetch profiles
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Gagal mengambil data pengguna: ' + error.message);
      setLoading(false);
      return;
    }

    if (profiles) {
      // Fetch orders for all users to compute stats
      const userIds = profiles.map((p: any) => p.id);
      const { data: allOrders } = await supabase
        .from('orders')
        .select('id, user_id, service_name, total_amount, status, created_at')
        .in('user_id', userIds)
        .order('created_at', { ascending: false });

      const ordersByUser: Record<string, Array<{ id: string; serviceName: string; total: number; status: string; date: string }>> = {};
      const totalsByUser: Record<string, number> = {};

      if (allOrders) {
        for (const o of allOrders) {
          const uid = o.user_id;
          if (!ordersByUser[uid]) ordersByUser[uid] = [];
          ordersByUser[uid].push({
            id: o.id,
            serviceName: o.service_name,
            total: o.total_amount || 0,
            status: o.status,
            date: new Date(o.created_at).toLocaleDateString('id-ID'),
          });
          totalsByUser[uid] = (totalsByUser[uid] || 0) + (o.total_amount || 0);
        }
      }

      const mapped: UserData[] = profiles.map((p: any) => ({
        id: p.id,
        nama: `${p.first_name || ''} ${p.last_name || ''}`.trim() || 'Tanpa Nama',
        email: p.email || '-',
        noHp: p.phone || '-',
        membership: (p.member_level as MembershipLevel) || 'bronze',
        totalOrder: ordersByUser[p.id]?.length || p.total_orders || 0,
        totalBelanja: totalsByUser[p.id] || 0,
        aktif: p.is_active !== false,
        bergabung: new Date(p.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        lastOnline: p.last_sign_in_at || p.updated_at
          ? new Date(p.last_sign_in_at || p.updated_at).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
          : 'Belum login',
        orders: ordersByUser[p.id] || [],
      }));

      setUsers(mapped);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const keyword = search.toLowerCase();
      const matchKeyword =
        user.nama.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword) ||
        user.noHp.toLowerCase().includes(keyword);
      const matchMembership = membership === 'semua' ? true : user.membership === membership;
      return matchKeyword && matchMembership;
    });
  }, [membership, search, users]);

  const stats = useMemo(() => ({
    total: users.length,
    active: users.filter(u => u.aktif).length,
    gold: users.filter(u => u.membership === 'gold').length,
    totalSpend: users.reduce((sum, u) => sum + u.totalBelanja, 0),
  }), [users]);

  const upgradeMembership = async (user: UserData) => {
    const supabase = getSupabaseBrowserClient();
    const index = levelCycle.indexOf(user.membership);
    const next = levelCycle[(index + 1) % levelCycle.length];

    if (supabase) {
      const { error } = await supabase
        .from('profiles')
        .update({ member_level: next })
        .eq('id', user.id);

      if (error) {
        toast.error('Gagal update membership');
        return;
      }
    }

    setUsers((prev) => prev.map((item) => (item.id === user.id ? { ...item, membership: next } : item)));
    toast.success(`Membership ${user.nama} diubah ke ${next}.`);
  };

  const toggleActive = async (id: string) => {
    const user = users.find(u => u.id === id);
    if (!user) return;

    const supabase = getSupabaseBrowserClient();
    const newActive = !user.aktif;

    if (supabase) {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: newActive })
        .eq('id', id);

      if (error) {
        toast.error('Gagal update status akun');
        return;
      }
    }

    setUsers((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        toast.success(newActive ? `Akun ${item.nama} diaktifkan.` : `Akun ${item.nama} dinonaktifkan.`);
        return { ...item, aktif: newActive };
      }),
    );
  };

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const toggleSelectAllVisible = () => {
    const visibleIds = filteredUsers.map((item) => item.id);
    const allVisibleSelected = visibleIds.every((id) => selectedIds.includes(id));
    if (allVisibleSelected) {
      setSelectedIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
    }
  };

  const bulkToggleActive = async (nextActive: boolean) => {
    if (selectedIds.length === 0) {
      toast.error('Pilih pengguna terlebih dulu.');
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (supabase) {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: nextActive })
        .in('id', selectedIds);

      if (error) {
        toast.error('Gagal update status akun');
        return;
      }
    }

    setUsers((prev) =>
      prev.map((item) => (selectedIds.includes(item.id) ? { ...item, aktif: nextActive } : item)),
    );
    toast.success(
      nextActive
        ? `${selectedIds.length} akun berhasil diaktifkan.`
        : `${selectedIds.length} akun berhasil dinonaktifkan.`,
    );
  };

  const bulkUpgradeMembership = async () => {
    if (selectedIds.length === 0) {
      toast.error('Pilih pengguna terlebih dulu.');
      return;
    }

    const supabase = getSupabaseBrowserClient();

    setUsers((prev) =>
      prev.map((item) => {
        if (!selectedIds.includes(item.id)) return item;
        const index = levelCycle.indexOf(item.membership);
        const next = levelCycle[(index + 1) % levelCycle.length];
        // Fire and forget update
        if (supabase) {
          supabase.from('profiles').update({ member_level: next }).eq('id', item.id);
        }
        return { ...item, membership: next };
      }),
    );
    toast.success(`Membership ${selectedIds.length} akun berhasil dinaikkan.`);
  };

  const allVisibleSelected =
    filteredUsers.length > 0 && filteredUsers.every((item) => selectedIds.includes(item.id));

  if (loading) {
    return (
      <div className="pb-20 pt-10">
        <section className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8">
          <p className="section-label">Admin Dorm Care</p>
          <h1 className="h2-title mt-2 text-neutral-900">Manajemen Pengguna</h1>
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
      <section className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8">
        <p className="section-label">Admin Dorm Care</p>
        <h1 className="h2-title mt-2 text-neutral-900">Manajemen Pengguna</h1>
        <p className="mt-2 text-neutral-600">Lihat performa user, atur status akun, dan upgrade membership dari satu panel.</p>
      </section>

      <AdminNav />

      {/* Stats */}
      <section className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Total Pengguna', value: stats.total, icon: <Users className="size-5" /> },
          { label: 'Akun Aktif', value: stats.active, icon: <UserCog className="size-5" /> },
          { label: 'Gold Member', value: stats.gold, icon: <Star className="size-5" /> },
          { label: 'Total Belanja', value: formatRupiah(stats.totalSpend), icon: <TrendingUp className="size-5" /> },
        ].map((s) => (
          <article key={s.label} className="rounded-2xl border border-neutral-200 bg-white p-4">
            <div className="flex items-center gap-2 text-neutral-500 mb-2">{s.icon}</div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-neutral-500">{s.label}</p>
            <p className="mt-2 text-2xl font-black text-neutral-900 truncate">{s.value}</p>
          </article>
        ))}
      </section>

      {/* Toolbar */}
      <section className="rounded-3xl border border-neutral-200 bg-white p-4 sm:p-5">
        <div className="grid gap-3 md:grid-cols-3">
          <label className="relative md:col-span-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari nama, email, atau nomor HP"
              className="h-11 w-full rounded-xl border border-neutral-200 pl-10 pr-3 text-sm outline-none ring-brand-primary/30 focus:ring"
            />
          </label>
          <select
            value={membership}
            onChange={(event) => setMembership(event.target.value as 'semua' | MembershipLevel)}
            className="h-11 rounded-xl border border-neutral-200 px-3 text-sm outline-none ring-brand-primary/30 focus:ring"
          >
            <option value="semua">Semua membership</option>
            <option value="bronze">Bronze</option>
            <option value="silver">Silver</option>
            <option value="gold">Gold</option>
          </select>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-neutral-100 pt-4">
          <button
            type="button"
            onClick={toggleSelectAllVisible}
            className="rounded-lg border border-neutral-200 px-3 py-2 text-xs font-semibold text-neutral-700"
          >
            {allVisibleSelected ? 'Batalkan pilih semua' : 'Pilih semua terlihat'}
          </button>
          <button
            type="button"
            onClick={() => bulkToggleActive(true)}
            disabled={selectedIds.length === 0}
            className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 disabled:opacity-30"
          >
            Aktifkan terpilih
          </button>
          <button
            type="button"
            onClick={() => bulkToggleActive(false)}
            disabled={selectedIds.length === 0}
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 disabled:opacity-30"
          >
            Nonaktifkan terpilih
          </button>
          <button
            type="button"
            onClick={bulkUpgradeMembership}
            disabled={selectedIds.length === 0}
            className="rounded-lg border border-brand-primary/20 bg-brand-primary-light px-3 py-2 text-xs font-semibold text-brand-primary-dark disabled:opacity-30"
          >
            Upgrade membership terpilih
          </button>
          <span className="ml-auto text-xs font-semibold uppercase tracking-[0.1em] text-neutral-500">
            Terpilih: {selectedIds.length}
          </span>
        </div>
      </section>

      {/* User Accordion List */}
      <section className="space-y-2">
        {filteredUsers.length === 0 ? (
          <div className="rounded-3xl border border-neutral-200 bg-white p-12 text-center">
            <Users className="size-12 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-500 font-semibold">Tidak ada pengguna yang sesuai filter.</p>
          </div>
        ) : (
          filteredUsers.map((user) => {
            const isOpen = expandedUser === user.id;
            return (
              <motion.article
                key={user.id}
                layout
                className={`rounded-2xl border bg-white transition-shadow ${
                  isOpen ? 'border-brand-primary/30 shadow-[0_4px_20px_rgba(14,166,115,0.08)]' : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                {/* Collapsed Row Header */}
                <button
                  type="button"
                  onClick={() => setExpandedUser(isOpen ? null : user.id)}
                  className="w-full flex items-center gap-3 p-4 text-left"
                >
                  {/* Checkbox (stop propagation so click doesn't toggle accordion) */}
                  <label
                    className="inline-flex items-center shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(user.id)}
                      onChange={() => toggleSelection(user.id)}
                      className="size-4 rounded border-neutral-300 text-brand-primary"
                      aria-label={`Pilih ${user.nama}`}
                    />
                  </label>

                  {/* Avatar Initial */}
                  <div className="size-10 rounded-xl bg-brand-primary-light/20 flex items-center justify-center shrink-0">
                    <span className="text-sm font-extrabold text-brand-primary">
                      {user.nama.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  {/* Name + Membership */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-neutral-900 truncate">{user.nama}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`inline-block rounded-full border px-2 py-0 text-[10px] font-bold uppercase ${membershipColor[user.membership]}`}>
                        {user.membership}
                      </span>
                      <span className="text-[10px] text-neutral-500">
                        {user.totalOrder} order
                      </span>
                    </div>
                  </div>

                  {/* Status dot */}
                  <span
                    className={`shrink-0 size-2.5 rounded-full ${
                      user.aktif ? 'bg-green-500' : 'bg-red-400'
                    }`}
                    title={user.aktif ? 'Aktif' : 'Nonaktif'}
                  />

                  {/* Expand chevron */}
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="shrink-0 text-neutral-400"
                  >
                    <ChevronDown className="size-5" />
                  </motion.span>
                </button>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-5 border-t border-neutral-100">
                        {/* Contact Info */}
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="size-4 text-neutral-400 shrink-0" />
                            <span className="text-neutral-600 truncate">{user.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="size-4 text-neutral-400 shrink-0" />
                            <span className="text-neutral-600">{user.noHp}</span>
                          </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="mt-4 grid gap-3 sm:grid-cols-4">
                          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-neutral-500">Membership</p>
                            <span className={`mt-1 inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${membershipColor[user.membership]}`}>
                              {user.membership}
                            </span>
                          </div>
                          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-neutral-500">Total Order</p>
                            <p className="mt-1 text-sm font-bold text-neutral-900">{user.totalOrder}</p>
                          </div>
                          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-neutral-500">Total Belanja</p>
                            <p className="mt-1 text-sm font-bold text-neutral-900">{formatRupiah(user.totalBelanja)}</p>
                          </div>
                          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-neutral-500">Bergabung</p>
                            <p className="mt-1 text-xs font-bold text-neutral-900 flex items-center gap-1">
                              <Calendar className="size-3 text-neutral-400" />
                              {user.bergabung}
                            </p>
                          </div>
                        </div>

                        {/* Last Online */}
                        <div className="mt-3 flex items-center gap-1 text-xs text-neutral-500">
                          <Clock className="size-3" />
                          Terakhir online: {user.lastOnline}
                        </div>

                        {/* Order History */}
                        {user.orders.length > 0 && (
                          <div className="mt-3 border-t border-neutral-100 pt-3">
                            <p className="text-xs font-semibold text-neutral-500 mb-2">
                              <ShoppingBag className="size-3 inline mr-1" />
                              Riwayat Pesanan ({user.orders.length})
                            </p>
                            <div className="space-y-1 max-h-48 overflow-y-auto">
                              {user.orders.slice(0, 10).map((o) => (
                                <div key={o.id} className="flex items-center justify-between text-xs py-1.5 px-2 rounded-lg bg-neutral-50">
                                  <div>
                                    <span className="font-semibold text-neutral-900">{o.serviceName}</span>
                                    <span className="text-neutral-500 ml-2">{o.date}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-neutral-500 capitalize">{o.status.replace(/_/g, ' ')}</span>
                                    <span className="font-bold text-neutral-900">{formatRupiah(o.total)}</span>
                                  </div>
                                </div>
                              ))}
                              {user.orders.length > 10 && (
                                <p className="text-xs text-neutral-500 text-center py-1">+ {user.orders.length - 10} pesanan lainnya</p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="mt-4 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); upgradeMembership(user); }}
                            className="inline-flex h-9 items-center gap-2 rounded-xl border border-brand-primary/20 bg-brand-primary-light px-3 text-xs font-semibold text-brand-primary-dark hover:bg-brand-primary/10 transition"
                          >
                            <ShieldCheck className="size-3.5" />
                            Upgrade membership
                          </button>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); toggleActive(user.id); }}
                            className="inline-flex h-9 items-center gap-2 rounded-xl border border-neutral-200 px-3 text-xs font-semibold text-neutral-700 hover:border-neutral-300 transition"
                          >
                            <UserCog className="size-3.5" />
                            {user.aktif ? 'Nonaktifkan akun' : 'Aktifkan akun'}
                          </button>
                          <span className="ml-auto text-[10px] text-neutral-400 self-center">
                            ID: {user.id.slice(0, 8)}...
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            );
          })
        )}
      </section>
    </div>
  );
}
