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

const defaultMessage = "Halo, saya Asisten Dorm Care. Saya online 24/7 untuk bantu soal layanan, harga, jadwal, dan status pesanan.";

export function ChatbotSidebar() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{id: string, role: string, content: string}[]>([
    { id: "welcome-1", role: "assistant", content: defaultMessage }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (newMessages: typeof messages) => {
    setIsLoading(true);
    setMessages(newMessages);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.body) throw new Error("No body");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let streamedText = "";
      let done = false;

      const asstId = Date.now().toString();
      setMessages((prev) => [...prev, { id: asstId, role: "assistant", content: "" }]);

      let buffer = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          buffer += decoder.decode(value, { stream: !done });
          const lines = buffer.split("\n");
          // Keep the last incomplete line in the buffer
          buffer = lines.pop() || "";

          let hasUpdates = false;
          for (const line of lines) {
            if (line.startsWith('0:')) {
              try {
                const textChunk = JSON.parse(line.slice(2));
                streamedText += textChunk;
                hasUpdates = true;
              } catch (e) {
                console.error("Vercel stream parsing error:", e, line);
              }
            } else if (!line.match(/^[0-9]+:/) && line.trim().length > 0) {
              // Legacy raw text fallback if endpoint doesn't strictly stream Vercek AI format
              streamedText += line + "\n";
              hasUpdates = true;
            }
          }

          if (hasUpdates) {
            setMessages((prev) => {
              const next = [...prev];
              next[next.length - 1] = { id: asstId, role: "assistant", content: streamedText };
              return next;
            });
          }
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage([...messages, { id: Date.now().toString(), role: "user", content: input }]);
    setInput("");
  };

  const canSend = useMemo(() => (input || "").trim().length > 0 && !isLoading, [input, isLoading]);


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
                    onClick={() => sendMessage([...messages, { id: Date.now().toString(), role: "user", content: action }])}
                    className="rounded-full border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-600 transition hover:border-brand-primary/30 hover:text-brand-primary-dark"
                  >
                    {action}
                  </button>
                ))}
              </div>

              <form
                className="flex items-center gap-2"
                onSubmit={handleSubmit}
              >
                <input
                  value={input}
                  onChange={handleInputChange}
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
