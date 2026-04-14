"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bot, Maximize2, Minimize2, MessageCircle, Send, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

import { chatbotQuickReplies } from "@/data/site-data";

import { useChat } from "@ai-sdk/react";

type ChatRole = "user" | "assistant";

type Message = {
  role: ChatRole;
  content: string;
};

const defaultMessage = "Halo, saya Asisten Dorm Care. Saya online 24/7 untuk bantu soal layanan, harga, jadwal, dan status pesanan.";

export function ChatbotSidebar() {
  const [open, setOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState("");

  const { messages, status, sendMessage } = useChat({
    messages: [
      { id: "welcome-1", role: "assistant", parts: [{ type: "text", text: defaultMessage }] } as any
    ]
  });

  const isLoading = status === "submitted" || status === "streaming";
  const canSend = useMemo(() => (input || "").trim().length > 0 && !isLoading, [input, isLoading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSend) return;
    sendMessage({ role: "user", parts: [{ type: "text", text: input }] });
    setInput("");
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
            className={`mb-3 flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl transition-all duration-300 ease-in-out ${
              isExpanded 
                ? "h-[85vh] w-[min(96vw,800px)]" 
                : "h-[520px] w-[min(94vw,380px)]"
            }`}
          >
            <div className="flex items-center justify-between border-b border-neutral-100 bg-neutral-50 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="relative size-10 overflow-hidden rounded-full border border-neutral-100 shadow-sm">
                  <Image src="/logo-baru.png" alt="Dorm Care Chatbot" fill className="object-cover" />
                </div>
                <div>
                  <p className="text-sm font-bold text-neutral-900">Asisten Dorm Care</p>
                  <p className="text-xs text-green-600">Online sekarang</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="grid size-8 place-content-center rounded-lg text-neutral-500 hover:bg-neutral-200"
                  aria-label="Expand chatbot"
                >
                  {isExpanded ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="grid size-8 place-content-center rounded-lg text-neutral-500 hover:bg-neutral-200"
                  aria-label="Close chatbot"
                >
                  <X className="size-4" />
                </button>
              </div>
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
                      remarkPlugins={[remarkGfm, remarkMath]}
                      rehypePlugins={[rehypeKatex]}
                      components={{
                        p: ({children}) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                        ul: ({children}) => <ul className="list-disc pl-5 mb-2 space-y-1">{children}</ul>,
                        ol: ({children}) => <ol className="list-decimal pl-5 mb-2 space-y-1">{children}</ol>,
                        li: ({children}) => <li>{children}</li>,
                        strong: ({children}) => <strong className="font-bold text-neutral-900">{children}</strong>,
                        em: ({children}) => <em className="italic">{children}</em>,
                        a: ({href, children}) => <a href={href} target="_blank" rel="noreferrer" className="text-brand-primary underline underline-offset-2">{children}</a>,
                        table: ({children}) => <div className="overflow-x-auto w-full mb-3 rounded-lg border border-neutral-200"><table className="w-full text-left text-sm border-collapse">{children}</table></div>,
                        thead: ({children}) => <thead className="bg-neutral-50">{children}</thead>,
                        th: ({children}) => <th className="border-b border-neutral-200 px-3 py-2 font-semibold text-neutral-900">{children}</th>,
                        td: ({children}) => <td className="border-b border-neutral-100 px-3 py-2 align-top">{children}</td>,
                        tr: ({children}) => <tr className="hover:bg-neutral-50/50 transition-colors last:border-b-0">{children}</tr>,
                        blockquote: ({children}) => <blockquote className="border-l-4 border-brand-primary/50 pl-3 italic text-neutral-600 my-2">{children}</blockquote>,
                        code: ({children}) => <code className="bg-neutral-100 px-1.5 py-0.5 rounded text-red-600 text-[0.85em]">{children}</code>
                      }}
                    >
                      {((message as any).content) || ((message as any).parts?.map((p: any) => p.text).join("")) || ""}
                    </ReactMarkdown>
                  ) : (
                    ((message as any).content) || ((message as any).parts?.map((p: any) => p.text).join("")) || ""
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
                    onClick={() => sendMessage({ role: "user", parts: [{ type: "text", text: action }] })}
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
