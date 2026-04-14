"use client";

import { useMemo, useState } from "react";
import { Search, ShieldCheck, UserCog } from "lucide-react";
import toast from "react-hot-toast";

import { AdminNav } from "@/components/admin-nav";
import { adminUsers, type AdminUser, type MembershipLevel } from "@/data/site-data";
import { formatRupiah } from "@/lib/utils";

const levelCycle: MembershipLevel[] = ["bronze", "silver", "gold"];

export default function AdminPenggunaPage() {
  const [users, setUsers] = useState(adminUsers);
  const [search, setSearch] = useState("");
  const [membership, setMembership] = useState<"semua" | MembershipLevel>("semua");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const keyword = search.toLowerCase();
      const matchKeyword =
        user.nama.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword) ||
        user.noHp.toLowerCase().includes(keyword);
      const matchMembership = membership === "semua" ? true : user.membership === membership;
      return matchKeyword && matchMembership;
    });
  }, [membership, search, users]);

  const upgradeMembership = (user: AdminUser) => {
    const index = levelCycle.indexOf(user.membership);
    const next = levelCycle[(index + 1) % levelCycle.length];
    setUsers((prev) => prev.map((item) => (item.id === user.id ? { ...item, membership: next } : item)));
    toast.success(`Membership ${user.nama} diubah ke ${next}.`);
  };

  const toggleActive = (id: string) => {
    setUsers((prev) =>
      prev.map((item) => {
        if (item.id !== id) {
          return item;
        }
        toast.success(item.aktif ? `Akun ${item.nama} dinonaktifkan.` : `Akun ${item.nama} diaktifkan.`);
        return { ...item, aktif: !item.aktif };
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
      return;
    }

    setSelectedIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
  };

  const bulkToggleActive = (nextActive: boolean) => {
    if (selectedIds.length === 0) {
      toast.error("Pilih pengguna terlebih dulu.");
      return;
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

  const bulkUpgradeMembership = () => {
    if (selectedIds.length === 0) {
      toast.error("Pilih pengguna terlebih dulu.");
      return;
    }

    setUsers((prev) =>
      prev.map((item) => {
        if (!selectedIds.includes(item.id)) {
          return item;
        }

        const index = levelCycle.indexOf(item.membership);
        const next = levelCycle[(index + 1) % levelCycle.length];
        return { ...item, membership: next };
      }),
    );
    toast.success(`Membership ${selectedIds.length} akun berhasil dinaikkan.`);
  };

  const allVisibleSelected =
    filteredUsers.length > 0 && filteredUsers.every((item) => selectedIds.includes(item.id));

  return (
    <div className="space-y-6 pb-20 pt-10">
      <section className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8">
        <p className="section-label">Admin Dorm Care</p>
        <h1 className="h2-title mt-2 text-neutral-900">Manajemen Pengguna</h1>
        <p className="mt-2 text-neutral-600">Lihat performa user, atur status akun, dan upgrade membership dari satu panel.</p>
      </section>

      <AdminNav />

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
            onChange={(event) => setMembership(event.target.value as "semua" | MembershipLevel)}
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
            {allVisibleSelected ? "Batalkan pilih semua" : "Pilih semua terlihat"}
          </button>
          <button
            type="button"
            onClick={() => bulkToggleActive(true)}
            className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs font-semibold text-green-700"
          >
            Aktifkan terpilih
          </button>
          <button
            type="button"
            onClick={() => bulkToggleActive(false)}
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700"
          >
            Nonaktifkan terpilih
          </button>
          <button
            type="button"
            onClick={bulkUpgradeMembership}
            className="rounded-lg border border-brand-primary/20 bg-brand-primary-light px-3 py-2 text-xs font-semibold text-brand-primary-dark"
          >
            Upgrade membership terpilih
          </button>
          <span className="ml-auto text-xs font-semibold uppercase tracking-[0.1em] text-neutral-500">
            Terpilih: {selectedIds.length}
          </span>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {filteredUsers.map((user) => (
          <article key={user.id} className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <label className="mt-1 inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(user.id)}
                    onChange={() => toggleSelection(user.id)}
                    className="size-4 rounded border-neutral-300 text-brand-primary"
                    aria-label={`Pilih ${user.nama}`}
                  />
                </label>
                <div>
                <h2 className="text-xl font-black text-neutral-900">{user.nama}</h2>
                <p className="text-sm text-neutral-600">{user.email}</p>
                <p className="text-xs text-neutral-500">{user.noHp}</p>
                </div>
              </div>
              <span
                className={`rounded-lg px-2.5 py-1 text-xs font-bold uppercase tracking-[0.1em] ${
                  user.aktif ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}
              >
                {user.aktif ? "Aktif" : "Nonaktif"}
              </span>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-neutral-500">Membership</p>
                <p className="mt-1 text-sm font-bold text-neutral-900">{user.membership}</p>
              </div>
              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-neutral-500">Total Order</p>
                <p className="mt-1 text-sm font-bold text-neutral-900">{user.totalOrder}</p>
              </div>
              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-neutral-500">Belanja</p>
                <p className="mt-1 text-sm font-bold text-neutral-900">{formatRupiah(user.totalBelanja)}</p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => upgradeMembership(user)}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-brand-primary/20 bg-brand-primary-light px-3 text-sm font-semibold text-brand-primary-dark hover:bg-brand-primary-light"
              >
                <ShieldCheck className="size-4" />
                Upgrade membership
              </button>
              <button
                type="button"
                onClick={() => toggleActive(user.id)}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-neutral-200 px-3 text-sm font-semibold text-neutral-700 hover:border-neutral-300"
              >
                <UserCog className="size-4" />
                {user.aktif ? "Nonaktifkan akun" : "Aktifkan akun"}
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
