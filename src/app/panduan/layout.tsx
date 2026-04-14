import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Panduan & Kebijakan',
  description: 'Panduan penggunaan layanan Dorm Care — kebijakan layanan, prosedur pembayaran, FAQ, dan informasi penting lainnya.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
