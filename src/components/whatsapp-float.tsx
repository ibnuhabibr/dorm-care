"use client";

import { MessageCircle } from "lucide-react";
import { whatsappContact } from "@/data/site-data";

export function WhatsAppFloat() {
  const waLink = `https://wa.me/${whatsappContact.nomor}?text=${encodeURIComponent("Halo Dorm Care, saya ingin bertanya tentang layanan kebersihan.")}`;

  return (
    <div className="fixed bottom-6 left-6 z-40">
      {/* Pulse ring */}
      <div className="absolute inset-0 rounded-full bg-green-500/30 animate-pulse-ring" />
      
      <a
        href={waLink}
        target="_blank"
        rel="noreferrer"
        className="relative flex items-center gap-2 rounded-full bg-green-500 px-5 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-green-600 hover:shadow-xl hover:-translate-y-0.5 btn-press"
        aria-label="Chat WhatsApp"
      >
        <MessageCircle className="size-5" />
        <span className="hidden sm:inline">WhatsApp</span>
      </a>
    </div>
  );
}
