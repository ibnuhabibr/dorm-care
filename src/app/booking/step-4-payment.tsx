'use client';

import { motion } from 'framer-motion';
import { Copy, CheckCircle2, Upload, ImageIcon, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { useBookingStore } from '@/state/booking-store';
import { formatRupiah } from '@/lib/utils';
import toast from 'react-hot-toast';
import { useState, useEffect, useRef } from 'react';

type PaymentMethod = 'qris' | 'gopay' | 'shopeepay' | 'bca' | 'mandiri' | 'bni' | 'bsi';

interface PaymentOption {
  id: PaymentMethod;
  name: string;
  type: 'qris' | 'ewallet' | 'bank';
  logo: string;
  accountNumber?: string;
  accountName?: string;
}

const PAYMENT_METHODS: PaymentOption[] = [
  { id: 'qris', name: 'QRIS', type: 'qris', logo: '/qris.png', accountNumber: '', accountName: 'Dorm Care' },
  { id: 'gopay', name: 'GoPay', type: 'ewallet', logo: '/gopay.png', accountNumber: '6282233080680', accountName: 'Dorm Care' },
  { id: 'shopeepay', name: 'ShopeePay', type: 'ewallet', logo: '/shopeepay.png', accountNumber: '6282233080680', accountName: 'Dorm Care' },
  { id: 'bca', name: 'BCA', type: 'bank', logo: '/bca.png', accountNumber: '4831-2104-4000', accountName: 'Dorm Care' },
  { id: 'mandiri', name: 'Mandiri', type: 'bank', logo: '/mandiri.png', accountNumber: '1410-0172-8283', accountName: 'Dorm Care' },
  { id: 'bni', name: 'BNI', type: 'bank', logo: '/bni.png', accountNumber: '6282233080680', accountName: 'Dorm Care' },
  { id: 'bsi', name: 'BSI', type: 'bank', logo: '/bsi.png', accountNumber: '6282233080680', accountName: 'Dorm Care' },
];

export default function Step4Payment() {
  const {
    paymentMethod,
    setPaymentMethod,
    setPaymentProof,
    totalAmount,
    selectedServiceName,
    setOrderNumber,
    setStep,
  } = useBookingStore();

  const [uploadedProof, setUploadedProof] = useState<string | null>(null);
  const [uploadingToSupabase, setUploadingToSupabase] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [orderId, setOrderId] = useState<string>('');

  useEffect(() => {
    setOrderId(`DC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
  }, []);

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Nomor berhasil disalin!');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File maksimal 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setUploadedProof(dataUrl);
      toast.success('Bukti pembayaran berhasil diupload');
    };
    reader.readAsDataURL(file);
  };

  const selectedMethod = PAYMENT_METHODS.find(m => m.id === paymentMethod);

  const handleConfirmPayment = () => {
    if (!paymentMethod) {
      toast.error('Pilih metode pembayaran terlebih dahulu');
      return;
    }

    if (!uploadedProof) {
      toast.error('Upload bukti pembayaran terlebih dahulu');
      return;
    }

    setPaymentProof(uploadedProof);

    const loading = toast.loading('Memproses pembayaran...');
    setTimeout(() => {
      toast.dismiss(loading);
      setOrderNumber(orderId);
      setStep('success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1500);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <p className="text-sm font-semibold text-neutral-600 mb-1">
          Selesaikan Pembayaran untuk Pesanan
        </p>
        <p className="text-2xl font-display font-extrabold text-brand-primary">
          {formatRupiah(totalAmount)}
        </p>
        <p className="text-xs text-neutral-500 mt-2">Order ID: #{orderId}</p>
      </motion.div>

      {/* Payment Methods Grid */}
      <div>
        <h3 className="font-bold text-neutral-900 mb-4">Pilih Metode Pembayaran</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PAYMENT_METHODS.map((option) => (
            <motion.button
              key={option.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setPaymentMethod(option.id, option.accountName)}
              className={`relative rounded-2xl border-2 p-4 flex flex-col items-center gap-2 transition-all ${
                paymentMethod === option.id
                  ? 'border-brand-primary bg-brand-primary-light/10 shadow-[0_4px_20px_rgba(14,166,115,0.15)]'
                  : 'border-neutral-200 bg-white hover:border-brand-primary/50'
              }`}
            >
              {paymentMethod === option.id && (
                <div className="absolute top-2 right-2 bg-brand-primary rounded-full p-0.5">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
              )}
              <div className="w-8 h-8 rounded-lg bg-neutral-50 border border-neutral-200 flex items-center justify-center p-1">
                <Image
                  src={option.logo}
                  alt={option.name}
                  width={24}
                  height={24}
                  className="object-contain w-full h-full"
                />
              </div>
              <span className="text-xs font-bold text-neutral-800">{option.name}</span>
              <span className="text-[10px] text-neutral-500 capitalize">{option.type === 'qris' ? 'Scan QR' : option.type === 'ewallet' ? 'E-Wallet' : 'Transfer Bank'}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Payment Details */}
      {selectedMethod && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-neutral-200 bg-white p-6 space-y-6"
        >
          <div className="flex items-center gap-3 pb-4 border-b border-neutral-100">
            <div className="w-8 h-8 rounded-lg bg-neutral-50 border flex items-center justify-center p-1">
              <Image src={selectedMethod.logo} alt={selectedMethod.name} width={24} height={24} className="object-contain" />
            </div>
            <div>
              <h4 className="font-bold text-neutral-900">{selectedMethod.name}</h4>
              <p className="text-xs text-neutral-500">{selectedMethod.type === 'qris' ? 'Scan kode QR untuk membayar' : selectedMethod.type === 'ewallet' ? 'Transfer ke nomor e-wallet' : 'Transfer ke rekening bank'}</p>
            </div>
          </div>

          {/* QRIS Display */}
          {selectedMethod.type === 'qris' && (
            <div className="flex flex-col items-center">
              <div className="w-56 h-56 rounded-2xl border-4 border-brand-primary/20 flex items-center justify-center bg-white overflow-hidden p-2">
                <Image
                  src="/qris-scan.png"
                  alt="QRIS Dorm Care"
                  width={220}
                  height={220}
                  className="object-contain w-full h-full"
                />
              </div>
              <p className="text-sm text-neutral-600 mt-4 text-center max-w-md">
                Buka aplikasi e-wallet atau mobile banking Anda, lalu scan kode QRIS di atas.
              </p>
            </div>
          )}

          {/* E-Wallet / Bank Account Info */}
          {(selectedMethod.type === 'ewallet' || selectedMethod.type === 'bank') && selectedMethod.accountNumber && (
            <div className="bg-neutral-50 rounded-xl p-4">
              <p className="text-xs text-neutral-500 mb-1">
                {selectedMethod.type === 'ewallet' ? 'Nomor Telepon' : 'Nomor Rekening'} {selectedMethod.name}
              </p>
              <div className="flex items-center justify-between">
                <p className="font-display text-lg font-bold text-neutral-900 tracking-wide">
                  {selectedMethod.accountNumber}
                </p>
                <button
                  onClick={() => handleCopyToClipboard(selectedMethod.accountNumber!)}
                  className="p-2 bg-white rounded-lg border text-brand-primary hover:bg-neutral-100 transition"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>
              {selectedMethod.accountName && (
                <p className="text-xs font-semibold text-neutral-600 mt-1">A.N {selectedMethod.accountName}</p>
              )}
            </div>
          )}

          {/* Payment Steps */}
          <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
            <p className="text-xs font-bold text-blue-900 mb-2">Langkah Pembayaran:</p>
            <ol className="space-y-1.5 text-xs text-blue-800">
              {selectedMethod.type === 'qris' ? (
                <>
                  <li>1. Buka aplikasi e-wallet atau mobile banking Anda</li>
                  <li>2. Pilih menu Bayar / Scan QR</li>
                  <li>3. Scan kode QRIS di atas</li>
                  <li>4. Masukkan nominal: {formatRupiah(totalAmount)}</li>
                  <li>5. Selesaikan pembayaran dan upload bukti di bawah</li>
                </>
              ) : selectedMethod.type === 'ewallet' ? (
                <>
                  <li>1. Buka aplikasi {selectedMethod.name} Anda</li>
                  <li>2. Pilih menu Transfer / Send Money</li>
                  <li>3. Masukkan nomor {selectedMethod.name} di atas</li>
                  <li>4. Transfer sejumlah {formatRupiah(totalAmount)}</li>
                  <li>5. Screenshot bukti dan upload di bawah</li>
                </>
              ) : (
                <>
                  <li>1. Buka mobile banking atau ATM {selectedMethod.name} Anda</li>
                  <li>2. Pilih menu Transfer ke {selectedMethod.name}</li>
                  <li>3. Masukkan nomor rekening di atas</li>
                  <li>4. Transfer sejumlah {formatRupiah(totalAmount)}</li>
                  <li>5. Screenshot/foto bukti transfer dan upload di bawah</li>
                </>
              )}
            </ol>
          </div>

          {/* Payment Proof Upload (mandatory for ALL methods) */}
          <div>
            <h4 className="font-bold text-neutral-900 mb-3">Upload Bukti Pembayaran *</h4>
            <div
              className={`relative overflow-hidden border-2 border-dashed rounded-xl p-6 text-center transition cursor-pointer ${
                uploadedProof
                  ? 'border-green-400 bg-green-50'
                  : 'border-brand-primary/30 hover:border-brand-primary bg-white'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              {uploadedProof ? (
                <div className="flex flex-col items-center">
                  <div className="relative w-full max-w-xs mx-auto">
                    <img
                      src={uploadedProof}
                      alt="Bukti Pembayaran"
                      className="w-full h-40 object-cover rounded-xl border border-neutral-200"
                    />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setUploadedProof(null); }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 text-xs"
                    >
                      Hapus
                    </button>
                  </div>
                  <p className="text-sm font-semibold text-green-700 mt-3">
                    Bukti pembayaran berhasil diupload
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    Klik untuk mengganti
                  </p>
                </div>
              ) : (
                <div>
                  <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-neutral-900">
                    Klik untuk upload bukti pembayaran
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">
                    Format: JPG, PNG (maks 5MB)
                  </p>
                  <p className="text-xs text-error mt-2 font-semibold">
                    * Wajib diisi untuk semua metode pembayaran
                  </p>
                </div>
              )}
            </div>
            {uploadingToSupabase && (
              <p className="text-xs text-brand-primary mt-2 animate-pulse">Mengupload ke server...</p>
            )}
          </div>

          {/* Total Confirmation */}
          <div className="rounded-xl bg-brand-primary-light/20 border border-brand-primary/20 p-4">
            <p className="text-sm font-semibold text-neutral-800 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Total pembayaran: <span className="text-brand-primary font-display text-lg">{formatRupiah(totalAmount)}</span>
            </p>
            <p className="text-xs text-neutral-600 mt-1">
              Pembayaran akan diverifikasi admin dalam 1x24 jam.
            </p>
          </div>
        </motion.div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-neutral-200">
        <button
          onClick={() => setStep('confirm')}
          className="px-6 py-3 border border-neutral-200 text-neutral-900 font-semibold rounded-xl hover:bg-neutral-50 transition-all"
        >
          ← Ubah
        </button>
        <button
          onClick={handleConfirmPayment}
          className="px-6 py-3 bg-brand-primary text-white font-semibold rounded-xl hover:bg-brand-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Konfirmasi Pembayaran →
        </button>
      </div>
    </div>
  );
}
