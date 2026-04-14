"use client";

import { useState, useEffect, useRef } from "react";
import { Shield, Printer } from "lucide-react";

const sections = [
  {
    id: "pengumpulan",
    title: "1. Pengumpulan Data",
    content: `Dorm Care mengumpulkan data pribadi yang Anda berikan secara sukarela saat mendaftar akun, melakukan pemesanan layanan, atau menghubungi kami. Data yang dikumpulkan meliputi:

• **Nama lengkap** — untuk identifikasi pelanggan
• **Alamat email** — untuk komunikasi dan notifikasi akun
• **Nomor telepon (WhatsApp)** — untuk koordinasi layanan dan notifikasi real-time
• **Alamat lokasi** — untuk pengiriman tim kebersihan
• **Data pembayaran** — metode pembayaran yang dipilih (tidak menyimpan data kartu)

Kami juga mengumpulkan data non-pribadi secara otomatis seperti alamat IP, jenis perangkat, dan data penggunaan website untuk meningkatkan kualitas layanan.`,
  },
  {
    id: "penggunaan",
    title: "2. Penggunaan Data",
    content: `Data pribadi Anda digunakan untuk:

• **Memproses pemesanan** — mencocokkan layanan dengan kebutuhan Anda
• **Mengirim notifikasi** — status pesanan, konfirmasi, dan reminder via email/WhatsApp
• **Meningkatkan layanan** — analisis pola penggunaan untuk optimasi fitur
• **Komunikasi** — merespons pertanyaan, keluhan, atau permintaan bantuan
• **Keamanan** — mencegah penipuan dan aktivitas tidak sah
• **Promosi** — mengirim penawaran khusus (dengan persetujuan Anda)

Kami **tidak akan menjual** data pribadi Anda kepada pihak ketiga untuk tujuan pemasaran.`,
  },
  {
    id: "penyimpanan",
    title: "3. Penyimpanan & Keamanan",
    content: `Dorm Care menyimpan data Anda menggunakan layanan cloud terenkripsi (Supabase) dengan standar keamanan industri:

• **Enkripsi data** — data ditransmisikan dan disimpan dengan enkripsi SSL/TLS
• **Akses terbatas** — hanya personel yang berwenang yang dapat mengakses data
• **Backup berkala** — data di-backup secara rutin untuk mencegah kehilangan
• **Masa simpan** — data aktif disimpan selama akun Anda aktif. Data dihapus dalam 30 hari setelah penghapusan akun

Meskipun kami berupaya maksimal melindungi data Anda, tidak ada sistem yang 100% aman. Kami akan memberitahu Anda segera jika terjadi pelanggaran data.`,
  },
  {
    id: "hak-pengguna",
    title: "4. Hak Pengguna",
    content: `Sebagai pengguna Dorm Care, Anda memiliki hak:

• **Akses** — melihat data pribadi yang kami simpan tentang Anda
• **Koreksi** — memperbarui data yang tidak akurat melalui halaman Profil
• **Penghapusan** — meminta penghapusan akun dan seluruh data terkait
• **Portabilitas** — meminta salinan data Anda dalam format yang dapat dibaca
• **Penarikan persetujuan** — berhenti menerima komunikasi promosi kapan saja

Untuk menggunakan hak di atas, hubungi kami melalui halaman Kontak atau email ke privacy@dormcare.id.`,
  },
  {
    id: "cookies",
    title: "5. Cookie & Teknologi Pelacakan",
    content: `Website Dorm Care menggunakan cookie dan teknologi serupa untuk:

• **Cookie esensial** — menjaga sesi login dan preferensi pengguna
• **Cookie analitik** — menganalisis penggunaan website untuk peningkatan layanan
• **Local Storage** — menyimpan data sesi dan preferensi secara lokal di perangkat Anda

Anda dapat mengelola pengaturan cookie melalui browser Anda. Menonaktifkan cookie esensial dapat mempengaruhi fungsionalitas website.`,
  },
  {
    id: "perubahan",
    title: "6. Perubahan Kebijakan",
    content: `Dorm Care dapat memperbarui Kebijakan Privasi ini sewaktu-waktu. Perubahan signifikan akan diberitahukan melalui:

• **Banner notifikasi** di website
• **Email** ke alamat yang terdaftar
• **Pembaruan tanggal** di bagian bawah halaman ini

Penggunaan layanan Dorm Care setelah pembaruan kebijakan dianggap sebagai persetujuan Anda terhadap perubahan tersebut.`,
  },
];

