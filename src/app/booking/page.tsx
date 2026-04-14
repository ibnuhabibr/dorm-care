'use client';

import { Suspense } from 'react';
import { useBookingStore } from '@/state/booking-store';
import Step1Service from './step-1-service';
import Step2Details from './step-2-details';
import Step3Confirm from './step-3-confirm';
import Step4Payment from './step-4-payment';
import Step5Success from './step-5-success';

function BookingContent() {
  const currentStep = useBookingStore((s) => s.currentStep);

  return (
    <>
      {currentStep === 'service' && <Step1Service />}
      {currentStep === 'details' && <Step2Details />}
      {currentStep === 'confirm' && <Step3Confirm />}
      {currentStep === 'payment' && <Step4Payment />}
      {currentStep === 'success' && <Step5Success />}
    </>
  );
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="size-10 animate-spin rounded-full border-4 border-neutral-200 border-t-brand-primary" />
        </div>
      }
    >
      <BookingContent />
    </Suspense>
  );
}
