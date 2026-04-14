'use client';

import { motion } from 'framer-motion';
import { QrCode, Smartphone, Landmark, Copy, CheckCircle2 } from 'lucide-react';
import { useBookingStore } from '@/state/booking-store';
import { formatRupiah } from '@/lib/utils';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';

const BANK_OPTIONS = [
  { id: 'bca', name: 'BCA', number: '4831-2104-4000', account: 'A.N DORM CARE' },
  { id: 'mandiri', name: 'Mandiri', number: '1410-0172-8283', account: 'A.N DORM CARE' },
  { id: 'bni', name: 'BNI', number: '0212-3456-7890', account: 'A.N DORM CARE' },
];

const EWALLET_OPTIONS = [
  { id: 'gopay', name: 'GoPay', number: '0812-3456-7890' },
  { id: 'dana', name: 'DANA', number: '0812-3456-7890' },
  { id: 'shopeepay', name: 'ShopeePay', number: '0812-3456-7890' },
];

export default function Step4Payment() {
  const {
    paymentMethod,
    setPaymentMethod,
    totalAmount,
    selectedServiceName,
    setOrderNumber,
    setStep,
  } = useBookingStore();

  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [selectedEwallet, setSelectedEwallet] = useState<string | null>(null);
  const [uploadedProof, setUploadedProof] = useState<string | null>(null);

  // Generate order ID
  const [orderId, setOrderId] = useState<string>('');
  
  useEffect(() => {
    setTimeout(() => {
      setOrderId(`DC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
    }, 0);
  }, []);

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Nomor berhasil disalin!');
  };

  const handleConfirmPayment = () => {
    const method = paymentMethod as string;
    if (method === 'transfer_bank' && !uploadedProof) {
      toast.error('Mohon upload bukti transfer terlebih dahulu');
      return;
    }

    if (['gopay', 'dana', 'shopeepay'].includes(method) && !selectedEwallet) {
      toast.error('Pilih provider e-wallet terlebih dahulu');
      return;
    }

    if (method === 'transfer_bank' && !selectedBank) {
      toast.error('Pilih bank tujuan terlebih dahulu');
      return;
    }

    // Simulate payment processing
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

      {/* Payment Method Tabs */}
      <div className="flex justify-center gap-3 bg-neutral-100 p-2 rounded-xl w-fit mx-auto">
        {(['qris', 'ewallet', 'transfer_bank'] as const).map((method) => {
          const label = method === 'ewallet' ? 'E-Wallet' : method === 'transfer_bank' ? 'Transfer' : 'QRIS';
          const isActive = method === 'qris' ? paymentMethod === 'qris'
            : method === 'ewallet' ? ['gopay', 'dana', 'shopeepay'].includes(paymentMethod as string)
            : paymentMethod === 'transfer_bank';
          return (
            <button
              key={method}
              onClick={() => {
                if (method === 'ewallet') {
                  setPaymentMethod('gopay');
                } else {
                  setPaymentMethod(method);
                }
                setSelectedBank(null);
                setSelectedEwallet(null);
                setUploadedProof(null);
              }}
              className={`px-5 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              {method === 'qris' && <QrCode className="w-4 h-4" />}
              {method === 'ewallet' && <Smartphone className="w-4 h-4" />}
              {method === 'transfer_bank' && <Landmark className="w-4 h-4" />}
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {/* QRIS Method */}
      {paymentMethod === 'qris' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="rounded-2xl border border-neutral-200 bg-white p-8 flex flex-col items-center">
            <div className="w-48 h-48 bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-2xl border-4 border-brand-primary/20 flex items-center justify-center mb-6">
              <QrCode className="w-32 h-32 text-neutral-400" />
            </div>

            <h3 className="font-display text-xl font-bold text-neutral-900 mb-2">
              Scan QRIS Dorm Care
            </h3>
            <p className="text-sm text-neutral-600 text-center max-w-md">
              Gunakan aplikasi e-wallet apapun (GoPay, OVO, Dana, LinkAja, dll) atau
              mobile banking Anda untuk scan kode QR di atas.
            </p>
          </div>

          <div className="rounded-2xl border border-brand-primary/20 bg-brand-primary-light/10 p-6">
            <p className="text-sm font-semibold text-neutral-800 flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Total pembayaran: <span className="text-brand-primary">{formatRupiah(totalAmount)}</span>
            </p>
            <p className="text-xs text-neutral-600">
              Pastikan nominal cocok sebelum melakukan transfer. Konfirmasi pembayaran dapat
              memakan waktu hingga 5 menit.
            </p>
          </div>
        </motion.div>
      )}

      {/* E-Wallet Method */}
      {['gopay', 'dana', 'shopeepay'].includes(paymentMethod as string) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h3 className="font-display font-bold text-neutral-900 mb-4">
              Pilih Provider E-Wallet
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {EWALLET_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedEwallet(option.id)}
                  className={`h-24 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all font-bold text-sm capitalize ${
                    selectedEwallet === option.id
                      ? 'border-brand-primary bg-brand-primary-light/10 text-brand-primary shadow-sm'
                      : 'border-neutral-200 bg-white text-neutral-700 hover:border-brand-primary/50'
                  }`}
                >
                  <Smartphone className="w-5 h-5" />
                  {option.name}
                </button>
              ))}
            </div>
          </div>

          {selectedEwallet && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-neutral-200 bg-white p-6 space-y-4"
            >
              <h4 className="font-bold text-neutral-900">Detail Pembayaran</h4>
              <div className="bg-neutral-50 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-neutral-500 mb-1">
                    Nomor {EWALLET_OPTIONS.find((e) => e.id === selectedEwallet)?.name}
                  </p>
                  <p className="font-display text-lg font-bold text-neutral-900 tracking-wide">
                    {EWALLET_OPTIONS.find((e) => e.id === selectedEwallet)?.number}
                  </p>
                </div>
                <button
                  onClick={() =>
                    handleCopyToClipboard(
                      EWALLET_OPTIONS.find((e) => e.id === selectedEwallet)?.number || ''
                    )
                  }
                  className="p-2 bg-white rounded-lg border text-brand-primary hover:bg-neutral-100 transition"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>

              <ol className="space-y-2 text-sm">
                <li className="flex gap-3">
                  <span className="font-bold text-brand-primary">1.</span>
                  <span>Buka aplikasi {EWALLET_OPTIONS.find((e) => e.id === selectedEwallet)?.name} Anda</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-brand-primary">2.</span>
                  <span>Pilih menu Transfer/Send Money</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-brand-primary">3.</span>
                  <span>
                    Masukkan nomor{' '}
                    {EWALLET_OPTIONS.find((e) => e.id === selectedEwallet)?.name}{' '}
                    di atas
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-brand-primary">4.</span>
                  <span>Transfer sejumlah {formatRupiah(totalAmount)}</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-brand-primary">5.</span>
                  <span>Selesaikan dan klik tombol di bawah</span>
                </li>
              </ol>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Transfer Bank Method */}
      {paymentMethod === 'transfer_bank' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h3 className="font-display font-bold text-neutral-900 mb-4">
              Pilih Bank Tujuan
            </h3>
            <div className="flex gap-3 flex-wrap">
              {BANK_OPTIONS.map((bank) => (
                <button
                  key={bank.id}
                  onClick={() => setSelectedBank(bank.id)}
                  className={`px-6 py-3 rounded-xl border-2 font-bold uppercase transition-all ${
                    selectedBank === bank.id
                      ? 'border-brand-primary bg-brand-primary-light/10 text-brand-primary shadow-sm'
                      : 'border-neutral-200 bg-white text-neutral-700 hover:border-brand-primary/50'
                  }`}
                >
                  {bank.name}
                </button>
              ))}
            </div>
          </div>

          {selectedBank && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-neutral-200 bg-white p-6 space-y-4"
            >
              <div>
                <h4 className="font-bold text-neutral-900 mb-4">Detail Rekening Tujuan</h4>
                <div className="bg-neutral-50 rounded-xl p-4 flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-neutral-500 mb-1">
                      Nomor Rekening {BANK_OPTIONS.find((b) => b.id === selectedBank)?.name}
                    </p>
                    <p className="font-display text-lg font-bold text-neutral-900 tracking-wide">
                      {BANK_OPTIONS.find((b) => b.id === selectedBank)?.number}
                    </p>
                    <p className="text-xs font-semibold text-neutral-600 mt-2">
                      {BANK_OPTIONS.find((b) => b.id === selectedBank)?.account}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      handleCopyToClipboard(
                        BANK_OPTIONS.find((b) => b.id === selectedBank)?.number || ''
                      )
                    }
                    className="p-2 bg-white rounded-lg border text-brand-primary hover:bg-neutral-100 transition"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="border-t border-neutral-200 pt-4">
                <h4 className="font-bold text-neutral-900 mb-3">Upload Bukti Transfer</h4>
                <div className="relative overflow-hidden border-2 border-dashed border-brand-primary/30 rounded-xl p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setUploadedProof(event.target?.result as string);
                          toast.success('Bukti transfer berhasil diupload');
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="sr-only"
                    id="proof-upload"
                  />
                  <label
                    htmlFor="proof-upload"
                    className="cursor-pointer block"
                  >
                    {uploadedProof ? (
                      <div className="flex flex-col items-center">
                        <CheckCircle2 className="w-8 h-8 text-green-600 mb-2" />
                        <p className="text-sm font-semibold text-neutral-900">
                          Bukti berhasil diupload
                        </p>
                        <p className="text-xs text-neutral-500 mt-1">
                          Klik untuk mengubah
                        </p>
                      </div>
                    ) : (
                      <div>
                        <Copy className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                        <p className="text-sm font-semibold text-neutral-900">
                          Klik untuk upload bukti
                        </p>
                        <p className="text-xs text-neutral-500 mt-1">
                          Format: JPG, PNG (maks 5MB)
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </motion.div>
          )}
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
          className="px-6 py-3 bg-brand-primary text-white font-semibold rounded-xl hover:bg-brand-primary-dark transition-all"
        >
          Konfirmasi Pembayaran →
        </button>
      </div>
    </div>
  );
}
