'use client';

import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock } from 'lucide-react';
import { useBookingStore } from '@/state/booking-store';
import { DayPicker } from 'react-day-picker';
import { id as localeId } from 'date-fns/locale';
import { format, addDays } from 'date-fns';
import { useEffect, useState } from 'react';
import 'react-day-picker/dist/style.css';
import toast from 'react-hot-toast';
import { getBookedSlots } from '@/lib/supabase/orders';

const AVAILABLE_AREAS = ['Keputih', 'Gebang', 'Semolowaru', 'Mulyosari', 'Arif Rahman Hakim'];

const TIME_SLOTS = [
  '08:00 - 10:00',
  '10:00 - 12:00',
  '13:00 - 15:00',
  '15:00 - 17:00',
  '18:00 - 20:00',
];

export default function Step2Details() {
  const [availableSlots, setAvailableSlots] = useState<string[]>(TIME_SLOTS);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  const {
    address,
    area,
    scheduledDate,
    scheduledTime,
    notes,
    laundryDistance,
    selectedServiceName,
    selectedServicePrice,
    setDetails,
    setLaundryDistance,
    setStep,
  } = useBookingStore();

  const isLaundryService = selectedServiceName?.toLowerCase().includes('laundry');
  const selectedDateObj = scheduledDate ? new Date(scheduledDate) : null;

  useEffect(() => {
    // Fetch booked slots when date changes
    const loadSlots = async () => {
      if (!scheduledDate) {
        setAvailableSlots(TIME_SLOTS);
        return;
      }

      setIsLoadingSlots(true);
      try {
        const bookedSlots = await getBookedSlots(scheduledDate);
        const available = TIME_SLOTS.filter((slot) => !bookedSlots.includes(slot));
        setAvailableSlots(available);
      } catch (error) {
        console.error('Error loading slots:', error);
        toast.error('Gagal memuat slot waktu tersedia');
        setAvailableSlots(TIME_SLOTS);
      } finally {
        setIsLoadingSlots(false);
      }
    };

    loadSlots();
  }, [scheduledDate]);

  const handleNext = () => {
    if (!address.trim() || !area || !scheduledDate || !scheduledTime) {
      toast.error('Mohon lengkapi semua field yang wajib diisi');
      return;
    }
    setStep('confirm');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Left Column: Location & Notes */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div>
            <label className="flex items-center gap-2 mb-3 text-sm font-bold text-neutral-900">
              <MapPin className="w-4 h-4 text-brand-primary" />
              Area Layanan *
            </label>
            <select
              value={area}
              onChange={(e) => setDetails(address, e.target.value, scheduledDate ?? '', scheduledTime ?? '', notes)}
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10"
            >
              <option value="">-- Pilih Area Sukolilo --</option>
              {AVAILABLE_AREAS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-3 text-sm font-bold text-neutral-900 block">
              Alamat Lengkap Kamar/Kos *
            </label>
            <textarea
              value={address}
              onChange={(e) => setDetails(e.target.value, area, scheduledDate ?? '', scheduledTime ?? '', notes)}
              placeholder="Contoh: Asrama PENS Blok C Kamar 402, atau Kos Jalan Ahmad Yani No.15..."
              rows={4}
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition resize-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10"
            />
            <p className="mt-2 text-xs text-neutral-500">
              Semakin detail, semakin cepat mitra menemukan lokasi Anda
            </p>
          </div>

          <div>
            <label className="mb-3 text-sm font-bold text-neutral-900 block">
              Catatan untuk Mitra (Opsional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setDetails(address, area, scheduledDate ?? '', scheduledTime ?? '', e.target.value)}
              placeholder="Contoh: Gunakan pewangi lavender, hati-hati ada barang pecah belah..."
              rows={3}
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition resize-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10"
            />
          </div>

          {isLaundryService && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl border border-brand-accent/30 bg-brand-accent-light/30 p-4"
            >
              <label className="mb-3 text-sm font-bold text-brand-accent block">
                Jarak Layanan Laundry *
              </label>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="distance"
                    value="5"
                    checked={laundryDistance === 5}
                    onChange={() => setLaundryDistance(5)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-semibold">Radius &lt; 5 KM</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="distance"
                    value="10"
                    checked={laundryDistance === 10}
                    onChange={() => setLaundryDistance(10)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-semibold">Radius &gt; 5 km (+Rp15.000)</span>
                </label>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Right Column: Date & Time */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div>
            <label className="flex items-center gap-2 mb-3 text-sm font-bold text-neutral-900">
              <Calendar className="w-4 h-4 text-brand-primary" />
              Tanggal Layanan *
            </label>
            <div className="flex justify-center border border-neutral-200 rounded-2xl p-3 bg-white">
              <DayPicker
                mode="single"
                selected={selectedDateObj || undefined}
                onSelect={(date) => {
                  if (date) {
                    const dateStr = format(date, 'yyyy-MM-dd');
                    setDetails(address, area, dateStr, scheduledTime ?? '', notes);
                  }
                }}
                locale={localeId}
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                modifiersClassNames={{
                  selected:
                    'bg-brand-primary text-white hover:bg-brand-primary-dark font-bold',
                  today: 'text-brand-primary font-bold border border-brand-primary',
                }}
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 mb-3 text-sm font-bold text-neutral-900">
              <Clock className="w-4 h-4 text-brand-primary" />
              Jam Layanan * {isLoadingSlots && <span className="text-[10px] text-neutral-500">(loading...)</span>}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {TIME_SLOTS.map((slot) => {
                const isAvailable = availableSlots.includes(slot);
                const isSelected = scheduledTime === slot;
                return (
                  <button
                    key={slot}
                    onClick={() => {
                      if (isAvailable) {
                        setDetails(address, area, scheduledDate ?? '', slot, notes);
                      }
                    }}
                    disabled={!isAvailable}
                    className={`relative overflow-hidden rounded-xl border-2 py-3 px-3 text-xs font-bold transition-all ${
                      isSelected
                        ? 'border-brand-primary bg-brand-primary text-white shadow-lg'
                        : isAvailable
                        ? 'border-neutral-200 bg-white text-neutral-700 hover:border-brand-primary/50 cursor-pointer'
                        : 'border-neutral-200 bg-neutral-100 text-neutral-400 cursor-not-allowed opacity-50'
                    }`}
                  >
                    {slot}
                    {!isAvailable && <span className="text-[9px] block mt-1">Penuh</span>}
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-neutral-500">
              Pilih slot waktu kedatangan mitra. Jika penuh, coba tanggal/jam lain.
            </p>
          </div>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4"
          >
            <p className="text-xs text-neutral-600 mb-2">Ringkasan Pesanan</p>
            <p className="font-semibold text-neutral-900 mb-1">{selectedServiceName}</p>
            <p className="text-sm font-bold text-brand-primary">
              {scheduledDate && format(new Date(scheduledDate), 'dd MMM yyyy', { locale: localeId })}
              {' • '}
              {scheduledTime}
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-neutral-200">
        <button
          onClick={() => setStep('service')}
          className="px-6 py-3 border border-neutral-200 text-neutral-900 font-semibold rounded-xl hover:bg-neutral-50 transition-all"
        >
          ← Kembali
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-3 bg-brand-primary text-white font-semibold rounded-xl hover:bg-brand-primary-dark transition-all"
        >
          Lanjut ke Konfirmasi →
        </button>
      </div>
    </div>
  );
}
