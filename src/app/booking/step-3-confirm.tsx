'use client';

import { motion } from 'framer-motion';
import { MapPin, Calendar, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
import { useBookingStore } from '@/state/booking-store';
import { promoCatalog, serviceCatalog } from '@/data/site-data';
import { formatRupiah } from '@/lib/utils';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function Step3Confirm() {
  const {
    address,
    area,
    scheduledDate,
    scheduledTime,
    notes,
    promoCode,
    setPromo,
    selectedServiceId,
    selectedServiceName,
    selectedServicePrice,
    laundryDistance,
    setStep,
    calculateTotal,
    totalAmount,
  } = useBookingStore();

  const [promoInput, setPromoInput] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<typeof promoCatalog[0] | null>(null);

  useEffect(() => {
    calculateTotal();
  }, [calculateTotal]);
  const subtotal = selectedServicePrice || 0;
  const laundryFee = laundryDistance ? (laundryDistance === 10 ? 15000 : 0) : 0;
  const currentSubtotal = subtotal + laundryFee;

  const handleApplyPromo = () => {
    if (!promoInput.trim()) {
      toast.error('Masukkan kode promo');
      return;
    }

    const promo = promoCatalog.find(
      (p) => p.kode === promoInput.toUpperCase() && p.aktif
    );

    if (!promo) {
      toast.error('Kode promo tidak valid atau sudah expired');
      return;
    }

    if (currentSubtotal < promo.minTransaksi) {
      toast.error(
        `Minimal transaksi untuk promo ini adalah ${formatRupiah(promo.minTransaksi)}`
      );
      return;
    }

    const discount =
      promo.tipe === 'persen'
        ? Math.floor((currentSubtotal * promo.nilai) / 100)
        : promo.nilai;

    setAppliedPromo(promo);
    setPromo(promo.kode, discount);
    toast.success(`Promo "${promo.nama}" berhasil diterapkan!`);
  };

  const discount = appliedPromo
    ? appliedPromo.tipe === 'persen'
      ? Math.floor((currentSubtotal * appliedPromo.nilai) / 100)
      : appliedPromo.nilai
    : 0;

  const total = Math.max(0, currentSubtotal - discount);

  const handleNext = () => {
    if (!agreedToTerms) {
      toast.error('Anda harus menyetujui Syarat & Ketentuan');
      return;
    }
    setStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left: Order Details (2 columns) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Service */}
          <section className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h3 className="font-display font-bold text-neutral-900 mb-4">
              Layanan
            </h3>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold text-neutral-900">{selectedServiceName}</p>
              </div>
              <p className="font-display font-bold text-lg text-brand-primary">
                {formatRupiah(subtotal)}
              </p>
            </div>
          </section>

          {/* Location & Time */}
          <section className="rounded-2xl border border-neutral-200 bg-white p-6 space-y-4">
            <h3 className="font-display font-bold text-neutral-900">
              Lokasi & Waktu
            </h3>

            <div className="flex gap-4">
              <div className="rounded-full bg-brand-primary-light/20 p-3 h-fit">
                <MapPin className="w-5 h-5 text-brand-primary" />
              </div>
              <div>
                <p className="font-bold text-neutral-900">{area}</p>
                <p className="text-sm text-neutral-600 mt-1 leading-relaxed">
                  {address}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="rounded-full bg-brand-primary-light/20 p-3 h-fit">
                <Calendar className="w-5 h-5 text-brand-primary" />
              </div>
              <div>
                <p className="font-bold text-neutral-900">
                  {scheduledDate &&
                    format(new Date(scheduledDate), 'EEEE, dd MMMM yyyy', {
                      locale: localeId,
                    })}
                </p>
                <p className="text-sm text-neutral-600 mt-1">Pukul {scheduledTime}</p>
              </div>
            </div>

            {notes && (
              <div className="rounded-lg bg-neutral-50 border border-neutral-200 p-3">
                <p className="text-xs font-semibold text-neutral-600 mb-1">
                  Catatan:
                </p>
                <p className="text-sm text-neutral-800">{notes}</p>
              </div>
            )}
          </section>
        </motion.div>

        {/* Right: Pricing & Promo (1 column) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="sticky top-4 h-fit"
        >
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 space-y-6">
            {/* Pricing Breakdown */}
            <div className="space-y-3 pb-4 border-b border-neutral-200">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Harga Layanan</span>
                <span className="font-semibold text-neutral-900">
                  {formatRupiah(subtotal)}
                </span>
              </div>
              {laundryFee > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Biaya Laundry (Jarak)</span>
                  <span className="font-semibold text-neutral-900">
                    +{formatRupiah(laundryFee)}
                  </span>
                </div>
              )}
              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-600 font-semibold flex items-center gap-1">
                    <Sparkles className="w-4 h-4" /> Diskon Promo
                  </span>
                  <span className="font-semibold text-green-600">
                    -{formatRupiah(discount)}
                  </span>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="flex justify-between items-end">
              <span className="text-neutral-600 font-medium">Total</span>
              <span className="font-display text-2xl font-extrabold text-brand-primary">
                {formatRupiah(total)}
              </span>
            </div>

            {/* Promo Input */}
            <div>
              <label className="text-xs font-bold text-neutral-600 mb-2 block uppercase">
                Kode Promo (Opsional)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                  placeholder="DORMCARE15"
                  className="flex-1 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
                  onKeyPress={(e) => e.key === 'Enter' && handleApplyPromo()}
                />
                <button
                  onClick={handleApplyPromo}
                  className="px-4 py-2 bg-brand-primary text-white text-sm font-bold rounded-lg hover:bg-brand-primary-dark transition-all"
                >
                  Pakai
                </button>
              </div>
              {appliedPromo && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2 rounded-lg bg-green-50 border border-green-200 p-2 flex items-center gap-2 text-xs"
                >
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-green-800 font-semibold">
                    {appliedPromo.nama} ({formatRupiah(discount)} off)
                  </span>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Terms Agreement */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-neutral-200 bg-white p-6"
      >
        <label className="flex items-start gap-3 cursor-pointer">
          <div className="relative flex items-center justify-center mt-1">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="sr-only peer"
            />
            <div className="h-5 w-5 rounded border-2 border-neutral-300 bg-white transition peer-checked:border-brand-primary peer-checked:bg-brand-primary" />
            <CheckCircle2 className="absolute w-3 h-3 text-white opacity-0 transition peer-checked:opacity-100" />
          </div>
          <span className="text-sm text-neutral-700">
            Saya telah membaca dan menyetujui{' '}
            <a
              href="/syarat-ketentuan"
              target="_blank"
              className="font-bold text-brand-primary hover:underline"
            >
              Syarat & Ketentuan
            </a>{' '}
            serta{' '}
            <a href="/privacy" target="_blank" className="font-bold text-brand-primary hover:underline">
              Kebijakan Privasi
            </a>
            .
          </span>
        </label>
      </motion.div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-neutral-200">
        <button
          onClick={() => setStep('details')}
          className="px-6 py-3 border border-neutral-200 text-neutral-900 font-semibold rounded-xl hover:bg-neutral-50 transition-all"
        >
          ← Ubah Detail
        </button>
        <button
          onClick={handleNext}
          disabled={!agreedToTerms}
          className="px-6 py-3 bg-brand-primary text-white font-semibold rounded-xl hover:bg-brand-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Lanjut ke Pembayaran →
        </button>
      </div>
    </div>
  );
}
