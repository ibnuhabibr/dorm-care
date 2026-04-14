import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kontak',
  description: 'Hubungi Dorm Care via WhatsApp, email, atau form kontak. Tim kami siap membantu Anda 24/7 untuk kebutuhan kebersihan kos dan asrama di Surabaya.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
