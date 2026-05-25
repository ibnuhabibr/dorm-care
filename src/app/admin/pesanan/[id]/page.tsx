'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Clock, XCircle, Phone, CheckCheck, Truck, Play, Ban, Receipt, MapPin, Calendar, User, MessageSquare, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';
import { AdminNav } from '@/components/admin-nav';
import { formatRupiah } from '@/lib/utils';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

type AppStatus = 'pending' | 'diterima' | 'menuju' | 'dikerjakan' | 'selesai' | 'dibatalkan';

const statusFlow: { status: AppStatus; label: string; icon: React.ReactNode; dbValue: string }[] = [
  { status: 'pending', label: 'Pending', icon: <Clock className="size-4" />, dbValue: 'pending_confirmation' },
  { status: 'diterima', label: 'Diterima', icon: <CheckCheck className="size-4" />, dbValue: 'confirmed' },
  { status: 'menuju', label: 'Menuju Lokasi', icon: <Truck className="size-4" />, dbValue: 'on_the_way' },
  { status: 'dikerjakan', label: 'Dikerjakan', icon: <Play className="size-4" />, dbValue: 'in_progress' },
  { status: 'selesai', label: 'Selesai', icon: <CheckCircle2 className="size-4" />, dbValue: 'completed' },
  { status: 'dibatalkan', label: 'Dibatalkan', icon: <Ban className="size-4" />, dbValue: 'cancelled' },
];

const dbToAppStatus = (dbStatus: string): AppStatus => {
  const map: Record<string, AppStatus> = {
    'pending_confirmation': 'pending',
    'confirmed': 'diterima',
    'on_the_way': 'menuju',
    'in_progress': 'dikerjakan',
    'completed': 'selesai',
    'cancelled': 'dibatalkan',
  };
  return map[dbStatus] || 'pending';
};

const appToDbStatus = (appStatus: AppStatus): string => {
  const map: Record<string, string> = {
    'pending': 'pending_confirmation',
    'diterima': 'confirmed',
    'menuju': 'on_the_way',
    'dikerjakan': 'in_progress',
    'selesai': 'completed',
    'dibatalkan': 'cancelled',
  };
  return map[appStatus] || 'pending_confirmation';
};

const statusColor: Record<AppStatus, string> = {
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  diterima: 'bg-blue-50 text-blue-700 border-blue-200',
  menuju: 'bg-orange-50 text-orange-700 border-orange-200',
  dikerjakan: 'bg-brand-primary-light text-brand-primary-dark border-brand-primary/20',
  selesai: 'bg-neutral-100 text-neutral-600 border-neutral-200',
  dibatalkan: 'bg-red-50 text-red-600 border-red-200',
};

