"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import { formatNoHp } from "@/lib/utils";
import { whatsappContact } from "@/data/site-data";

const formSchema = z.object({
  nama: z.string().min(3, "Nama minimal 3 karakter."),
  email: z.string().email("Masukkan email valid."),
  noHp: z.string().min(10, "Nomor HP terlalu pendek."),
  topik: z.string().min(1, "Pilih topik pesan."),
  pesan: z.string().min(12, "Pesan minimal 12 karakter."),
});

type ContactForm = z.infer<typeof formSchema>;

const defaultValues: ContactForm = {
  nama: "",
  email: "",
  noHp: "",
  topik: "",
  pesan: "",
};

export default function KontakPage() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm<ContactForm>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues,
  });

  const onSubmit = async (values: ContactForm) => {
    await new Promise((resolve) => setTimeout(resolve, 900));
    setSubmitted(true);
    toast.success("Pesan berhasil dikirim. Tim Dorm Care akan menghubungi kalian.");
    reset(defaultValues);
    void values;
  };

  const inputClass =
    "h-11 w-full rounded-xl border border-neutral-200 bg-white px-4 text-sm outline-none transition focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10";

  return (
    <div className="pb-20 pt-10">
      {/* Hero */}
      <section className="relative mb-10 overflow-hidden rounded-3xl bg-neutral-900 px-6 py-14 text-white sm:px-12">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand-primary/20 blur-[80px]" />
        <div className="relative z-10">
          <p className="text-[11px] font-bold uppercase tracking-widest text-brand-primary mb-3">
            Hubungi Kami
          </p>
          <h1 className="font-display text-4xl font-extrabold text-white leading-tight sm:text-5xl">
            Ada pertanyaan?
            <br />
            <span className="text-brand-primary">Kami siap bantu</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-neutral-400">
            Hubungi tim Dorm Care untuk bantuan booking, komplain, atau kerja sama.
            Respon WhatsApp kurang dari 1 jam.
          </p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-5">
        {/* Form */}
        <article className="rounded-3xl border border-neutral-200 bg-white p-6 lg:col-span-3 sm:p-8">
          <p className="section-label">Formulir Kontak</p>
          <h2 className="h2-title mt-2 text-neutral-900">Kirim pesan langsung</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-1.5 text-sm font-semibold text-neutral-700">
                Nama
                <input {...register("nama")} className={inputClass} />
                {errors.nama && (
                  <span className="text-xs text-red-500">{errors.nama.message}</span>
                )}
              </label>
              <label className="space-y-1.5 text-sm font-semibold text-neutral-700">
                Email
                <input type="email" {...register("email")} className={inputClass} />
                {errors.email && (
                  <span className="text-xs text-red-500">{errors.email.message}</span>
                )}
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-1.5 text-sm font-semibold text-neutral-700">
                Nomor HP
                <input
                  {...register("noHp")}
                  placeholder="08xxxxxxxxxx"
                  className={inputClass}
                />
                {errors.noHp && (
                  <span className="text-xs text-red-500">{errors.noHp.message}</span>
                )}
              </label>
              <label className="space-y-1.5 text-sm font-semibold text-neutral-700">
                Topik
                <select
                  {...register("topik")}
                  className={inputClass}
                >
                  <option value="">Pilih topik</option>
                  <option value="booking">Pertanyaan Booking</option>
                  <option value="komplain">Komplain Layanan</option>
                  <option value="kerja-sama">Kerja Sama</option>
                  <option value="lainnya">Lainnya</option>
                </select>
                {errors.topik && (
                  <span className="text-xs text-red-500">{errors.topik.message}</span>
                )}
              </label>
            </div>

            <label className="space-y-1.5 text-sm font-semibold text-neutral-700">
              Pesan
              <textarea
                rows={5}
                {...register("pesan")}
                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition resize-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10"
              />
              {errors.pesan && (
                <span className="text-xs text-red-500">{errors.pesan.message}</span>
              )}
            </label>

            <button
              type="submit"
              disabled={isSubmitting || !isValid}
              className="h-11 w-full rounded-xl bg-brand-primary text-sm font-bold text-white transition hover:bg-brand-primary-dark disabled:cursor-not-allowed disabled:bg-neutral-300 btn-press"
            >
              {isSubmitting ? "Memproses..." : "Kirim Pesan →"}
            </button>

            {submitted && (
              <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4" />
                  Pesan berhasil dikirim. Estimasi balasan via WhatsApp kurang dari 1 jam.
                </div>
              </div>
            )}
          </form>
        </article>

        {/* Sidebar */}
        <aside className="space-y-4 lg:col-span-2">
          {/* Contact Info */}
          <article className="rounded-3xl border border-neutral-200 bg-white p-6">
            <h2 className="font-display text-lg font-bold text-neutral-900">Info Kontak</h2>
            <div className="mt-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="grid size-9 shrink-0 place-content-center rounded-xl bg-green-50">
                  <MessageCircle className="size-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">WhatsApp</p>
                  <p className="text-sm font-medium text-neutral-900">{formatNoHp(whatsappContact.nomor)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="grid size-9 shrink-0 place-content-center rounded-xl bg-brand-primary-light">
                  <Mail className="size-4 text-brand-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">Email</p>
                  <p className="text-sm font-medium text-neutral-900">{whatsappContact.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="grid size-9 shrink-0 place-content-center rounded-xl bg-red-50">
                  <MapPin className="size-4 text-red-500" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">Alamat</p>
                  <p className="text-sm font-medium text-neutral-900">{whatsappContact.area}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="grid size-9 shrink-0 place-content-center rounded-xl bg-brand-accent-light">
                  <Clock className="size-4 text-brand-accent" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">Jam Operasional</p>
                  <p className="text-sm font-medium text-neutral-900">{whatsappContact.jamOperasional}</p>
                </div>
              </div>
            </div>
          </article>

          {/* WhatsApp CTA */}
          <article className="rounded-3xl border border-brand-primary/20 bg-brand-primary-light/30 p-6">
            <h3 className="font-display text-lg font-bold text-neutral-900">Butuh jawaban cepat?</h3>
            <p className="mt-2 text-sm text-neutral-600">
              Chat langsung dengan admin Dorm Care untuk konsultasi layanan.
            </p>
            <a
              href={`https://wa.me/${whatsappContact.nomor}?text=Halo+Dorm+Care,+saya+ingin+tanya+layanan`}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-primary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-primary-dark btn-press"
            >
              <Phone className="size-4" />
              Chat WhatsApp Sekarang
            </a>
          </article>

          {/* Google Maps */}
          <article className="overflow-hidden rounded-3xl border border-neutral-200">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15830.680263562!2d112.7873!3d-7.2831!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7fbfcd5f2ab2f%3A0x3027a76e352bcf0!2sSukolilo%2C%20Surabaya!5e0!3m2!1sid!2sid!4v1"
              width="100%"
              height="200"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Lokasi Dorm Care - Sukolilo, Surabaya"
            />
          </article>
        </aside>
      </section>
    </div>
  );
}
