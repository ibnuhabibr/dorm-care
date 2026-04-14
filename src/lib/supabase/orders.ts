import { getSupabaseBrowserClient } from './client';

export async function createOrder(data: {
  userId: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  address: string;
  area: string;
  scheduledDate: string;
  scheduledTime: string;
  notes?: string;
  laundryDistance?: number;
  promoCode?: string;
  discountAmount: number;
  totalAmount: number;
}) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) throw new Error('Supabase belum dikonfigurasi');
  
  // Generate order number: ORD-YYYYMMDD-XXXXXX
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
  const orderNumber = `ORD-${dateStr}-${randomStr}`;

  try {
    // Ensure profile exists to prevent foreign key constraint failure
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('profiles').upsert({
        id: data.userId,
        first_name: user.user_metadata?.first_name || user.email?.split("@")[0] || 'User',
      }, { onConflict: 'id', ignoreDuplicates: true });
    }

    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        user_id: data.userId,
        service_id: data.serviceId,
        service_name: data.serviceName,
        service_price: data.servicePrice,
        address: data.address,
        area: data.area,
        scheduled_date: data.scheduledDate,
        scheduled_time: data.scheduledTime,
        notes: data.notes || null,
        promo_code: data.promoCode || null,
        discount_amount: data.discountAmount,
        total_amount: data.totalAmount,
        status: 'pending_confirmation',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating order:', error);
      throw new Error(`Gagal membuat pesanan: ${error.message}`);
    }

    return { success: true, order, orderNumber };
  } catch (err) {
    console.error('Order creation error:', err);
    throw err;
  }
}

export async function getBookedSlots(date: string) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return [];

  try {
    const { data: bookedOrders, error } = await supabase
      .from('orders')
      .select('scheduled_time')
      .eq('scheduled_date', date)
      .in('status', ['confirmed', 'on_the_way', 'in_progress']);

    if (error) {
      console.error('Error fetching booked slots:', error);
      return [];
    }

    return bookedOrders?.map((o) => o.scheduled_time) || [];
  } catch (err) {
    console.error('Booked slots error:', err);
    return [];
  }
}

export async function validatePromoCode(code: string, totalAmount: number, memberLevel?: string) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return { valid: false, message: 'Supabase belum dikonfigurasi' };

  try {
    const { data: promo, error } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single();

    if (error || !promo) {
      return { valid: false, message: 'Kode promo tidak ditemukan' };
    }

    // Check if expired
    if (promo.expires_at && new Date(promo.expires_at) < new Date()) {
      return { valid: false, message: 'Kode promo sudah kadaluarsa' };
    }

    // Check min transaction
    if (totalAmount < promo.min_transaction) {
      return {
        valid: false,
        message: `Minimal transaksi Rp${promo.min_transaction.toLocaleString('id-ID')}`,
      };
    }

    // Check applicable level
    if (promo.applicable_level && promo.applicable_level !== memberLevel) {
      return {
        valid: false,
        message: `Promo hanya berlaku untuk member ${promo.applicable_level}`,
      };
    }

    // Check max uses
    if (promo.max_uses && promo.used_count >= promo.max_uses) {
      return { valid: false, message: 'Kuota promo sudah habis' };
    }

    // Calculate discount
    let discountAmount = 0;
    if (promo.type === 'percentage') {
      discountAmount = Math.floor((totalAmount * promo.value) / 100);
    } else {
      discountAmount = promo.value;
    }

    return {
      valid: true,
      discount: discountAmount,
      promoId: promo.id,
      message: `Diskon ${promo.type === 'percentage' ? promo.value + '%' : 'Rp' + promo.value.toLocaleString('id-ID')} diterapkan`,
    };
  } catch (err) {
    console.error('Promo validation error:', err);
    return { valid: false, message: 'Gagal validasi promo' };
  }
}

export async function getUserOrders(userId: string) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return [];

  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return [];
    }

    return orders || [];
  } catch (err) {
    console.error('Get orders error:', err);
    return [];
  }
}

export async function getOrderDetail(orderId: string) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return null;

  try {
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error) {
      console.error('Error fetching order detail:', error);
      return null;
    }

    return order;
  } catch (err) {
    console.error('Get order detail error:', err);
    return null;
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) throw new Error('Supabase belum dikonfigurasi');

  try {
    const { data: order, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      console.error('Error updating order status:', error);
      throw new Error(`Gagal update status: ${error.message}`);
    }

    return { success: true, order };
  } catch (err) {
    console.error('Update order status error:', err);
    throw err;
  }
}
