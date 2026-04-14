import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Layanan Kebersihan',
  description: 'Pilih dari 9+ layanan kebersihan Dorm Care — Basic Clean, Deep Clean, Laundry, dan lainnya. Harga mulai Rp 20.000 area Surabaya.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
