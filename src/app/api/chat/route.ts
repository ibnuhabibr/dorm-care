import { NextRequest, NextResponse } from "next/server";

const deepSeekSystemPrompt =
  "Kamu adalah asisten customer service Dorm Care yang sangat ramah, hangat, dan empatik. Kamu berbicara dengan mahasiswa yang mungkin capek atau butuh bantuan kebersihan kamar kos. Gunakan sapaan yang bersahabat seperti 'Halo Kak!' atau 'Hai!'. Berikan jawaban yang jelas, sangat membantu, dan mendukung. Gunakan formatting Markdown (seperti **bold**, *italic*, atau list) untuk membuat jawaban informatif dan rapi. Fokus membantu mereka dengan harga layanan, alur booking, dan status pesanan.";

function fallbackReply(message: string) {
  const text = message.toLowerCase();

  if (text.includes("harga") || text.includes("biaya")) {
    return "Harga layanan Dorm Care mulai Rp 20.000. Cek halaman Layanan untuk rincian lengkap per paket.";
  }

  if (text.includes("booking") || text.includes("pesan")) {
    return "Alur booking: pilih layanan, pilih jadwal, isi data kamar dan WhatsApp, lanjut pembayaran prototype, lalu pantau status di halaman Riwayat.";
  }

  if (text.includes("status") || text.includes("riwayat")) {
    return "Status order ditampilkan bertahap dari Pesanan Diterima sampai Selesai. Kamu bisa cek detailnya di menu Riwayat.";
  }

  if (text.includes("whatsapp") || text.includes("admin")) {
    return "Untuk respon tercepat, hubungi WhatsApp admin dari halaman Kontak atau tombol melayang di bawah.";
  }

  return "Pertanyaanmu sudah saya terima. Untuk bantuan cepat, kamu bisa tanyakan harga, booking, status order, atau kontak admin.";
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { message?: string };
  const message = body.message?.trim();

  if (!message) {
    return NextResponse.json({ reply: "Pesan tidak boleh kosong." }, { status: 400 });
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  const baseUrl = process.env.DEEPSEEK_BASE_URL ?? "https://api.deepseek.com";

  if (!apiKey) {
    return NextResponse.json({ reply: fallbackReply(message) });
  }

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        temperature: 0.4,
        messages: [
          { role: "system", content: deepSeekSystemPrompt },
          { role: "user", content: message },
        ],
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ reply: fallbackReply(message) });
    }

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const reply = payload.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return NextResponse.json({ reply: fallbackReply(message) });
    }

    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ reply: fallbackReply(message) });
  }
}
