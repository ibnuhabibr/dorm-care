'use client';

import { Suspense } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useBookingStore, type BookingStep } from '@/state/booking-store';
import Step1Service from './step-1-service';
import Step2Details from './step-2-details';
import Step3Confirm from './step-3-confirm';
import Step4Payment from './step-4-payment';
import Step5Success from './step-5-success';

const stepMeta: Array<{ key: BookingStep; label: string }> = [
  { key: 'service', label: 'Pilih Layanan' },
  { key: 'details', label: 'Detail Pesanan' },
  { key: 'confirm', label: 'Konfirmasi' },
  { key: 'payment', label: 'Pembayaran' },
  { key: 'success', label: 'Selesai' },
];

function BookingContent() {
  const currentStep = useBookingStore((s) => s.currentStep);
  const stepIndex = stepMeta.findIndex((s) => s.key === currentStep);

  return (
    <div className="min-h-screen bg-surface-base pb-24 pt-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="font-display text-3xl font-extrabold text-neutral-900 md:text-4xl">
            Buat Pesanan
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            Selesaikan langkah di bawah untuk memesan agen kebersihanmu.
          </p>
        </div>

        {/* Desktop Stepper */}
        {currentStep !== 'success' && (
          <div className="mb-12 hidden items-center justify-between px-6 md:flex">
            {stepMeta.map((item, idx) => {
              const isDone = stepIndex > idx;
              const isActive = stepIndex === idx;
              return (
                <div key={item.key} className="relative z-10 flex w-full flex-col items-center">
                  {idx !== 0 && (
                    <div
                      className={`absolute -left-1/2 top-5 -z-10 h-[2px] w-full transition-colors duration-500 ${
                        isDone || isActive ? 'bg-brand-primary' : 'bg-neutral-200'
                      }`}
                    />
                  )}
                  <div
                    className={`flex size-10 items-center justify-center rounded-full border-2 transition-all duration-500 ${
                      isDone
                        ? 'border-brand-primary bg-brand-primary text-white'
                        : isActive
                          ? 'border-brand-primary bg-brand-primary-light text-brand-primary-dark shadow-[0_0_0_4px_rgba(14,166,115,0.15)] ring-2 ring-white'
                          : 'border-neutral-300 bg-white text-neutral-400'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="size-5" />
                    ) : (
                      <span className="text-sm font-bold">{idx + 1}</span>
                    )}
                  </div>
                  <p
                    className={`mt-3 text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${
                      isActive
                        ? 'text-brand-primary-dark'
                        : isDone
                          ? 'text-neutral-700'
                          : 'text-neutral-400'
                    }`}
                  >
                    {item.label}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* Mobile Stepper */}
        {currentStep !== 'success' && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-neutral-200 bg-white px-4 py-3 shadow-sm md:hidden">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-brand-primary">
                Langkah {stepIndex + 1} dari 5
              </p>
              <p className="text-sm font-bold text-neutral-900">{stepMeta[stepIndex]?.label}</p>
            </div>
            <div className="flex h-2 w-1/3 overflow-hidden rounded-full bg-neutral-100">
              <div
                className="h-full bg-brand-primary transition-all duration-500"
                style={{ width: `${((stepIndex + 1) / 5) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Step Content */}
        <div className="min-h-[450px] overflow-hidden rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm md:p-10">
          {currentStep === 'service' && <Step1Service />}
          {currentStep === 'details' && <Step2Details />}
          {currentStep === 'confirm' && <Step3Confirm />}
          {currentStep === 'payment' && <Step4Payment />}
          {currentStep === 'success' && <Step5Success />}
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-surface-base">
          <div className="size-10 animate-spin rounded-full border-4 border-neutral-200 border-t-brand-primary" />
        </div>
      }
    >
      <BookingContent />
    </Suspense>
  );
}
