'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { useBookingStore } from '@/state/booking-store';
import { serviceCatalog as fallbackCatalog } from '@/data/site-data'; // Only for type reference or fallback
import { formatRupiah } from '@/lib/utils';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export default function Step1Service() {
  const { selectedServiceId, setService, setStep } = useBookingStore();
  const [catalog, setCatalog] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) {
        setCatalog(fallbackCatalog);
        setIsLoading(false);
        return;
      }
      
      const { data, error } = await supabase.from('services').select('*').eq('is_active', true).order('sort_order', { ascending: true });
      if (error || !data) {
        toast.error('Gagal memuat layanan');
        setCatalog(fallbackCatalog);
      } else {
        setCatalog(data.map(d => ({
          id: d.id,
          nama: d.name,
          hargaMin: d.price_min,
          fitur: d.features || [],
          deskripsi: d.description
        })));
      }
      setIsLoading(false);
    };
    fetchServices();
  }, []);

  const handleSelectService = (serviceId: string, serviceName: string, servicePrice: number) => {
    setService(serviceId, serviceName, servicePrice);
  };

  const handleNext = () => {
    if (!selectedServiceId) {
      toast.error('Pilih layanan terlebih dahulu');
      return;
    }
    setStep('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8">
      {/* Card Container */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-brand-primary size-8" />
        </div>
      ) : (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {catalog.map((service, index) => {
          const isSelected = selectedServiceId === service.id;
          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleSelectService(service.id, service.nama, service.hargaMin)}
              className={`relative overflow-hidden rounded-2xl border-2 p-5 cursor-pointer transition-all hover:shadow-lg ${
                isSelected
                  ? 'border-brand-primary bg-brand-primary-light/10 shadow-[0_4px_20px_rgba(14,166,115,0.1)]'
                  : 'border-neutral-200 bg-white hover:border-brand-primary/50'
              }`}
            >
              {/* Selected Badge */}
              {isSelected && (
                <motion.div
                  className="absolute top-4 right-4 bg-brand-primary text-white rounded-full p-1"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <CheckCircle2 className="w-5 h-5" />
                </motion.div>
              )}

              {/* Badge */}
              {service.badge && (
                <span className="inline-block rounded-md bg-brand-accent-light px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-accent mb-3">
                  {service.badge}
                </span>
              )}

              {/* Title */}
              <h3 className="font-display text-base font-bold text-neutral-900 line-clamp-2">
                {service.nama}
              </h3>

              {/* Description */}
              <p className="text-xs text-neutral-600 mt-2 mb-4 line-clamp-2">
                {service.deskripsi}
              </p>

              {/* Features */}
              <ul className="mb-4 space-y-1 max-h-20 overflow-hidden">
                {service.fitur.slice(0, 2).map((fitur: any, i: number) => (
                  <li key={i} className="text-[11px] text-neutral-500 flex items-start gap-2">
                    <span className="text-brand-primary mt-0.5">✓</span>
                    <span>{fitur}</span>
                  </li>
                ))}
                {service.fitur.length > 2 && (
                  <li className="text-[11px] text-neutral-400 italic">
                    +{service.fitur.length - 2} fitur lainnya
                  </li>
                )}
              </ul>

              {/* Price */}
              <p className="font-display text-lg font-extrabold text-brand-primary">
                {formatRupiah(service.hargaMin)}
              </p>
            </motion.div>
          );
        })}
      </div>
      )}

      {/* Summary */}
      {selectedServiceId && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-brand-primary-light/10 border border-brand-primary/20 p-4"
        >
          <p className="text-sm font-semibold text-neutral-800">
            Layanan dipilih:{' '}
            <span className="text-brand-primary">
              {catalog.find(s => s.id === selectedServiceId)?.nama}
            </span>
            {' — '}
            <span className="font-display text-lg font-bold text-brand-primary">
              {formatRupiah(catalog.find(s => s.id === selectedServiceId)?.hargaMin || 0)}
            </span>
          </p>
        </motion.div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6">
        <div></div>
        <button
          onClick={handleNext}
          disabled={!selectedServiceId}
          className="px-6 py-3 bg-brand-primary text-white font-semibold rounded-xl hover:bg-brand-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Lanjut ke Detail →
        </button>
      </div>
    </div>
  );
}