interface OrderDetail {
  id: string;
  orderNumber: string;
  userId: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  totalAmount: number;
  discountAmount: number;
  promoCode: string;
  address: string;
  area: string;
  scheduledDate: string;
  scheduledTime: string;
  notes: string;
  status: AppStatus;
  dbStatus: string;
  mitraName: string;
  mitraPhone: string;
  laundryDistance: number;
  createdAt: string;
  updatedAt: string;
  // Customer
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  // Payment
  paymentMethod: string;
  bankName: string;
  proofUrl: string;
  paymentStatus: string;
}

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [proofModal, setProofModal] = useState(false);

  const fetchOrder = async () => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        profiles (
          first_name,
          last_name,
          phone,
          email
        )
      `)
      .eq('order_number', params.id)
      .single();

    if (error || !data) {
      toast.error('Pesanan tidak ditemukan');
      setLoading(false);
      return;
    }

    // Fetch transaction
    const { data: txData } = await supabase
      .from('transactions')
      .select('*')
      .eq('order_id', data.id)
      .maybeSingle();

    const d = data as any;
    setOrder({
      id: d.id,
      orderNumber: d.order_number,
      userId: d.user_id,
      serviceId: d.service_id,
      serviceName: d.service_name,
      servicePrice: d.service_price,
      totalAmount: d.total_amount,
      discountAmount: d.discount_amount || 0,
      promoCode: d.promo_code || '',
      address: d.address || '',
      area: d.area || '',
      scheduledDate: d.scheduled_date || '',
      scheduledTime: d.scheduled_time || '',
      notes: d.notes || '',
      status: dbToAppStatus(d.status),
      dbStatus: d.status,
      mitraName: d.mitra_name || '',
      mitraPhone: d.mitra_phone || '',
      laundryDistance: d.laundry_distance || 0,
      createdAt: d.created_at,
      updatedAt: d.updated_at,
      customerName: d.profiles ? `${d.profiles.first_name} ${d.profiles.last_name || ''}`.trim() : 'Unknown',
      customerPhone: d.profiles?.phone || '-',
      customerEmail: d.profiles?.email || '-',
      paymentMethod: txData?.payment_method || '-',
      bankName: txData?.bank_name || '',
      proofUrl: txData?.proof_url || '',
      paymentStatus: txData?.status || 'pending',
    });
    setLoading(false);
  };

  useEffect(() => {
    fetchOrder();
  }, [params.id]);

  const updateStatus = async (newStatus: AppStatus) => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase || !order) return;

    const { error } = await supabase
      .from('orders')
      .update({ status: appToDbStatus(newStatus) })
      .eq('id', order.id);

    if (error) {
      toast.error('Gagal update status: ' + error.message);
      return;
    }

    toast.success(`Status diubah ke "${statusFlow.find(s => s.status === newStatus)?.label}"`);
    setOrder((prev) => prev ? { ...prev, status: newStatus, dbStatus: appToDbStatus(newStatus) } : null);
  };

  if (loading) {
    return (
      <div className="pb-20 pt-10">
        <AdminNav />
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="size-10 animate-spin rounded-full border-4 border-neutral-200 border-t-brand-primary" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="pb-20 pt-10">
        <AdminNav />
        <div className="rounded-3xl border border-neutral-200 bg-white p-12 text-center">
          <XCircle className="size-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-neutral-900 mb-2">Pesanan Tidak Ditemukan</h2>
          <button onClick={() => router.push('/admin/pesanan')} className="text-brand-primary font-semibold hover:underline">
            Kembali ke daftar pesanan
          </button>
        </div>
      </div>
    );
  }

  const currentStepIndex = statusFlow.findIndex(s => s.status === order.status);
  const isFinal = order.status === 'selesai' || order.status === 'dibatalkan';

  return (
    <div className="space-y-6 pb-20 pt-10">
      {/* Header */}
      <section className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => router.push('/admin/pesanan')}
            className="p-2 rounded-xl border border-neutral-200 hover:bg-neutral-50 transition"
          >
            <ArrowLeft className="size-5 text-neutral-600" />
          </button>
          <div>
            <p className="section-label">Admin Dorm Care</p>
            <h1 className="h2-title mt-1 text-neutral-900">Detail Pesanan</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-lg font-bold text-brand-primary">#{order.orderNumber}</span>
          <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${statusColor[order.status]}`}>
            {order.status === 'selesai' && <CheckCircle2 className="size-3" />}
            {order.status === 'dikerjakan' && <Clock className="size-3" />}
            {order.status === 'dibatalkan' && <XCircle className="size-3" />}
            {order.status}
          </span>
        </div>
      </section>

      <AdminNav />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Progress */}
          <section className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h3 className="font-bold text-neutral-900 mb-4">Progress Status</h3>
            <div className="relative">
              <div className="absolute top-5 left-0 right-0 h-1 bg-neutral-200 rounded-full" />
              <div
                className="absolute top-5 left-0 h-1 bg-brand-primary rounded-full transition-all duration-500"
                style={{ width: `${order.status === 'dibatalkan' ? 0 : (currentStepIndex / (statusFlow.length - 2)) * 100}%` }}
              />
              <div className="relative flex justify-between">
                {statusFlow.filter(s => s.status !== 'dibatalkan').map((step, i) => {
                  const isCompleted = i < currentStepIndex;
                  const isCurrent = i === currentStepIndex;
                  const isCancelled = order.status === 'dibatalkan';

                  return (
                    <div key={step.status} className="flex flex-col items-center">
                      <div className={`relative z-10 size-10 rounded-full flex items-center justify-center border-2 transition ${
                        isCancelled ? 'border-red-200 bg-white text-red-400' :
                        isCompleted ? 'border-brand-primary bg-brand-primary text-white' :
                        isCurrent ? 'border-brand-primary bg-brand-primary-light text-brand-primary' :
                        'border-neutral-200 bg-white text-neutral-400'
                      }`}>
                        {step.icon}
                      </div>
                      <p className="text-[10px] font-semibold text-neutral-600 mt-2 text-center">{step.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {order.status === 'dibatalkan' && (
              <div className="mt-6 rounded-xl bg-red-50 border border-red-200 p-4 text-center">
                <Ban className="size-8 text-red-500 mx-auto mb-2" />
                <p className="font-bold text-red-700">Pesanan Dibatalkan</p>
              </div>
            )}
          </section>

          {/* Order Info */}
          <section className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h3 className="font-bold text-neutral-900 mb-4">Informasi Pesanan</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <Calendar className="size-5 text-neutral-400 mt-0.5" />
                <div>
                  <p className="text-xs text-neutral-500">Jadwal Layanan</p>
                  <p className="font-semibold text-neutral-900">
                    {new Date(`${order.scheduledDate}T${order.scheduledTime}`).toLocaleDateString('id-ID', {
                      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </p>
                  <p className="text-sm text-neutral-600">{order.scheduledTime}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="size-5 text-neutral-400 mt-0.5" />
                <div>
                  <p className="text-xs text-neutral-500">Alamat</p>
                  <p className="font-semibold text-neutral-900">{order.address}</p>
                  <p className="text-sm text-neutral-600">{order.area}</p>
                </div>
              </div>
              {order.laundryDistance > 0 && (
                <div className="flex items-start gap-3">
                  <Truck className="size-5 text-neutral-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-neutral-500">Jarak Laundry</p>
                    <p className="font-semibold text-neutral-900">{order.laundryDistance} km</p>
                  </div>
                </div>
              )}
              {order.notes && (
                <div className="flex items-start gap-3 sm:col-span-2">
                  <MessageSquare className="size-5 text-neutral-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-neutral-500">Catatan</p>
                    <p className="font-semibold text-neutral-900">{order.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Payment Info */}
          <section className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h3 className="font-bold text-neutral-900 mb-4">Informasi Pembayaran</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-neutral-500">Metode Pembayaran</p>
                <p className="font-semibold text-neutral-900 capitalize">{order.paymentMethod}</p>
              </div>
              {order.bankName && (
                <div>
                  <p className="text-xs text-neutral-500">Bank / E-Wallet</p>
                  <p className="font-semibold text-neutral-900">{order.bankName}</p>
                </div>
              )}
              {order.promoCode && (
                <div>
                  <p className="text-xs text-neutral-500">Kode Promo</p>
                  <p className="font-semibold text-neutral-900">{order.promoCode}</p>
                </div>
              )}
              {order.discountAmount > 0 && (
                <div>
                  <p className="text-xs text-neutral-500">Diskon</p>
                  <p className="font-semibold text-green-600">-{formatRupiah(order.discountAmount)}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-neutral-500">Status Pembayaran</p>
                <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${
                  order.paymentStatus === 'verified' ? 'bg-green-50 text-green-700 border-green-200' :
                  order.paymentStatus === 'rejected' ? 'bg-red-50 text-red-600 border-red-200' :
                  'bg-yellow-50 text-yellow-700 border-yellow-200'
                }`}>
                  {order.paymentStatus}
                </span>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs text-neutral-500">Total Pembayaran</p>
                <p className="font-display text-2xl font-extrabold text-brand-primary">{formatRupiah(order.totalAmount)}</p>
              </div>
            </div>

            {order.proofUrl && (
              <div className="mt-4 pt-4 border-t border-neutral-100">
                <button
                  onClick={() => setProofModal(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100 transition"
                >
                  <Receipt className="size-4" />
                  Lihat Bukti Pembayaran
                </button>
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <section className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h3 className="font-bold text-neutral-900 mb-4">Pelanggan</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <User className="size-5 text-neutral-400 mt-0.5" />
                <div>
                  <p className="font-semibold text-neutral-900">{order.customerName}</p>
                  <p className="text-xs text-neutral-500">{order.customerEmail}</p>
                </div>
              </div>
              {order.customerPhone && order.customerPhone !== '-' && (
                <div className="flex items-center gap-3">
                  <Phone className="size-5 text-neutral-400" />
                  <p className="font-semibold text-neutral-900">{order.customerPhone}</p>
                </div>
              )}
            </div>
          </section>

          {/* Service Info */}
          <section className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h3 className="font-bold text-neutral-900 mb-4">Layanan</h3>
            <p className="font-semibold text-neutral-900">{order.serviceName}</p>
            <p className="text-sm text-neutral-500 mt-1">Harga: {formatRupiah(order.servicePrice)}</p>
            {order.mitraName && (
              <div className="mt-3 pt-3 border-t border-neutral-100">
                <p className="text-xs text-neutral-500">Mitra</p>
                <p className="font-semibold text-neutral-900">{order.mitraName}</p>
                {order.mitraPhone && <p className="text-sm text-neutral-600">{order.mitraPhone}</p>}
              </div>
            )}
          </section>

          {/* Actions */}
          {!isFinal && (
            <section className="rounded-2xl border border-neutral-200 bg-white p-6">
              <h3 className="font-bold text-neutral-900 mb-4">Ubah Status</h3>
              <div className="space-y-2">
                {statusFlow.filter(s => s.status !== 'pending' && s.status !== 'dibatalkan').map((step) => {
                  const isActive = order.status === step.status;
                  const isPast = currentStepIndex > statusFlow.findIndex(s => s.status === step.status);
                  return (
                    <button
                      key={step.status}
                      disabled={isActive}
                      onClick={() => updateStatus(step.status)}
                      className={`w-full inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                        isActive
                          ? 'bg-neutral-100 text-neutral-500 cursor-not-allowed'
                          : isPast
                          ? 'border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                          : 'bg-brand-primary text-white hover:bg-brand-primary-dark'
                      }`}
                    >
                      {step.icon}
                      {step.label}
                      {isActive && ' (saat ini)'}
                    </button>
                  );
                })}
                <hr className="my-2" />
                <button
                  onClick={() => updateStatus('dibatalkan')}
                  className="w-full inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition"
                >
                  <Ban className="size-4" />
                  Batalkan Pesanan
                </button>
              </div>
            </section>
          )}

          {/* Timestamps */}
          <section className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h3 className="font-bold text-neutral-900 mb-3">Riwayat</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-500">Dibuat</span>
                <span className="text-neutral-700">{new Date(order.createdAt).toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Diperbarui</span>
                <span className="text-neutral-700">{new Date(order.updatedAt).toLocaleString('id-ID')}</span>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Payment Proof Modal */}
      {proofModal && order.proofUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setProofModal(false)}
        >
          <div
            className="relative bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div>
                <h3 className="font-bold text-neutral-900">Bukti Pembayaran</h3>
                <p className="text-xs text-neutral-500">{order.orderNumber}</p>
              </div>
              <button onClick={() => setProofModal(false)} className="p-2 rounded-lg hover:bg-neutral-100 transition">
                <XCircle className="size-5 text-neutral-500" />
              </button>
            </div>
            <div className="p-6">
              <img
                src={order.proofUrl}
                alt="Bukti Pembayaran"
                className="w-full h-auto rounded-xl border border-neutral-200"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
