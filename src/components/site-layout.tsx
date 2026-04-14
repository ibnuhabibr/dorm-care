"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { ChatbotSidebar } from "./chatbot-sidebar";
import { WhatsAppFloat } from "./whatsapp-float";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
      <Footer />
      <ChatbotSidebar />
      <WhatsAppFloat />
    </>
  );
}
