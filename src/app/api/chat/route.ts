import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

const deepSeekSystemPrompt =
  "Kamu adalah asisten customer service Dorm Care yang sangat ramah, hangat, dan empatik. Kamu berbicara dengan mahasiswa yang mungkin capek atau butuh bantuan kebersihan kamar kos. Gunakan sapaan yang bersahabat seperti 'Halo Kak!' atau 'Hai!'. Berikan jawaban yang jelas, sangat membantu, dan mendukung. Gunakan formatting Markdown (seperti **bold**, *italic*, atau list) untuk membuat jawaban informatif dan rapi. Fokus membantu mereka dengan harga layanan, alur booking, dan status pesanan.";

export async function POST(request: Request) {
  const { messages } = await request.json();

  const apiKey = process.env.DEEPSEEK_API_KEY;
  const baseURL = process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com/v1";

  if (!apiKey) {
    // Gunakan static fallback stream secara manual jika tidak ada API key
    const fallbackText = "Pertanyaanmu sudah saya terima. Saat ini respon AI sedang tidak aktif. Kamu bisa cek bantuan halaman Layanan, atau Panduan.";
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(`0:${JSON.stringify(fallbackText)}\n`));
        controller.close();
      }
    });
    return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8", "x-vercel-ai-data-stream": "v1" } });
  }

  const deepseek = createOpenAI({
    baseURL,
    apiKey,
  });

  const result = streamText({
    model: deepseek("deepseek-chat"),
    system: deepSeekSystemPrompt,
    messages,
    temperature: 0.4,
  });

  return result.toTextStreamResponse();
}
