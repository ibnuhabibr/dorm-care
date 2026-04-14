'use client';

import { useState } from 'react';
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
            DC
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
