import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Promo & Diskon',
  description: 'Promo spesial Dorm Care — diskon hingga 15% untuk layanan kebersihan kos dan asrama. Gunakan kode promo sebelum expired!',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
