'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useBookingStore } from '@/state/booking-store';
import { cn } from '@/lib/utils';

const steps = [
  { id: 'service', label: 'Pilih Layanan', order: 1 },
  { id: 'details', label: 'Detail Pesanan', order: 2 },
  { id: 'confirm', label: 'Konfirmasi', order: 3 },
  { id: 'payment', label: 'Pembayaran', order: 4 },
  { id: 'success', label: 'Selesai', order: 5 },
];

export default function BookingLayout({ children }: { children: ReactNode }) {
  const { currentStep } = useBookingStore();
  
  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-brand-primary-light py-12 px-4">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="font-display text-3xl font-bold text-neutral-900 mb-2">
            Booking Layanan Dorm Care
          </h1>
          <p className="text-neutral-600">
            Ikuti langkah-langkah di bawah untuk menyelesaikan pesanan
          </p>
        </div>

        {/* Stepper */}
        <div className="mb-12">
          <div className="relative">
            {/* Background line */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-neutral-200">
              <motion.div
                className="h-full bg-brand-primary"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Steps */}
            <div className="relative flex justify-between">
              {steps.map((step, index) => {
                const isCompleted = index < currentStepIndex;
                const isCurrent = index === currentStepIndex;
                const isUpcoming = index > currentStepIndex;

                return (
                  <motion.div
                    key={step.id}
                    className="flex flex-col items-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {/* Circle */}
                    <motion.div
                      className={cn(
                        'relative z-10 flex h-10 w-10 items-center justify-center rounded-full font-semibold text-sm transition-all',
                        isCompleted && 'bg-brand-primary text-white',
                        isCurrent && 'bg-brand-primary text-white ring-4 ring-brand-primary ring-offset-4',
                        isUpcoming && 'bg-neutral-200 text-neutral-500'
                      )}
                      animate={{
                        scale: isCurrent ? 1.1 : 1,
                      }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <span>{step.order}</span>
                      )}
                    </motion.div>

                    {/* Label */}
                    <label
                      className={cn(
                        'mt-3 text-center text-xs font-semibold transition',
                        isCompleted && 'text-brand-primary',
                        isCurrent && 'text-brand-primary font-bold',
                        isUpcoming && 'text-neutral-500'
                      )}
                    >
                      {step.label}
                    </label>

                    {/* Mobile label optimization */}
                    <div className="hidden sm:block mt-1 text-[10px] text-neutral-500 text-center max-w-[60px]" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
