import Link from "next/link";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Big 404 */}
        <div className="relative mb-6">
          <p className="font-display text-[120px] font-black leading-none text-neutral-100 select-none md:text-[160px]">
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-2xl bg-brand-primary/10 p-4">
              <Search className="size-10 text-brand-primary" />
            </div>
          </div>
        </div>

        <h1 className="font-display text-2xl font-extrabold text-neutral-900 mb-3">
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-neutral-500 mb-8 leading-relaxed">
          Maaf, halaman yang kamu cari tidak ada atau sudah dipindahkan.
          Pastikan URL yang diketik sudah benar.
        </p>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-primary-dark"
          >
            <Home className="size-4" />
            Ke Beranda
          </Link>
          <Link
            href="/layanan"
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 px-6 py-3 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50"
          >
            <ArrowLeft className="size-4" />
            Lihat Layanan
          </Link>
        </div>
      </div>
    </div>
  );
}
