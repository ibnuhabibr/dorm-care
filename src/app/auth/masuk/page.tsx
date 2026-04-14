"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useSessionStore } from "@/state/session-store";

export default function MasukPage() {
  const router = useRouter();
  const { setUser } = useSessionStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async () => {
    if (!email || !password) {
      toast.error("Email dan password wajib diisi.");
      return;
    }

    const supabase = getSupabaseBrowserClient();
    setLoading(true);

    if (!supabase) {
      setUser({
        nama: "User Dorm Care",
        email,
        noHp: "",
        role: email.includes("admin") ? "admin" : "user",
        membership: "bronze",
      });
      toast.success("Login simulasi berhasil.");
      router.push(email.includes("admin") ? "/admin" : "/profil");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    setUser({
      nama: data.user.user_metadata.first_name || data.user.email?.split("@")[0] || "User",
      email: data.user.email || email,
      noHp: data.user.user_metadata.whatsapp || "",
      role: data.user.email?.includes("admin") ? "admin" : "user",
      membership: "bronze",
    });
    toast.success("Login berhasil.");
    router.push("/profil");
  };

  const handleGoogleLogin = async () => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      toast.error("Konfigurasi Supabase belum diisi.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/profil`,
      },
    });
    setLoading(false);

    if (error) {
      toast.error(error.message);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Masukkan email terlebih dulu untuk reset password.");
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      toast.error("Konfigurasi Supabase belum diisi.");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/masuk`,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Link reset password sudah dikirim ke email.");
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl items-center py-10">
      <section className="w-full rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-5 text-center">
          <p className="section-label">Auth Dorm Care</p>
          <h1 className="h2-title mt-2 text-neutral-900">Masuk ke akun Dorm Care</h1>
        </div>

        <div className="space-y-4">
          <label className="space-y-1 text-sm font-semibold text-neutral-700">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-11 w-full rounded-xl border border-neutral-200 px-3 outline-none ring-brand-primary/30 focus:ring-2 focus:border-brand-primary"
            />
          </label>

          <label className="space-y-1 text-sm font-semibold text-neutral-700">
            Password
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-11 w-full rounded-xl border border-neutral-200 px-3 pr-11 outline-none ring-brand-primary/30 focus:ring"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-content-center text-neutral-500"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </label>

          <div className="text-right">
            <Link href="/auth/reset-password" className="text-xs font-semibold text-brand-primary">
              Lupa Password?
            </Link>
          </div>

          <button
            type="button"
            onClick={() => void handleEmailLogin()}
            disabled={loading}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-primary text-sm font-bold text-white transition hover:bg-brand-primary-dark disabled:cursor-not-allowed disabled:bg-neutral-300 btn-press"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : null}
            Login
          </button>

          <div className="flex items-center gap-3 py-1">
            <div className="h-px flex-1 bg-neutral-200" />
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-neutral-500">atau masuk dengan</p>
            <div className="h-px flex-1 bg-neutral-200" />
          </div>

          <button
            type="button"
            onClick={() => void handleGoogleLogin()}
            className="h-11 w-full rounded-xl border border-neutral-200 bg-white text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50 btn-press"
          >
            Masuk dengan Google
          </button>

          <p className="text-center text-sm text-neutral-600">
            Belum punya akun?{" "}
            <Link href="/auth/daftar" className="font-bold text-brand-primary">
              Daftar sekarang →
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
