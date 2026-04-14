"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { ChatbotSidebar } from "./chatbot-sidebar";
import { WhatsAppFloat } from "./whatsapp-float";
import { AuthGuard } from "./auth-guard";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <AuthGuard>{children}</AuthGuard>;
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8">
        <AuthGuard>{children}</AuthGuard>
      </main>
      <Footer />
      <ChatbotSidebar />
      <WhatsAppFloat />
    </>
  );
}
