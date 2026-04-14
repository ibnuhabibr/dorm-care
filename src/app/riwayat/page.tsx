"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Filter, MessageSquare, ChevronDown, ChevronUp, MapPin, CreditCard, RotateCcw, Star, Phone, CheckCircle2, XCircle } from "lucide-react";
import toast from "react-hot-toast";

import { formatRupiah } from "@/lib/utils";

import { useSessionStore } from "@/state/session-store";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const tabs = [
  { id: "all", label: "Semua" },
  { id: "active", label: "Aktif" },
  { id: "completed", label: "Selesai" },
  { id: "cancelled", label: "Dibatalkan" }
];

export default function RiwayatPage() {
  const { user } = useSessionStore();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedOrders, setExpandedOrders] = useState<string[]>([]);
  const [reviewModal, setReviewModal] = useState<{isOpen: boolean, orderId: string | null}>({ isOpen: false, orderId: null });
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalOrders: 0, activeOrders: 0, totalSpent: 0 });

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) return;
      const supabase = getSupabaseBrowserClient();
      if (!supabase) return;

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data && !error) {
        const mappedOrders = data.map(d => ({
          id: d.order_number,
          dbId: d.id,
          date: d.created_at,
          serviceName: d.service_name,
          price: d.total_amount,
          status: d.status,
          paymentMethod: "-",
          address: d.address,
          notes: d.notes,
          partner: d.mitra_name || "Mencari Mitra...",
          reviewed: !!d.rating,
          timeline: [
            { status: "Diterima", time: new Date(d.created_at).toLocaleTimeString("id", {hour:'2-digit', minute:'2-digit'}), done: true },
            { status: "Menunggu", time: null, done: ["confirmed", "on_the_way", "in_progress", "completed"].includes(d.status) },
            { status: "Dikerjakan", time: null, done: ["in_progress", "completed"].includes(d.status) },
            { status: "Selesai", time: null, done: d.status === "completed" },
          ]
        }));
        setOrders(mappedOrders);

        setStats({
          totalOrders: mappedOrders.length,
          activeOrders: mappedOrders.filter(o => ["pending_confirmation", "confirmed", "on_the_way", "in_progress"].includes(o.status)).length,
          totalSpent: mappedOrders.filter(o => o.status === "completed").reduce((sum, o) => sum + o.price, 0)
        });
      }
    };
    fetchOrders();
  }, [user?.id]);

  const toggleExpand = (id: string) => {
    setExpandedOrders(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const filteredOrders = orders.filter(order => {
    const matchesTab = activeTab === "all" 
      || (activeTab === "active" && ["pending_confirmation", "confirmed", "on_the_way", "in_progress"].includes(order.status))
      || (activeTab === "completed" && order.status === "completed")
      || (activeTab === "cancelled" && order.status === "cancelled");
      
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) 
      || order.serviceName.toLowerCase().includes(searchQuery.toLowerCase());
      
    return matchesTab && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending_confirmation": return <span className="px-2.5 py-1 rounded-md bg-yellow-100 text-yellow-800 text-[10px] font-bold uppercase tracking-wider">Menunggu</span>;
      case "confirmed": return <span className="px-2.5 py-1 rounded-md bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-wider">Dikonfirmasi</span>;
      case "on_the_way": return <span className="px-2.5 py-1 rounded-md bg-orange-100 text-orange-800 text-[10px] font-bold uppercase tracking-wider">Mitra Menuju</span>;
      case "in_progress": return <span className="px-2.5 py-1 rounded-md bg-green-100 text-green-800 text-[10px] font-bold uppercase tracking-wider max-w-fit flex items-center gap-1"><span className="size-1.5 rounded-full bg-green-500 animate-pulse"/> Dikerjakan</span>;
      case "completed": return <span className="px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-600 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"><CheckCircle2 className="size-3" /> Selesai</span>;
      case "cancelled": return <span className="px-2.5 py-1 rounded-md bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"><XCircle className="size-3" /> Dibatalkan</span>;
      default: return null;
    }
  };

  const handleReviewSubmit = () => {
    if (rating === 0) return toast.error("Berikan rating bintang terlebih dahulu.");
    toast.success("Ulasan berhasil dikirim! Terima kasih.");
    setReviewModal({ isOpen: false, orderId: null });
    setRating(0);
    setReviewText("");
  };

  return (
    <div className="pb-24 pt-8 bg-surface-base min-h-screen">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        
        {/* Header Stats */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-extrabold text-neutral-900 mb-6">Riwayat Layanan</h1>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
              <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Total Pesanan</p>
              <p className="font-display text-2xl font-bold text-neutral-900">{stats.totalOrders}</p>
            </div>
            <div className="bg-brand-primary-light/30 p-5 rounded-2xl border border-brand-primary/20 shadow-sm">
              <p className="text-xs font-bold text-brand-primary-dark uppercase tracking-wider mb-1">Pesanan Aktif</p>
              <p className="font-display text-2xl font-bold text-brand-primary-dark">{stats.activeOrders}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
              <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Total Pengeluaran</p>
              <p className="font-display text-2xl font-bold text-neutral-900">{formatRupiah(stats.totalSpent)}</p>
            </div>
          </div>
        </div>

        {/* Toolbar: Search & Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex bg-white p-1 rounded-xl border border-neutral-200 shadow-sm overflow-x-auto hide-scrollbar">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2 text-sm font-bold rounded-lg transition-all whitespace-nowrap ${
                  activeTab === tab.id ? "bg-brand-primary text-white shadow-sm" : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
              <input 
                type="text" 
                placeholder="Cari Order ID / Layanan"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
              />
            </div>
            <button className="flex items-center justify-center size-11 rounded-xl border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 transition shrink-0">
              <Filter className="size-4" />
            </button>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-neutral-200 p-12 flex flex-col items-center justify-center text-center">
              <div className="size-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
                <Search className="size-8 text-neutral-400" />
              </div>
              <p className="font-bold text-neutral-900 mb-1">Pencarian Tidak Ditemukan</p>
              <p className="text-sm text-neutral-500">Coba gunakan kata kunci lain atau ubah filter status.</p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const isExpanded = expandedOrders.includes(order.id);
              const isActive = ["pending_confirmation", "confirmed", "on_the_way", "in_progress"].includes(order.status);
              
              return (
                <div key={order.id} className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden transition-all hover:border-brand-primary/30">
                  {/* Card Header area (Always visible) */}
                  <div className="p-5 md:p-6 pb-0">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1.5">
                          <span className="font-mono text-xs font-bold text-brand-primary bg-brand-primary-light/30 px-2 py-0.5 rounded border border-brand-primary/20">{order.id}</span>
                          <span className="text-xs text-neutral-500">{new Date(order.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute:'2-digit' })}</span>
                        </div>
                        <h3 className="font-display text-lg font-bold text-neutral-900">{order.serviceName}</h3>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(order.status)}
                        <p className="font-bold text-neutral-900 mt-2">{formatRupiah(order.price)}</p>
                      </div>
                    </div>

                    {/* Progress Tracker Horizontal (only if not cancelled) */}
                    {order.status !== "cancelled" && (
                      <div className="mt-6 mb-2">
                        <div className="flex justify-between relative">
                          <div className="absolute top-2 left-[10%] right-[10%] h-[2px] bg-neutral-100 -z-10" />
                          <div 
                            className="absolute top-2 left-[10%] h-[2px] bg-brand-primary -z-10 transition-all duration-700" 
                            style={{ width: 
                                order.status === "completed" ? "80%" : 
                                order.status === "in_progress" ? "55%" : 
                                order.status === "on_the_way" ? "25%" : "0%" 
                            }} 
                          />
                          
                          {["Diterima", "Menuju", "Dikerjakan", "Selesai"].map((stepText, idx) => {
                            const isDone = 
                              order.status === "completed" || 
                              (idx === 0) || 
                              (idx === 1 && ["on_the_way", "in_progress"].includes(order.status)) ||
                              (idx === 2 && order.status === "in_progress");
                              
                            return (
                              <div key={idx} className="flex flex-col items-center gap-2 bg-white px-2">
                                <div className={`size-4 rounded-full border-2 ${isDone ? "bg-brand-primary border-brand-primary" : "bg-neutral-100 border-white ring-2 ring-neutral-100"}`} />
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${isDone ? "text-brand-primary" : "text-neutral-400"}`}>{stepText}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Expand Toggle */}
                  <button 
                    onClick={() => toggleExpand(order.id)}
                    className="w-full mt-4 flex items-center justify-center gap-2 py-3 border-t border-neutral-100 bg-neutral-50/50 hover:bg-neutral-50 text-xs font-bold text-neutral-500 transition-colors"
                  >
                    {isExpanded ? <>Sembunyikan Detail <ChevronUp className="size-4" /></> : <>Lihat Detail <ChevronDown className="size-4" /></>}
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="border-t border-neutral-100 p-5 md:p-6 bg-surface-base animate-fade-in divide-y divide-neutral-200/60">
                      
                      <div className="grid md:grid-cols-2 gap-6 pb-6">
                        <div className="space-y-4">
                          <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Detail Lokasi</p>
                          <div className="flex gap-3 text-sm">
                            <MapPin className="size-4 text-brand-primary shrink-0 mt-0.5" />
                            <div>
                              <p className="font-bold text-neutral-800">{order.address}</p>
                              {order.notes && <p className="text-xs text-neutral-500 mt-1 italic">Catatan: &quot;{order.notes}&quot;</p>}
                            </div>
                          </div>
                          <div className="flex gap-3 text-sm">
                            <CreditCard className="size-4 text-neutral-400 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-neutral-600">Metode Pembayaran</p>
                              <p className="font-bold text-neutral-800">{order.paymentMethod}</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                           <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Timeline Aktivitas</p>
                           <div className="space-y-3">
                             {order.timeline.map((tl: any, i: number) => (
                               <div key={i} className={`flex items-center justify-between text-xs ${tl.done ? "text-neutral-900" : "text-neutral-400"}`}>
                                 <div className="flex items-center gap-2">
                                   <div className={`size-1.5 rounded-full ${tl.done ? "bg-brand-primary" : "bg-neutral-300"}`} />
                                   <span>{tl.status}</span>
                                 </div>
                                 <span className="font-mono text-xs">{tl.time || "-"}</span>
                               </div>
                             ))}
                           </div>
                        </div>
                      </div>

                      {/* Action Buttons specific to order state */}
                      <div className="pt-6 flex flex-wrap gap-3 justify-end items-center">
                        {order.partner && isActive && (
                           <div className="flex-1 min-w-[200px] flex items-center gap-3">
                             <div className="size-10 rounded-full bg-brand-primary-light flex items-center justify-center text-brand-primary font-bold">
                               {order.partner.charAt(0)}
                             </div>
                             <div>
                               <p className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Mitra Bertugas</p>
                               <p className="text-sm font-bold text-neutral-900">{order.partner}</p>
                             </div>
                           </div>
                        )}

                        {isActive && (
                          <>
                            <Link href="/layanan" className="px-5 py-2.5 rounded-xl border border-neutral-200 text-sm font-bold text-neutral-700 hover:bg-neutral-50 transition">Lihat Layanan</Link>
                            <button className="px-5 py-2.5 rounded-xl bg-green-500 text-white text-sm font-bold shadow-sm hover:bg-green-600 transition flex items-center gap-2">
                              <Phone className="size-4" /> Hubungi Mitra
                            </button>
                          </>
                        )}

                        {order.status === "completed" && (
                          <>
                            <Link href={`/booking?layanan=${order.serviceName}`} className="px-5 py-2.5 rounded-xl border border-neutral-200 text-sm font-bold text-neutral-700 hover:bg-neutral-50 transition flex items-center gap-2">
                              <RotateCcw className="size-4" /> Pesan Ulang
                            </Link>
                            {!order.reviewed ? (
                              <button onClick={() => setReviewModal({ isOpen: true, orderId: order.id })} className="px-5 py-2.5 rounded-xl bg-brand-primary text-white text-sm font-bold shadow-brand transition hover:bg-brand-primary-dark flex items-center gap-2">
                                <MessageSquare className="size-4" /> Beri Ulasan
                              </button>
                            ) : (
                              <div className="px-5 py-2.5 rounded-xl bg-neutral-100 text-neutral-500 text-sm font-bold flex items-center gap-2">
                                <CheckCircle2 className="size-4" /> Ulasan Selesai
                              </div>
                            )}
                          </>
                        )}
                        
                        {order.status === "cancelled" && (
                          <Link href="/" className="px-5 py-2.5 rounded-xl border border-neutral-200 text-sm font-bold text-neutral-700 hover:bg-neutral-50 transition flex items-center gap-2">
                            Kembali ke Beranda
                          </Link>
                        )}
                      </div>
                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Review Modal */}
      {reviewModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm" onClick={() => setReviewModal({isOpen: false, orderId: null})} />
          <div className="bg-white rounded-3xl w-full max-w-lg relative z-10 p-6 sm:p-8 shadow-2xl animate-fade-in-up">
            <button onClick={() => setReviewModal({isOpen: false, orderId: null})} className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-900 rounded-full bg-neutral-50">
               <XCircle className="size-5" />
            </button>
            <h3 className="font-display text-2xl font-bold text-neutral-900 mb-2">Bagaimana kualitas layanan kami?</h3>
            <p className="text-sm text-neutral-500 mb-8">Berikan ulasan jujur untuk {orders.find((o: any) => o.id === reviewModal.orderId)?.partner}</p>
            
            <div className="flex justify-center gap-2 mb-8">
              {[1,2,3,4,5].map(star => (
                <button 
                  key={star} 
                  onClick={() => setRating(star)}
                  className={`transition-all hover:scale-110 ${rating >= star ? "text-brand-accent drop-shadow-sm" : "text-neutral-200"}`}
                >
                  <Star className="size-10" fill={rating >= star ? "currentColor" : "none"} />
                </button>
              ))}
            </div>

            <textarea 
              placeholder="Ceritakan pengalamanmu... (opsional)"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full border border-neutral-200 rounded-xl p-4 text-sm bg-neutral-50 focus:bg-white outline-none focus:border-brand-primary placeholder-neutral-400 min-h-[120px] resize-none mb-6"
            />
            
            <button 
              onClick={handleReviewSubmit}
              className="w-full rounded-xl bg-brand-primary text-white font-bold py-3.5 hover:bg-brand-primary-dark transition shadow-brand"
            >
              Kirim Ulasan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
