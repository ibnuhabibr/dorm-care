'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Clock, MessageSquare, Copy, Home } from 'lucide-react';
import Link from 'next/link';
import { useBookingStore } from '@/state/booking-store';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { createOrder } from '@/lib/supabase/orders';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export default function Step5Success() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const { 
    orderNumber, 
    totalAmount, 
    selectedServiceName, 
    selectedServiceId,
    selectedServicePrice,
    address,
    area,
    scheduledDate,
    scheduledTime,
    promoCode,
    promoDiscount,
    notes,
    laundryDistance,
    reset 
  } = useBookingStore();

  useEffect(() => {
    // Save order to Supabase on mount
    const saveOrder = async () => {
      if (isCreating || !selectedServiceId) return;
      
      setIsCreating(true);
      try {
        const supabase = getSupabaseBrowserClient();
        if (!supabase) {
          // Demo mode - no Supabase configured
          return;
        }
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          toast.error('Silakan login terlebih dahulu');
          router.push('/auth/masuk');
          return;
        }

        await createOrder({
          userId: user.id,
          serviceId: selectedServiceId!,
          serviceName: selectedServiceName ?? '',
          servicePrice: selectedServicePrice ?? 0,
          address: address || '',
          area: area || '',
          scheduledDate: scheduledDate || '',
          scheduledTime: scheduledTime || '',
          notes: notes,
          laundryDistance: laundryDistance ? parseInt(laundryDistance.toString()) : undefined,
          promoCode: promoCode,
          discountAmount: promoDiscount,
          totalAmount: totalAmount,
        });

        toast.success('Pesanan berhasil disimpan!');
      } catch (error) {
        console.error('Failed to save order:', error);
        toast.error(error instanceof Error ? error.message : 'Gagal menyimpan pesanan');
      } finally {
        setIsCreating(false);
      }
    };

    saveOrder();

    // Trigger confetti animation
    const container = document.getElementById('confetti-container');
    if (container) {
      for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        container.appendChild(confetti);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedServiceId]);

  const handleCopyOrderId = () => {
    if (orderNumber) {
      navigator.clipboard.writeText(orderNumber);
      toast.success('Order ID berhasil disalin!');
    }
  };

  return (
    <div className="space-y-8">
      {/* Confetti Container */}
      <div id="confetti-container" className="fixed inset-0 pointer-events-none overflow-hidden">
        <style>{`
          @keyframes confetti-fall {
            to {
              transform: translateY(100vh) rotate(360deg);
              opacity: 0;
            }
          }
          .confetti {
            position: fixed;
            width: 8px;
            height: 8px;
            background: linear-gradient(45deg, #0EA673, #F59E0B);
            animation: confetti-fall 3s ease-in forwards;
          }
        `}</style>
      </div>

      {/* Success Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="rounded-3xl border border-brand-primary/20 bg-gradient-to-br from-brand-primary-light/20 via-white to-brand-accent-light/10 p-8 md:p-12 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
          className="mx-auto mb-6 w-fit"
        >
          <div className="relative w-24 h-24 flex items-center justify-center">
            <div className="absolute inset-0 bg-brand-primary/20 rounded-full animate-pulse" />
            <CheckCircle2 className="w-20 h-20 text-brand-primary" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-display text-3xl md:text-4xl font-extrabold text-neutral-900 mb-2"
        >
          Pesanan Berhasil Dibuat!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-neutral-600 mb-6"
        >
          Terima kasih telah mempercayai Dorm Care untuk kebersihan kamarmu.
        </motion.p>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl bg-white border border-neutral-200 p-6 mb-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-neutral-600 font-medium">Order ID</span>
            <div className="flex items-center gap-2">
              <span className="font-display text-lg font-bold text-brand-primary">
                #{orderNumber}
              </span>
              <button
                onClick={handleCopyOrderId}
                className="p-1.5 hover:bg-neutral-100 rounded-lg transition"
              >
                <Copy className="w-4 h-4 text-neutral-500" />
              </button>
            </div>
          </div>

          <div className="border-t border-neutral-200 pt-4 flex items-center justify-between">
            <span className="text-neutral-600 font-medium">Layanan</span>
            <span className="font-semibold text-neutral-900">{selectedServiceName}</span>
          </div>
        </motion.div>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid gap-4 md:grid-cols-3 mb-8"
        >
          {/* WhatsApp Notification */}
          <div className="rounded-xl border border-neutral-200 bg-white p-4 flex flex-col items-center justify-center">
            <MessageSquare className="w-6 h-6 text-green-600 mb-2" />
            <p className="text-xs font-bold text-neutral-900 mb-1">Notifikasi WhatsApp</p>
            <p className="text-[11px] text-neutral-500">
              Dalam 5 menit, Anda akan menerima konfirmasi di WhatsApp
            </p>
          </div>

          {/* Real-time Tracking */}
          <div className="rounded-xl border border-neutral-200 bg-white p-4 flex flex-col items-center justify-center">
            <Clock className="w-6 h-6 text-brand-primary mb-2" />
            <p className="text-xs font-bold text-neutral-900 mb-1">Pantau Real-time</p>
            <p className="text-[11px] text-neutral-500">
              Lihat status pesanan Anda di halaman Riwayat
            </p>
          </div>

          {/* Need Help */}
          <div className="rounded-xl border border-neutral-200 bg-white p-4 flex flex-col items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-brand-accent mb-2" />
            <p className="text-xs font-bold text-neutral-900 mb-1">Butuh Bantuan?</p>
            <p className="text-[11px] text-neutral-500">
              Chat dengan tim support kami 24/7
            </p>
          </div>
        </motion.div>

        {/* Important Notes */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="rounded-xl bg-blue-50 border border-blue-200 p-4 text-left mb-8"
        >
          <p className="text-sm font-semibold text-blue-900 mb-2">
            ✓ Langkah Selanjutnya
          </p>
          <ol className="space-y-1 text-xs text-blue-800">
            <li>• Tunggu konfirmasi WhatsApp dari tim Dorm Care</li>
            <li>• Pastikan Anda di lokasi saat jadwal layanan dimulai</li>
            <li>• Siapkan kamar dan area yang ingin dibersihkan</li>
            <li>• Jika ada perubahan, hubungi kami sebelum 1 jam kedatangan</li>
          </ol>
        </motion.div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="grid gap-4 md:grid-cols-2 max-w-2xl mx-auto"
      >
        <Link
          href="/riwayat"
          className="rounded-xl border border-brand-primary bg-white text-brand-primary px-6 py-4 font-semibold transition-all hover:bg-brand-primary-light/10 flex items-center justify-center gap-2 group"
        >
          <Clock className="w-5 h-5 transition group-hover:translate-x-1" />
          Lihat Status Pesanan
        </Link>

        <Link
          href="/"
          className="rounded-xl border border-brand-primary bg-brand-primary text-white px-6 py-4 font-semibold transition-all hover:bg-brand-primary-dark flex items-center justify-center gap-2 group"
        >
          <Home className="w-5 h-5 transition group-hover:-translate-x-1" />
          Kembali ke Beranda
        </Link>
      </motion.div>

      {/* Additional Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="text-center text-sm text-neutral-500"
      >
        <p>
          Pertanyaan? Hubungi kami via WhatsApp atau email di{' '}
          <a href="mailto:support@dormcare.id" className="text-brand-primary hover:underline">
            support@dormcare.id
          </a>
        </p>
      </motion.div>

      {/* Reset on unmount would happen automatically, but we can also provide explicit reset */}
      <div className="pt-6 text-center">
        <button
          onClick={() => {
            reset();
          }}
          className="text-xs text-neutral-500 hover:text-neutral-700 underline"
        >
          Buat pesanan baru
        </button>
      </div>
    </div>
  );
}
