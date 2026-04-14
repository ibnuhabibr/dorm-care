import type { Metadata } from "next";
import { Plus_Jakarta_Sans, DM_Sans } from "next/font/google";

import { SiteLayout } from "@/components/site-layout";
import { ToasterProvider } from "@/components/ui/toaster-provider";

import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Dorm Care | Jasa Kebersihan Kos & Asrama Surabaya",
    template: "%s | Dorm Care",
  },
  description:
    "Dorm Care adalah layanan kebersihan digital untuk kos dan asrama mahasiswa area Surabaya. Booking cerdas, tim datang ke tempatmu, pantau real-time.",
  keywords: [
    "jasa kebersihan kos",
    "jasa bersih kamar surabaya",
    "dorm care",
    "cleaning service mahasiswa",
    "kebersihan asrama sukolilo",
  ],
  openGraph: {
    title: "Dorm Care | Jasa Kebersihan Kos & Asrama Surabaya",
    description:
      "Layanan kebersihan digital untuk kos dan asrama mahasiswa. Booking kapan saja, tim datang ke tempatmu.",
    siteName: "Dorm Care",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dorm Care | Jasa Kebersihan Kos Surabaya",
    description:
      "Booking layanan kebersihan kos & asrama secara digital. Area Sukolilo, Surabaya.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${plusJakartaSans.variable} ${dmSans.variable} h-full antialiased`}>
      <body className="min-h-full bg-surface-base text-neutral-800">
        <div className="fixed inset-0 -z-10 mesh-background" />
        <div className="fixed inset-0 -z-10 dot-grid opacity-50" />
        <div className="flex min-h-full flex-col">
          <SiteLayout>{children}</SiteLayout>
        </div>
        <ToasterProvider />
      </body>
    </html>
  );
}
