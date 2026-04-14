"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, ChevronDown, LogOut, Menu, ShieldCheck, Sparkles, User, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";

import { navLinks, notificationCatalog } from "@/data/site-data";
import { cn } from "@/lib/utils";
import { useSessionStore } from "@/state/session-store";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useSessionStore();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const initial = useMemo(() => user?.nama?.charAt(0).toUpperCase() ?? "U", [user]);
  const unreadNotifications = useMemo(
    () => notificationCatalog.filter((item) => !item.sudahDibaca).length,
    [],
  );
  const recentNotifs = useMemo(() => notificationCatalog.slice(0, 5), []);

  // Scroll behavior
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    if (supabase) await supabase.auth.signOut();
    logout();
    toast.success("Berhasil keluar dari akun.");
    setDropdownOpen(false);
  }, [logout]);

  // Don't render navbar on admin routes
  if (pathname.startsWith("/admin")) return null;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-all duration-300",
        scrolled
          ? "border-neutral-200 bg-white/90 shadow-sm backdrop-blur-xl"
          : "border-transparent bg-white/70 backdrop-blur-xl",
      )}
    >
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center">
          <Image 
            src="/logo.webp" 
            alt="Dorm Care" 
            width={160} 
            height={48} 
            className="h-10 w-auto object-contain transition group-hover:opacity-90" 
            priority
          />
        </Link>

        <nav className="hidden items-center gap-5 lg:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative py-2 text-sm font-semibold transition",
                  active
                    ? "text-brand-primary"
                    : "text-neutral-600 hover:text-neutral-900",
                )}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute -bottom-1 left-0 h-0.5 bg-brand-primary transition-all duration-300",
                    active ? "w-full" : "w-0",
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {/* Notification Bell */}
          <div ref={notifRef} className="relative">
            <button
              type="button"
              onClick={() => { setNotifOpen((prev) => !prev); setDropdownOpen(false); }}
              aria-label="Notifikasi"
              className="relative grid size-10 place-content-center rounded-xl border border-neutral-200 text-neutral-600 transition hover:border-brand-primary/30 hover:text-brand-primary"
            >
              <Bell className="size-4" />
              {unreadNotifications > 0 && (
                <span className="absolute -right-1 -top-1 grid size-5 place-content-center rounded-full bg-error text-[10px] font-bold text-white">
                  {unreadNotifications}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-80 rounded-2xl border border-neutral-200 bg-white p-2 shadow-lg"
                >
                  <div className="flex items-center justify-between px-3 py-2">
                    <p className="text-sm font-bold text-neutral-900">Notifikasi</p>
                    <span className="text-[10px] font-bold text-brand-primary">{unreadNotifications} baru</span>
                  </div>
                  <div className="max-h-72 space-y-1 overflow-y-auto">
                    {recentNotifs.map((notif) => (
                      <div
                        key={notif.id}
                        className={cn(
                          "rounded-xl px-3 py-2.5 text-sm transition",
                          notif.sudahDibaca
                            ? "text-neutral-500"
                            : "bg-brand-primary-light/20 font-medium text-neutral-900",
                        )}
                      >
                        <p className="text-xs font-bold">{notif.judul}</p>
                        <p className="mt-0.5 text-[11px] text-neutral-500 line-clamp-1">{notif.pesan}</p>
                      </div>
                    ))}
                  </div>
                  <Link
                    href="/notifikasi"
                    onClick={() => setNotifOpen(false)}
                    className="mt-1 block rounded-xl px-3 py-2 text-center text-xs font-bold text-brand-primary transition hover:bg-brand-primary-light/20"
                  >
                    Lihat semua notifikasi →
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {user ? (
            <div ref={dropdownRef} className="relative">
              <button
                type="button"
                onClick={() => { setDropdownOpen((prev) => !prev); setNotifOpen(false); }}
                className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 transition hover:border-brand-primary/30"
              >
                <span className="grid size-8 place-content-center rounded-full bg-brand-primary text-sm font-bold text-white">
                  {initial}
                </span>
                <div className="text-left">
                  <p className="text-sm font-semibold text-neutral-800">{user.nama.split(" ")[0]}</p>
                  <p className="text-[11px] text-neutral-500">{user.membership.toUpperCase()}</p>
                </div>
                <ChevronDown className={cn("size-4 text-neutral-500 transition-transform", dropdownOpen && "rotate-180")} />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-52 rounded-xl border border-neutral-200 bg-white p-2 shadow-lg"
                  >
                    <Link
                      href="/profil"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                    >
                      <User className="size-4" /> Profil
                    </Link>
                    <Link
                      href="/riwayat"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                    >
                      <ShieldCheck className="size-4" /> Riwayat
                    </Link>
                    <Link
                      href="/notifikasi"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                    >
                      <Bell className="size-4" /> Notifikasi
                    </Link>
                    {user.role === "admin" ? (
                      <Link
                        href="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                      >
                        <ShieldCheck className="size-4" /> Admin Panel
                      </Link>
                    ) : null}
                    <div className="my-1 h-px bg-neutral-100" />
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-error hover:bg-red-50"
                    >
                      <LogOut className="size-4" /> Keluar
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link
                href="/auth/masuk"
                className="rounded-xl border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:border-brand-primary/30 hover:text-brand-primary btn-press"
              >
                Masuk
              </Link>
              <Link
                href="/auth/daftar"
                className="rounded-xl bg-brand-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-primary-dark btn-press"
              >
                Daftar
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="grid size-10 place-content-center rounded-xl border border-neutral-200 text-neutral-700 lg:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[100] bg-neutral-900/60 backdrop-blur-sm lg:hidden"
              onClick={() => setOpen(false)}
            />

            {/* Sidebar Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-[101] flex w-[320px] max-w-[85vw] flex-col bg-white shadow-2xl lg:hidden"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-neutral-100 bg-neutral-50 px-6 py-5">
                {user ? (
                  <div className="flex items-center gap-3">
                    <span className="grid size-11 shrink-0 place-content-center rounded-full bg-brand-primary font-bold text-white shadow-sm">
                      {initial}
                    </span>
                    <div>
                      <h4 className="font-bold text-neutral-900">{user.nama}</h4>
                      <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                        {user.membership} Member
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="grid size-11 shrink-0 place-content-center rounded-full bg-brand-primary-light/50 text-brand-primary">
                      <User className="size-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-neutral-900">Halo, Tamu</h4>
                      <p className="text-xs text-neutral-500">Masuk untuk memesan</p>
                    </div>
                  </div>
                )}
                
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="grid size-8 place-content-center rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Drawer Navigation Links */}
              <div className="flex-1 overflow-y-auto px-6 py-6">
                <nav className="flex flex-col gap-2">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-neutral-400">Navigasi Utama</p>
                  {navLinks.map((link) => {
                    const active = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "rounded-xl px-4 py-3 text-sm font-semibold transition-all",
                          active 
                            ? "bg-brand-primary text-white shadow-md shadow-brand-primary/20" 
                            : "text-neutral-700 hover:bg-neutral-100",
                        )}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                  
                  <div className="my-3 h-px bg-neutral-100" />
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-neutral-400">Akun Saya</p>

                  {user ? (
                    <>
                      <Link
                        href="/notifikasi"
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-neutral-700 transition-all hover:bg-neutral-100"
                      >
                        <span>Notifikasi</span>
                        {unreadNotifications > 0 && (
                          <span className="grid h-5 min-w-5 place-content-center rounded-full bg-error px-1 text-[10px] text-white">
                            {unreadNotifications}
                          </span>
                        )}
                      </Link>
                      
                      {user.role === "admin" && (
                        <Link
                          href="/admin"
                          onClick={() => setOpen(false)}
                          className="flex items-center justify-between rounded-xl border border-brand-primary/20 bg-brand-primary-light/10 px-4 py-3 text-sm font-semibold text-brand-primary transition-all"
                        >
                          <span>Admin Panel</span>
                          <ShieldCheck className="size-4" />
                        </Link>
                      )}
                    </>
                  ) : null}
                </nav>
              </div>

              {/* Drawer Footer Actions */}
              <div className="border-t border-neutral-100 bg-neutral-50 px-6 py-5">
                {user ? (
                  <button
                    type="button"
                    onClick={() => {
                      handleLogout();
                      setOpen(false);
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white py-3 text-sm font-semibold text-error shadow-sm transition hover:bg-red-50"
                  >
                    <LogOut className="size-4" /> Keluar Akun
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      href="/auth/masuk"
                      onClick={() => setOpen(false)}
                      className="rounded-xl border border-neutral-200 bg-white py-3 text-center text-sm font-semibold text-neutral-700 shadow-sm transition hover:border-brand-primary hover:text-brand-primary"
                    >
                      Masuk
                    </Link>
                    <Link
                      href="/auth/daftar"
                      onClick={() => setOpen(false)}
                      className="rounded-xl bg-brand-primary py-3 text-center text-sm font-semibold border border-transparent shadow shadow-brand-primary/20 text-white transition hover:bg-brand-primary-dark"
                    >
                      Daftar
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
