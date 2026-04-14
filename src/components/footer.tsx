import Link from "next/link";
import Image from "next/image";
import { MessageCircle, MapPin, Camera } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto bg-white border-t border-neutral-100 text-neutral-600 font-sans">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-10 lg:gap-8 border-b border-neutral-100 pb-12">
          
          {/* Brand Col */}
          <div className="space-y-6 lg:col-span-4 pr-8">
            <Link href="/" className="inline-block transition-opacity hover:opacity-80">
              <Image 
                src="/logo.webp" 
                alt="Dorm Care" 
                width={140} 
                height={40} 
                className="h-10 w-auto object-contain"
              />
            </Link>
            
            <p className="text-sm leading-relaxed text-neutral-500 max-w-sm">
              Layanan kebersihan digital untuk mahasiswa Surabaya. 
              Fokus pada kualitas, kecepatan, dan kenyamanan hidupmu di kos.
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 tracking-wide">Navigasi</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/" className="transition-colors hover:text-brand-primary">Beranda</Link></li>
              <li><Link href="/layanan" className="transition-colors hover:text-brand-primary">Layanan & Harga</Link></li>
              <li><Link href="/promo" className="transition-colors hover:text-brand-primary">Promo</Link></li>
              <li><Link href="/panduan" className="transition-colors hover:text-brand-primary">Cara Pesan</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 tracking-wide">Bantuan</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/kontak" className="transition-colors hover:text-brand-primary">Hubungi Kami</Link></li>
              <li><Link href="/tentang#faq" className="transition-colors hover:text-brand-primary">FAQ</Link></li>
              <li><Link href="/syarat-ketentuan" className="transition-colors hover:text-brand-primary">Syarat & Ketentuan</Link></li>
              <li><Link href="/privacy" className="transition-colors hover:text-brand-primary">Kebijakan Privasi</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 tracking-wide">Kontak</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" className="flex items-center gap-2 transition-colors hover:text-brand-primary">
                  <MessageCircle className="size-4" />
                  <span>WhatsApp</span>
                </a>
              </li>
              <li>
                <a href="#" target="_blank" rel="noreferrer" className="flex items-center gap-2 transition-colors hover:text-brand-primary">
                  <Camera className="size-4" />
                  <span>Instagram</span>
                </a>
              </li>
              <li className="flex items-start gap-2 text-neutral-500 mt-4 leading-relaxed">
                <MapPin className="size-4 shrink-0 mt-0.5" />
                <span>Sukolilo, Surabaya</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} Dorm Care. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="flex items-center gap-1.5 before:block before:size-1.5 before:rounded-full before:bg-green-500">
              Sistem Operasional
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