export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );

    for (const sec of sections) {
      const el = sectionRefs.current[sec.id];
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="pb-20 pt-10">
      {/* Header */}
      <section className="mb-10 rounded-3xl border border-neutral-200 bg-white p-6 sm:p-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="grid size-12 place-content-center rounded-2xl bg-brand-primary-light text-brand-primary">
            <Shield className="size-6" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-extrabold text-neutral-900 sm:text-3xl">
              Kebijakan Privasi
            </h1>
            <p className="text-sm text-neutral-500">Terakhir diperbarui: 14 April 2026</p>
          </div>
        </div>
        <p className="text-neutral-600 leading-relaxed max-w-2xl">
          Dorm Care berkomitmen melindungi privasi Anda. Kebijakan ini menjelaskan bagaimana kami
          mengumpulkan, menggunakan, menyimpan, dan melindungi data pribadi saat Anda menggunakan
          layanan kami.
        </p>
      </section>

      {/* Content */}
      <div className="grid gap-8 lg:grid-cols-4">
        {/* Sticky ToC */}
        <aside className="hidden lg:block">
          <nav className="sticky top-24 space-y-1 rounded-2xl border border-neutral-200 bg-white p-4">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              Daftar Isi
            </p>
            {sections.map((sec) => (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
                  activeSection === sec.id
                    ? "bg-brand-primary-light text-brand-primary-dark font-bold"
                    : "text-neutral-600 hover:bg-neutral-50 hover:text-brand-primary-dark"
                }`}
              >
                {sec.title}
              </a>
            ))}

            <hr className="my-3 border-neutral-100" />
            <button
              type="button"
              onClick={() => window.print()}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-neutral-600 transition hover:bg-neutral-50"
            >
              <Printer className="size-4" />
              Cetak halaman
            </button>
          </nav>
        </aside>

        {/* Sections */}
        <div className="space-y-8 lg:col-span-3">
          {sections.map((sec) => (
            <section
              key={sec.id}
              id={sec.id}
              ref={(el) => { sectionRefs.current[sec.id] = el; }}
              className="scroll-mt-28 rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8"
            >
              <h2 className="font-display text-xl font-bold text-neutral-900 mb-4">{sec.title}</h2>
              <div className="prose prose-neutral prose-sm max-w-none text-neutral-600 leading-relaxed whitespace-pre-line">
                {sec.content.split("**").map((part, i) =>
                  i % 2 === 1 ? (
                    <strong key={i} className="text-neutral-800">{part}</strong>
                  ) : (
                    <span key={i}>{part}</span>
                  ),
                )}
              </div>
            </section>
          ))}

          {/* Contact */}
          <section className="rounded-2xl border border-brand-primary/20 bg-brand-primary-light/10 p-6 sm:p-8">
            <h3 className="font-display text-lg font-bold text-neutral-900 mb-2">
              Pertanyaan tentang Privasi?
            </h3>
            <p className="text-sm text-neutral-600 mb-4">
              Jika Anda memiliki pertanyaan tentang kebijakan privasi ini, hubungi tim kami.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="/kontak"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-primary-dark transition"
              >
                Hubungi Kami
              </a>
              <a
                href="mailto:privacy@dormcare.id"
                className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 px-5 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition"
              >
                privacy@dormcare.id
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
