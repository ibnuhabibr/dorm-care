"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Loader2, Mail } from "lucide-react";
import toast from "react-hot-toast";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useSessionStore } from "@/state/session-store";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { user } = useSessionStore();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (user) {
      router.push(user.role === "admin" ? "/admin" : "/profil");
    }
  }, [user, router]);

  const handleReset = async () => {
    if (!email) {
      toast.error("Masukkan alamat email terlebih dulu.");
      return;
    }

    setLoading(true);
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      // Simulate for demo
      await new Promise((r) => setTimeout(r, 1000));
      setSent(true);
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/masuk`,
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    setSent(true);
  };

  if (sent) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-xl items-center py-10">
        <section className="w-full rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8 text-center">
          <div className="mx-auto mb-6 grid size-16 place-content-center rounded-full bg-brand-primary-light">
            <CheckCircle2 className="size-8 text-brand-primary" />
          </div>
          <h1 className="font-display text-2xl font-bold text-neutral-900 mb-2">Email Terkirim!</h1>
          <p className="text-sm text-neutral-600 mb-8 max-w-sm mx-auto">
            Kami sudah mengirim link reset password ke <span className="font-bold text-neutral-900">{email}</span>. 
            Cek inbox atau folder spam kamu.
          </p>
          <Link
            href="/auth/masuk"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-primary-dark"
          >
            <ArrowLeft className="size-4" /> Kembali ke Halaman Masuk
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl items-center py-10">
      <section className="w-full rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
        <Link
          href="/auth/masuk"
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition hover:text-brand-primary mb-6"
        >
          <ArrowLeft className="size-4" /> Kembali ke login
        </Link>

        <div className="mb-6">
          <div className="inline-flex size-12 items-center justify-center rounded-xl bg-brand-primary-light text-brand-primary mb-4">
            <Mail className="size-6" />
          </div>
          <h1 className="font-display text-2xl font-bold text-neutral-900 mb-2">Reset Password</h1>
          <p className="text-sm text-neutral-600">
            Masukkan email yang terdaftar dan kami akan kirimkan link untuk mengatur ulang kata sandi.
          </p>
        </div>

        <div className="space-y-4">
          <label className="space-y-1 text-sm font-semibold text-neutral-700">
            Alamat Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className="h-11 w-full rounded-xl border border-neutral-200 px-3 outline-none ring-brand-primary/30 transition focus:border-brand-primary focus:ring-2"
            />
          </label>

          <button
            type="button"
            onClick={() => void handleReset()}
            disabled={loading || !email}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-primary text-sm font-bold text-white transition hover:bg-brand-primary-dark disabled:cursor-not-allowed disabled:bg-neutral-300 btn-press"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : null}
            Kirim Link Reset
          </button>
        </div>
      </section>
    </div>
  );
}
