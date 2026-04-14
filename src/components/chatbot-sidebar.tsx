"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bot, MessageCircle, Send, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";

import { chatbotQuickReplies } from "@/data/site-data";

type ChatRole = "user" | "assistant";

type Message = {
  role: ChatRole;
  content: string;
};

type ChatMemory = {
  intents: Array<{
    key: string;
    samples: string[];
    answer: string;
  }>;
};

const defaultMessage =
  "Halo, saya Asisten Dorm Care. Saya online 24/7 untuk bantu soal layanan, harga, jadwal, dan status pesanan.";

function fallbackReply(input: string, memory: ChatMemory | null) {
  const text = input.toLowerCase();

  if (memory) {
    const matched = memory.intents.find((intent) =>
      intent.samples.some((sample) => text.includes(sample.toLowerCase())),
    );

    if (matched) {
      return matched.answer;
    }
  }

  if (text.includes("harga") || text.includes("biaya")) {
    return "Harga layanan Dorm Care mulai dari Rp 20.000. Kamu bisa cek detail lengkap di halaman Layanan.";
  }

  if (text.includes("booking") || text.includes("pesan")) {
    return "Flow booking: pilih layanan, tentukan jadwal, isi detail kamar, lanjut pembayaran prototype, lalu notifikasi WhatsApp dikirim otomatis.";
  }

  if (text.includes("status") || text.includes("riwayat")) {
    return "Status pesanan bisa dipantau di halaman Riwayat, dari Pending sampai Selesai.";
  }

  if (text.includes("admin") || text.includes("whatsapp") || text.includes("kontak")) {
    return "Silakan klik tombol WhatsApp untuk chat cepat dengan admin Dorm Care.";
  }

  return "Pertanyaanmu sudah masuk. Pilih quick reply atau lanjut chat agar saya bantu lebih spesifik.";
}

export function ChatbotSidebar() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [memory, setMemory] = useState<ChatMemory | null>(null);
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", content: defaultMessage }]);

  const canSend = useMemo(() => draft.trim().length > 0 && !isLoading, [draft, isLoading]);

  useEffect(() => {
    const loadMemory = async () => {
      try {
        const response = await fetch("/chatbot-memory.json");
        if (!response.ok) {
          return;
        }
        const data = (await response.json()) as ChatMemory;
        setMemory(data);
      } catch {
        setMemory(null);
      }
    };

    void loadMemory();
  }, []);

  const sendMessage = async (rawMessage: string) => {
    const message = rawMessage.trim();
    if (!message) {
      return;
    }

    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setDraft("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error("Unable to reach assistant");
      }

      const data = (await response.json()) as { reply?: string };
      const reply = data.reply?.trim() || fallbackReply(message, memory);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: fallbackReply(message, memory) }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 sm:bottom-8 sm:right-8">
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.25 }}
            className="mb-3 flex h-[520px] w-[min(94vw,380px)] flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-neutral-100 bg-neutral-50 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="grid size-9 place-content-center rounded-xl bg-brand-primary-light text-brand-primary-dark">
                  <Bot className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-neutral-900">Asisten Dorm Care</p>
                  <p className="text-xs text-green-600">Online sekarang</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid size-8 place-content-center rounded-lg text-neutral-500 hover:bg-neutral-200"
                aria-label="Close chatbot"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto bg-gradient-to-b from-white to-neutral-50 px-4 py-4">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={
                    message.role === "assistant"
                      ? "max-w-[88%] rounded-2xl rounded-tl-sm bg-white px-3 py-2 text-sm text-neutral-700 shadow-sm"
                      : "ml-auto max-w-[88%] rounded-2xl rounded-tr-sm bg-brand-primary px-3 py-2 text-sm text-white"
                  }
                >
                  {message.role === "assistant" ? (
                    <ReactMarkdown 
                      components={{
                        p: ({children}) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                        ul: ({children}) => <ul className="list-disc pl-5 mb-2 space-y-1">{children}</ul>,
                        ol: ({children}) => <ol className="list-decimal pl-5 mb-2 space-y-1">{children}</ol>,
                        li: ({children}) => <li>{children}</li>,
                        strong: ({children}) => <strong className="font-bold text-neutral-900">{children}</strong>,
                        em: ({children}) => <em className="italic">{children}</em>,
                        a: ({href, children}) => <a href={href} target="_blank" rel="noreferrer" className="text-brand-primary underline underline-offset-2">{children}</a>
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  ) : (
                    message.content
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="max-w-[88%] rounded-2xl rounded-tl-sm bg-white px-3 py-2 text-sm text-neutral-500 shadow-sm">
                  Asisten sedang menyiapkan jawaban...
                </div>
              )}
            </div>

            <div className="border-t border-neutral-100 bg-white px-3 py-3">
              <div className="mb-2 flex flex-wrap gap-2">
                {chatbotQuickReplies.map((action) => (
                  <button
                    key={action}
                    type="button"
                    onClick={() => sendMessage(action)}
                    className="rounded-full border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-600 transition hover:border-brand-primary/30 hover:text-brand-primary-dark"
                  >
                    {action}
                  </button>
                ))}
              </div>

              <form
                className="flex items-center gap-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  void sendMessage(draft);
                }}
              >
                <input
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Ketik pertanyaan kamu..."
                  className="h-10 flex-1 rounded-xl border border-neutral-200 px-3 text-sm outline-none ring-brand-primary/30 transition focus:ring"
                />
                <button
                  type="submit"
                  disabled={!canSend}
                  className="grid size-10 place-content-center rounded-xl bg-brand-primary text-white transition hover:bg-brand-primary-dark disabled:cursor-not-allowed disabled:bg-neutral-300"
                  aria-label="Send message"
                >
                  <Send className="size-4" />
                </button>
              </form>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="group flex items-center gap-2 rounded-full bg-brand-primary px-5 py-3 text-sm font-bold text-white shadow-xl transition hover:bg-brand-primary-dark"
      >
        <MessageCircle className="size-4" />
        Chat 24/7
      </button>
    </div>
  );
}
