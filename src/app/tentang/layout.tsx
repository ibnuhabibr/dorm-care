import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tentang Kami',
  description: 'Mengenal Dorm Care — layanan kebersihan digital untuk kos dan asrama mahasiswa di Surabaya. Tim profesional, booking digital, layanan terpercaya.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
