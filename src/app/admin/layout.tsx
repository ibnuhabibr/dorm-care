'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import {
  Menu,
  X,
  LayoutDashboard,
  ShoppingCart,
  Package,
  Tag,
  Users,
  FileText,
  BarChart3,
  Settings,
} from 'lucide-react';
import Image from 'next/image';

const adminMenuItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/pesanan', label: 'Pesanan', icon: ShoppingCart },
  { href: '/admin/layanan', label: 'Layanan', icon: Package },
  { href: '/admin/promo', label: 'Promo', icon: Tag },
  { href: '/admin/pengguna', label: 'Pengguna', icon: Users },
  { href: '/admin/konten', label: 'Konten', icon: FileText },
  { href: '/admin/laporan', label: 'Laporan', icon: BarChart3 },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem("admin_auth") === "true") {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "dorm-care-admin") {
      sessionStorage.setItem("admin_auth", "true");
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Username atau password salah!");
    }
  };

  if (isAuthenticated === null) {
    return <div className="flex h-screen items-center justify-center bg-neutral-50"><div className="size-8 animate-spin rounded-full border-4 border-brand-primary border-t-transparent" /></div>; // Hydration placeholder
  }

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-neutral-50 px-4">
        <div className="w-full max-w-sm rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
          <div className="mb-6 flex flex-col items-center text-center">
            <Image 
              src="/logo-baru.png" 
              alt="Dorm Care Admin" 
              width={160} 
              height={48} 
              className="h-12 w-auto object-contain mb-2"
              priority
            />
            <p className="mt-1 text-sm font-semibold text-neutral-500 uppercase tracking-wider">Admin Portal</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="rounded-xl bg-red-50 p-3 text-center text-sm font-semibold text-red-600">
                {error}
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-neutral-700">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-11 w-full rounded-xl border border-neutral-200 px-4 text-sm font-medium outline-none transition focus:border-brand-primary"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-neutral-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 w-full rounded-xl border border-neutral-200 px-4 text-sm font-medium outline-none transition focus:border-brand-primary"
                required
              />
            </div>
            <button
              type="submit"
              className="mt-2 w-full rounded-xl bg-brand-primary py-3 text-sm font-bold text-white shadow-sm transition hover:bg-brand-primary-dark"
            >
              Masuk
            </button>
          </form>
          <div className="mt-6 text-center">
             <Link href="/" className="text-xs font-semibold text-neutral-500 hover:text-brand-primary">
                &larr; Kembali ke Beranda
             </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-neutral-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-neutral-200 transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        } lg:relative lg:z-0`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-neutral-200">
          <Link href="/admin" className={`font-display font-bold text-brand-primary transition ${sidebarOpen ? 'text-xl' : 'text-2xl'}`}>
            <Image 
              src="/logo-baru.png" 
              alt="Dorm Care Admin" 
              width={140} 
              height={40} 
              className={`h-8 w-auto object-contain transition ${!sidebarOpen ? 'opacity-0 w-0' : 'opacity-100'}`}
              priority
            />
            {!sidebarOpen && <span className="text-xl">DC</span>}
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-1 hover:bg-neutral-100 rounded-lg transition"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {adminMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition group justify-start ${
                  isActive
                    ? 'bg-brand-primary-light text-brand-primary-dark font-bold'
                    : 'hover:bg-neutral-100'
                }`}
                title={item.label}
              >
                <Icon className={`w-5 h-5 transition min-w-[20px] ${
                  isActive ? 'text-brand-primary' : 'text-neutral-600 group-hover:text-brand-primary'
                }`} />
                {sidebarOpen && (
                  <span className={`text-sm transition ${
                    isActive ? 'font-bold text-brand-primary-dark' : 'font-medium text-neutral-700 group-hover:text-brand-primary'
                  }`}>
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-neutral-100 transition"
          >
            <Settings className="w-5 h-5 text-neutral-600 min-w-[20px]" />
            {sidebarOpen && <span className="text-sm font-medium">Ke Website</span>}
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Top Bar */}
        <div className="h-20 border-b border-neutral-200 bg-white px-6 flex items-center justify-between lg:block hidden">
          <h2 className="font-display font-bold text-neutral-900">Admin Panel</h2>
        </div>

        {/* Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
