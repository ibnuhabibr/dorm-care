import Link from "next/link";
import { Copy, Camera, Mail, MessageCircle, MapPin, MousePointerClick, Calendar, ShieldCheck, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative mt-auto bg-[#1a1a1a] text-neutral-400 overflow-hidden font-sans border-t-[8px] border-brand-primary">
      {/* Decorative Brand Elements */}
      <div className="absolute top-0 right-0 p-32 opacity-5 pointer-events-none">
        <div className="w-96 h-96 bg-brand-primary rounded-full blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 mt-4 relative z-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          
          {/* Brand Col */}
          <div className="space-y-6 lg:col-span-4">
            <div className="flex items-center gap-3">
              <div className="relative size-12 bg-white rounded-2xl flex items-center justify-center shadow-lg transform -rotate-2 hover:rotate-0 transition-transform duration-300">
                <span className="text-2xl font-black text-brand-primary tracking-tighter">DC</span>
              </div>
              <h2 className="font-display text-2xl font-black text-white tracking-tight">Dorm Care.</h2>
            </div>
            
            <p className="text-sm/relaxed text-neutral-400 pr-4">
              Pionir layanan kebersihan kos & asrama profesional di Surabaya. 
              Berkomitmen memberikan ruang personal yang sehat, rapi, dan nyaman untuk mendukung produktivitasmu.
            </p>

            <div className="pt-2 flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="size-8 rounded-full border-2 border-[#1a1a1a] bg-neutral-800 flex items-center justify-center">
                    <Heart className="size-3 text-brand-primary" />
                  </div>
                ))}
              </div>
              <span className="text-xs font-medium text-neutral-300 ml-2">Dipercaya 1000+ Mahasiswa</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-white flex items-center gap-2">
              <MousePointerClick className="size-4 text-brand-primary" />
              Eksplor
            </h3>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/" className="transition-colors hover:text-brand-primary flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-neutral-700" /> Beranda</Link></li>
              <li><Link href="/layanan" className="transition-colors hover:text-brand-primary flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-neutral-700" /> Layanan Kami</Link></li>
              <li><Link href="/promo" className="transition-colors hover:text-brand-primary flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-neutral-700" /> Promo & Diskon</Link></li>
              <li><Link href="/panduan" className="transition-colors hover:text-brand-primary flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-neutral-700" /> Cara Pesan</Link></li>
            </ul>
          </div>

          {/* Legal & Bantuan */}
          <div className="lg:col-span-2">
            <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-white flex items-center gap-2">
              <ShieldCheck className="size-4 text-green-500" />
              Bantuan
            </h3>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/kontak" className="transition-colors hover:text-white flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-neutral-700" /> Hubungi Kami</Link></li>
              <li><Link href="/syarat-ketentuan" className="transition-colors hover:text-white flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-neutral-700" /> Syarat & Ketentuan</Link></li>
              <li><Link href="/syarat-ketentuan" className="transition-colors hover:text-white flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-neutral-700" /> Kebijakan Privasi</Link></li>
              <li><Link href="/tentang#faq" className="transition-colors hover:text-white flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-neutral-700" /> FAQ</Link></li>
            </ul>
          </div>

          {/* Social & Contact */}
          <div className="lg:col-span-4 rounded-3xl bg-neutral-800/40 p-6 border border-neutral-800/60 backdrop-blur-sm">
            <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-white flex items-center gap-2">
              <Calendar className="size-4 text-brand-primary" />
              Booking & Sapa Kami
            </h3>
            
            <div className="space-y-3">
              <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" className="group flex items-center justify-between rounded-xl bg-neutral-800 px-4 py-3 transition hover:bg-brand-primary">
                <div className="flex items-center gap-3">
                  <div className="bg-neutral-700 group-hover:bg-white/20 p-2 rounded-lg transition">
                    <MessageCircle className="size-4 text-white" />
                  </div>
                  <span className="text-sm font-bold text-white">WhatsApp Admin</span>
                </div>
                <span className="text-xs font-semibold text-neutral-400 group-hover:text-white/80 transition">Respon Cepat</span>
              </a>

              <a href="#" target="_blank" rel="noreferrer" className="group flex items-center justify-between rounded-xl bg-neutral-800 px-4 py-3 transition hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-600">
                <div className="flex items-center gap-3">
                  <div className="bg-neutral-700 group-hover:bg-white/20 p-2 rounded-lg transition">
                    <Camera className="size-4 text-white" />
                  </div>
                  <span className="text-sm font-bold text-white">@dormcare.sub</span>
                </div>
                <span className="text-xs font-semibold text-neutral-400 group-hover:text-white/80 transition">Follow Kami</span>
              </a>

              <div className="flex items-start gap-3 mt-6 pt-4 border-t border-neutral-800/80">
                <MapPin className="size-5 text-neutral-500 shrink-0 mt-0.5" />
                <p className="text-xs leading-relaxed text-neutral-400">
                  Keputih, Sukolilo, Surabaya<br/>
                  <span className="text-neutral-500">Senin-Jumat 08.00-20.00, Sabtu 08.00-17.00 WIB</span>
                </p>
              </div>
            </div>
          </div>
          
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between border-t border-neutral-800 pt-8 sm:flex-row text-xs font-medium text-neutral-500">
          <p>© {new Date().getFullYear()} Dorm Care Indonesia. Hak Cipta Dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}
