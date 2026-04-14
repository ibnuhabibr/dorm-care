import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Syarat & Ketentuan',
  description: 'Syarat dan ketentuan penggunaan layanan Dorm Care. Baca sebelum melakukan pemesanan layanan kebersihan.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
