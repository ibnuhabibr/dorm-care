import { NextRequest, NextResponse } from "next/server";

type WhatsappPayload = {
  phone?: string;
  customerName?: string;
  orderId?: string;
  serviceName?: string;
  paymentMethod?: string;
  total?: number;
  roomNumber?: string;
  notes?: string;
};

function sanitizePhone(phone: string) {
  const digits = phone.replace(/[^0-9]/g, "");

  if (digits.startsWith("0")) {
    return `62${digits.slice(1)}`;
  }

  return digits;
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as WhatsappPayload;

  if (!body.phone || !body.customerName || !body.serviceName || !body.orderId) {
    return NextResponse.json({ message: "Data notifikasi belum lengkap." }, { status: 400 });
  }

  const cleanPhone = sanitizePhone(body.phone);
  const totalLabel = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(body.total ?? 0);

  const whatsappText = [
    "Halo, berikut ringkasan booking Dorm Care:",
    `Nama: ${body.customerName}`,
    `Order ID: ${body.orderId}`,
    `Layanan: ${body.serviceName}`,
    `Metode bayar: ${body.paymentMethod ?? "-"}`,
    `Nomor kamar: ${body.roomNumber ?? "-"}`,
    `Total: ${totalLabel}`,
    `Catatan: ${body.notes ?? "-"}`,
    "Terima kasih sudah menggunakan Dorm Care.",
  ].join("\n");

  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappText)}`;

  return NextResponse.json({
    success: true,
    message: "Konfirmasi booking berhasil. Jendela WhatsApp dibuka untuk mengirim notifikasi ke customer.",
    whatsappUrl,
  });
}
