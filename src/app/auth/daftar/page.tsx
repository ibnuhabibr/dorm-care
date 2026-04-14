"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useSessionStore } from "@/state/session-store";

const schema = z
  .object({
    namaDepan: z.string().min(2, "Nama depan minimal 2 karakter."),
    namaBelakang: z.string().min(2, "Nama belakang minimal 2 karakter."),
    noHp: z.string().min(10, "Nomor HP belum valid."),
    email: z.string().email("Email tidak valid."),
    password: z.string().min(8, "Password minimal 8 karakter."),
    konfirmasiPassword: z.string().min(8, "Konfirmasi password wajib diisi."),
    setuju: z.boolean().refine((value) => value, "Kalian harus menyetujui syarat & ketentuan."),
  })
  .refine((value) => value.password === value.konfirmasiPassword, {
    path: ["konfirmasiPassword"],
    message: "Konfirmasi password tidak sama.",
  });

type FormValues = z.infer<typeof schema>;

const defaults: FormValues = {
  namaDepan: "",
  namaBelakang: "",
  noHp: "",
  email: "",
  password: "",
  konfirmasiPassword: "",
  setuju: false,
};

function getPasswordStrength(password: string) {
  if (password.length < 8) return { label: "Lemah", color: "bg-red-500", width: "30%" };
  if (password.length < 12) return { label: "Sedang", color: "bg-brand-accent", width: "65%" };
  return { label: "Kuat", color: "bg-green-500", width: "100%" };
}

export default function DaftarPage() {
  const router = useRouter();
  const { setUser } = useSessionStore();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: defaults,
  });

  const passwordValue = useWatch({ control, name: "password" });
  const passwordStrength = getPasswordStrength(passwordValue || "");

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setUser({
        nama: `${values.namaDepan} ${values.namaBelakang}`,
        email: values.email,
        noHp: values.noHp,
        role: "user",
        membership: "bronze",
      });
      toast.success("Registrasi simulasi berhasil.");
      router.push("/profil");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          first_name: values.namaDepan,
          last_name: values.namaBelakang,
          whatsapp: values.noHp,
        },
      },
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    setUser({
      nama: `${values.namaDepan} ${values.namaBelakang}`,
      email: values.email,
      noHp: values.noHp,
      role: "user",
      membership: "bronze",
    });
    toast.success("Pendaftaran berhasil. Silakan cek email verifikasi.");
    router.push("/profil");
  };

  return (
    <div className="mx-auto flex min-h-[75vh] max-w-2xl items-center py-10">
      <section className="w-full rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 text-center">
          <p className="section-label">Auth Dorm Care</p>
          <h1 className="h2-title mt-2 text-neutral-900">Buat akun Dorm Care</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1.5 text-sm font-semibold text-neutral-700">
              Nama Depan
              <input {...register("namaDepan")} className="h-11 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none transition focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10" />
              {errors.namaDepan ? <span className="text-xs text-red-500">{errors.namaDepan.message}</span> : null}
            </label>
            <label className="space-y-1.5 text-sm font-semibold text-neutral-700">
              Nama Belakang
              <input {...register("namaBelakang")} className="h-11 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none transition focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10" />
              {errors.namaBelakang ? <span className="text-xs text-red-500">{errors.namaBelakang.message}</span> : null}
            </label>
          </div>

          <label className="space-y-1.5 text-sm font-semibold text-neutral-700">
            Nomor HP (WhatsApp)
            <input {...register("noHp")} placeholder="08xxxxxxxxxx" className="h-11 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none transition focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10" />
            <p className="text-xs text-neutral-500">Untuk notifikasi booking.</p>
            {errors.noHp ? <span className="text-xs text-red-500">{errors.noHp.message}</span> : null}
          </label>

          <label className="space-y-1.5 text-sm font-semibold text-neutral-700">
            Email Aktif
            <input type="email" {...register("email")} className="h-11 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none transition focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10" />
            {errors.email ? <span className="text-xs text-red-500">{errors.email.message}</span> : null}
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1.5 text-sm font-semibold text-neutral-700">
              Password
              <input type="password" {...register("password")} className="h-11 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none transition focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10" />
              <div className="mt-2 h-1.5 w-full rounded-full bg-neutral-100">
                <div className={`h-1.5 rounded-full transition-all ${passwordStrength.color}`} style={{ width: passwordStrength.width }} />
              </div>
              <p className="text-xs text-neutral-500">Kekuatan password: {passwordStrength.label}</p>
              {errors.password ? <span className="text-xs text-red-500">{errors.password.message}</span> : null}
            </label>
            <label className="space-y-1.5 text-sm font-semibold text-neutral-700">
              Konfirmasi Password
              <input type="password" {...register("konfirmasiPassword")} className="h-11 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none transition focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10" />
              {errors.konfirmasiPassword ? (
                <span className="text-xs text-red-500">{errors.konfirmasiPassword.message}</span>
              ) : null}
            </label>
          </div>

          <label className="flex items-start gap-2 text-sm text-neutral-700">
            <input type="checkbox" {...register("setuju")} className="mt-1 accent-brand-primary" />
            Saya setuju dengan <Link href="/syarat-ketentuan" className="font-semibold text-brand-primary hover:underline">Syarat & Ketentuan</Link>
          </label>
          {errors.setuju ? <span className="block text-xs text-red-500">{errors.setuju.message}</span> : null}

          <button
            type="submit"
            disabled={loading || !isValid}
            className="h-11 w-full rounded-xl bg-brand-primary text-sm font-bold text-white transition hover:bg-brand-primary-dark disabled:cursor-not-allowed disabled:bg-neutral-300 btn-press"
          >
            {loading ? "Memproses..." : "Daftar"}
          </button>

          <div className="flex items-center gap-3 text-xs text-neutral-400">
            <div className="h-px flex-1 bg-neutral-200" />
            ATAU DAFTAR DENGAN
            <div className="h-px flex-1 bg-neutral-200" />
          </div>

          <button
            type="button"
            onClick={async () => {
              const supabase = getSupabaseBrowserClient();
              if (!supabase) {
                toast.error("Konfigurasi Supabase belum diisi.");
                return;
              }
              const { error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                  redirectTo: `${window.location.origin}/profil`,
                },
              });
              if (error) {
                toast.error(error.message);
              }
            }}
            className="h-11 w-full rounded-xl border border-neutral-200 bg-white text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50"
          >
            Daftar dengan Google
          </button>

          <p className="text-center text-sm text-neutral-600">
            Sudah punya akun?{" "}
            <Link href="/auth/masuk" className="font-bold text-brand-primary hover:underline">
              Masuk →
            </Link>
          </p>
        </form>
      </section>
    </div>
  );
}
