import { create } from 'zustand';

export type BookingStep = 'service' | 'details' | 'confirm' | 'payment' | 'success';

export interface BookingState {
  currentStep: BookingStep;
  selectedServiceId: string | null;
  selectedServiceName: string | null;
  selectedServicePrice: number | null;
  address: string;
  area: string;
  scheduledDate: string | null;
  scheduledTime: string | null;
  notes: string;
  laundryDistance: number | null;
  promoCode: string;
  promoDiscount: number;
  totalAmount: number;
  paymentMethod: 'qris' | 'gopay' | 'shopeepay' | 'bca' | 'mandiri' | 'bni' | 'bsi' | null;
  bankName: string | null;
  orderNumber: string | null;
  paymentProof: string | null;
}

export interface BookingActions {
  setStep: (step: BookingStep) => void;
  setService: (serviceId: string, serviceName: string, servicePrice: number) => void;
  setDetails: (address: string, area: string, date: string, time: string, notes: string) => void;
  setLaundryDistance: (distance: number | null) => void;
  setPromo: (code: string, discount: number) => void;
  calculateTotal: () => void;
  setPaymentMethod: (method: 'qris' | 'gopay' | 'shopeepay' | 'bca' | 'mandiri' | 'bni' | 'bsi', bankName?: string) => void;
  setPaymentProof: (proof: string | null) => void;
  setOrderNumber: (orderNumber: string) => void;
  reset: () => void;
}

const initialState: BookingState = {
  currentStep: 'service',
  selectedServiceId: null,
  selectedServiceName: null,
  selectedServicePrice: null,
  address: '',
  area: '',
  scheduledDate: null,
  scheduledTime: null,
  notes: '',
  laundryDistance: null,
  promoCode: '',
  promoDiscount: 0,
  totalAmount: 0,
  paymentMethod: null,
  bankName: null,
  orderNumber: null,
  paymentProof: null,
};

export const useBookingStore = create<BookingState & BookingActions>((set) => ({
  ...initialState,
  
  setStep: (step) => set({ currentStep: step }),
  
  setService: (serviceId, serviceName, servicePrice) =>
    set({
      selectedServiceId: serviceId,
      selectedServiceName: serviceName,
      selectedServicePrice: servicePrice,
    }),
  
  setDetails: (address, area, date, time, notes) =>
    set({
      address,
      area,
      scheduledDate: date,
      scheduledTime: time,
      notes,
    }),
  
  setLaundryDistance: (distance) =>
    set((state) => ({
      laundryDistance: distance,
    })),
  
  setPromo: (code, discount) =>
    set({
      promoCode: code,
      promoDiscount: discount,
    }),
  
  calculateTotal: () =>
    set((state) => {
      let total = state.selectedServicePrice || 0;
      total += state.laundryDistance ? (state.laundryDistance === 5 ? 15000 : 30000) : 0;
      total -= state.promoDiscount;
      return { totalAmount: Math.max(total, 0) };
    }),
  
  setPaymentMethod: (method, bankName) =>
    set({
      paymentMethod: method,
      bankName,
    }),

  setPaymentProof: (proof) =>
    set({ paymentProof: proof }),

  setOrderNumber: (orderNumber) =>
    set({ orderNumber }),
  
  reset: () => set(initialState),
}));
