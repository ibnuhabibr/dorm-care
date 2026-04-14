"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mx-auto mb-6 grid size-20 place-content-center rounded-2xl bg-red-50">
          <AlertTriangle className="size-10 text-red-500" />
        </div>

        <h1 className="font-display text-2xl font-extrabold text-neutral-900 mb-3">
          Terjadi Kesalahan
        </h1>
        <p className="text-neutral-500 mb-2 leading-relaxed">
          Maaf, terjadi masalah saat memuat halaman ini. Coba muat ulang atau kembali ke beranda.
        </p>
        {error.digest && (
          <p className="text-xs text-neutral-400 font-mono mb-6">
            Error ID: {error.digest}
          </p>
        )}

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-primary-dark"
          >
            <RefreshCw className="size-4" />
            Coba Lagi
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 px-6 py-3 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50"
          >
            <Home className="size-4" />
            Ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
